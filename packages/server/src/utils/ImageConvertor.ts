import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import sharp, { Metadata, Sharp } from 'sharp';
import { v4 } from 'uuid';
import { Bucket, URL } from '../config';
import { IImageInput, SizeCode, SizeInfo } from '../model/Image';
import ApiError, { ErrorCode } from './ApiError';

enum OutputFormat {
  Jpeg = 'jpeg',
  Png = 'png'
}

interface SizeObject {
  code: SizeCode;
  resizeArgs: number[];
}

const DEFAULT_SIZES: SizeObject[] = [
  {
    code: SizeCode.Xs,
    resizeArgs: [150, 150]
  },
  {
    code: SizeCode.Sm,
    resizeArgs: [300]
  },
  {
    code: SizeCode.Md,
    resizeArgs: [640]
  },
  {
    code: SizeCode.Lg,
    resizeArgs: [1024]
  },
  {
    code: SizeCode.Xl,
    resizeArgs: [1632]
  },
  {
    code: SizeCode.Full,
    resizeArgs: []
  }
];

class ImageConvertor {
  private imageId: string;
  private destination = `public/${Bucket.Temporary}`;
  public originalName: string;
  public image: Sharp;
  public metadata: Metadata | undefined;
  public sizes: SizeObject[] | undefined;
  public outputFormat: OutputFormat | undefined;
  public convertToPng = false;
  public convertOutputInfo: IImageInput | undefined;

  constructor(buffer: Buffer, originalName?: string) {
    if (!fs.existsSync(this.destination)) {
      mkdirp.sync(this.destination);
    }
    this.originalName = originalName ?? '';
    this.imageId = v4();
    this.image = sharp(buffer);
  }

  /**
   * Examine image and sets class properties
   */
  public async examine(): Promise<ImageConvertor> {
    try {
      this.metadata = await this.image.metadata();
    } catch {
      throw new ApiError(ErrorCode.IncorrectImageFormat, 'Incorrect or unknown image format');
    }

    this.defineSizes(this.metadata!);
    this.defineOutputFormat(this.metadata!);

    return this;
  }

  public convert(): Promise<IImageInput> {
    if (!this.metadata || !this.sizes || !this.outputFormat) this.examine();

    const promises: Promise<SizeInfo>[] = [];

    this.sizes!.forEach(sizeObject => promises.push(this.convertToSize(this.image, sizeObject)));

    return Promise.all(promises).then(result => {
      const sizes = {};

      result.forEach(sizeOutputInfo => (sizes[sizeOutputInfo.code] = sizeOutputInfo));

      const convertOutputInfo = {
        _id: this.imageId,
        mimeType: `image/${this.outputFormat}`,
        originalName: this.originalName,
        sizes: sizes as IImageInput['sizes']
      };

      this.convertOutputInfo = convertOutputInfo;

      return convertOutputInfo;
    });
  }

  /**
   * Converts original image into particular size
   * @param image
   * @param sizeObject
   */
  private convertToSize(image: Sharp, { resizeArgs, code }: SizeObject): Promise<SizeInfo> {
    const name = `${this.imageId}-${code}.${this.outputFormat}`;
    let converted = image.resize(...resizeArgs);

    if (this.convertToPng) {
      converted = converted.png();
    }

    return converted
      .toFile(`${path.join(this.destination, this.imageId)}-${code}.${this.outputFormat}`)
      .then(outputInfo => ({
        code,
        name,
        width: outputInfo.width,
        height: outputInfo.height,
        size: outputInfo.size,
        path: `${this.destination}/${name}`,
        url: `${URL}/${Bucket.Temporary}/${name}`
      }));
  }

  /**
   * Defines generated sizes based on original image size
   * @param metadata
   */
  private defineSizes(metadata: Metadata): void {
    const originalWidth = metadata.width!;

    this.sizes = DEFAULT_SIZES.filter(
      defaultSize =>
        !(defaultSize.code !== SizeCode.Full && originalWidth <= defaultSize.resizeArgs[0])
    );
  }

  /**
   * Defines image output format
   * @param metadata
   */
  private defineOutputFormat(metadata: Metadata): void {
    const originalFormat = metadata.format!;

    const isOutputFormat = (someFormat: any): someFormat is OutputFormat =>
      Object.values(OutputFormat).includes(someFormat);

    if (isOutputFormat(originalFormat)) {
      this.outputFormat = originalFormat;
      this.convertToPng = false;
    } else {
      this.outputFormat = OutputFormat.Png;
      this.convertToPng = true;
    }
  }
}

export default ImageConvertor;
