import sharp, { JpegOptions, Metadata, ResizeOptions, WebpOptions } from 'sharp';
import { ImageInput, SourceInfo, SrcCode } from '../entities/Image';
import ApiError, { ErrorCode } from './ApiError';
import FileService from './FileService';

interface ImageSourceInput {
  srcCode: SrcCode;
  mandatory: boolean;
  resize: ResizeOptions;
  format: string;
  options: WebpOptions | JpegOptions;
}

type ConvertOutput = Pick<ImageInput, 'width' | 'height' | 'aspectRatio' | 'sourcesInfo'>;

const DEFAULT_QUALITY = 60;

class ImageConvertor {
  public imageId: string;
  public metadata?: Metadata;
  private buffer: Buffer;
  static imageSourceInput: ImageSourceInput[] = [
    {
      srcCode: SrcCode.Xs,
      mandatory: true,
      resize: {
        width: 200,
        withoutEnlargement: true
      },
      format: 'webp',
      options: {
        quality: DEFAULT_QUALITY
      }
    },
    {
      srcCode: SrcCode.Sm,
      mandatory: false,
      resize: {
        width: 480,
        withoutEnlargement: true
      },
      format: 'webp',
      options: {
        quality: DEFAULT_QUALITY
      }
    },
    {
      srcCode: SrcCode.Md,
      mandatory: false,
      resize: {
        width: 1024,
        withoutEnlargement: true
      },
      format: 'webp',
      options: {
        quality: DEFAULT_QUALITY
      }
    },
    {
      srcCode: SrcCode.Lg,
      mandatory: false,
      resize: {
        width: 1920,
        withoutEnlargement: true
      },
      format: 'webp',
      options: {
        quality: DEFAULT_QUALITY
      }
    },
    {
      srcCode: SrcCode.Xl,
      mandatory: false,
      resize: {
        width: 2560,
        withoutEnlargement: true
      },
      format: 'webp',
      options: {
        quality: DEFAULT_QUALITY
      }
    },
    {
      srcCode: SrcCode.Fallback,
      mandatory: true,
      resize: {
        width: 1920,
        withoutEnlargement: true
      },
      format: 'jpeg',
      options: {
        quality: DEFAULT_QUALITY
      } as JpegOptions
    }
  ];

  constructor(buffer: Buffer, imageId: string) {
    this.buffer = buffer;
    this.imageId = imageId;

    this.filterOutSources = this.filterOutSources.bind(this);
  }

  /**
   * Reveals if with image extension is really image.
   * Also extracting metadata of image
   */
  public async examine(): Promise<Metadata> {
    try {
      const metadata = await sharp(this.buffer).metadata();
      this.metadata = metadata;

      return metadata;
    } catch {
      throw new ApiError(ErrorCode.IncorrectImageFormat, 'Incorrect or unknown image format');
    }
  }

  public async process(): Promise<ConvertOutput> {
    if (!this.metadata) {
      this.metadata = await this.examine();
    }

    FileService.ensureDestination(FileService.tmpFolderPath);

    const promises = ImageConvertor.imageSourceInput
      .filter(this.filterOutSources)
      .map(sourceInput => {
        const fullName = `${this.imageId}-${sourceInput.srcCode}.${sourceInput.format}`;
        const path = FileService.getTmpImagePath(fullName);

        return sharp(this.buffer)
          .toFormat(sourceInput.format, sourceInput.options)
          .resize(sourceInput.resize)
          .toFile(path)
          .then(({ width, height, size }) => {
            const sourceInfo: SourceInfo = {
              srcCode: sourceInput.srcCode,
              format: sourceInput.format,
              fullName,
              width,
              height,
              srcset: sourceInput.srcCode !== SrcCode.Fallback,
              size,
              path,
              url: FileService.getTmpImageUrl(fullName)
            };

            return sourceInfo;
          });
      });

    const sourcesInfoArray = await Promise.all(promises);
    const sourcesInfo = {};

    sourcesInfoArray.forEach(sourceInfo => (sourcesInfo[sourceInfo.srcCode] = sourceInfo));

    return {
      width: Math.max(...sourcesInfoArray.map(item => item.width)),
      height: Math.max(...sourcesInfoArray.map(item => item.height)),
      aspectRatio: this.metadata!.width! / this.metadata!.height!,
      sourcesInfo: sourcesInfo as ConvertOutput['sourcesInfo']
    };
  }

  /**
   * Callback function for filtering out sources of size
   * that are too large for original image dimensions
   */
  private filterOutSources(
    sourceInput: ImageSourceInput,
    index: number,
    array: ImageSourceInput[]
  ): boolean {
    return (
      sourceInput.mandatory ||
      sourceInput.resize.width! <= this.metadata!.width! ||
      (array[index - 1]?.srcCode !== SrcCode.Fallback &&
        array[index - 1].resize.width! < this.metadata!.width!)
    );
  }
}

export default ImageConvertor;
