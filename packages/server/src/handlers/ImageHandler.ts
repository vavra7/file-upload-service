import mime from 'mime-types';
import path from 'path';
import { IImage, ImageInput, SrcCode } from '../entities/Image';
import ImageManager, { ImageCreate } from '../model/ImageManager';
import ApiError, { ErrorCode } from '../utils/ApiError';
import dbRedis, { expiryTime, RedisPrefix } from '../utils/dbRedis';
import FileService from '../utils/FileService';
import ImageConvertor from '../utils/ImageConvertor';
import ImageTracer from '../utils/ImageTracer';

function generateSrcset(sourcesInfo: ImageInput['sourcesInfo']): ImageInput['srcset'] {
  let srcset = '';
  Object.values(SrcCode).forEach((srcCode, index) => {
    const sourceInfo = sourcesInfo[srcCode];

    if (!sourceInfo?.srcset) return;

    srcset = srcset.concat(`${index > 0 ? '\n' : ''}${sourceInfo.url} ${sourceInfo.width}w,`);
  });

  return srcset;
}

class ImageHandler {
  /**
   * Get image data
   * @param id
   */
  static async get(id: string): Promise<IImage | null> {
    return ImageManager.get(id);
  }

  /**
   * Processing images after upload
   * @param buffer
   * @param fullOriginalName
   */
  static async process(buffer: Buffer, fullOriginalName: string): Promise<ImageInput> {
    const id = ImageManager.generateId();

    const imageConvertor = new ImageConvertor(buffer, id);
    const imageTracer = new ImageTracer(buffer);

    const [convertOutput, tracedSvg] = await Promise.all([
      imageConvertor.process(),
      imageTracer.generate()
    ]);

    const imageData: ImageInput = {
      _id: id,
      originalName: path.parse(fullOriginalName).name,
      originalFullName: fullOriginalName,
      width: convertOutput.width,
      height: convertOutput.height,
      aspectRatio: convertOutput.aspectRatio,
      tracedSvg,
      srcsetType: mime.lookup(convertOutput.sourcesInfo.xs.format) || '',
      srcset: generateSrcset(convertOutput.sourcesInfo),
      src: convertOutput.sourcesInfo.fallback.url,
      sourcesInfo: convertOutput.sourcesInfo
    };

    dbRedis.client.set(
      RedisPrefix.TmpImage + imageData._id,
      JSON.stringify(imageData),
      'EX',
      expiryTime.tmp
    );

    return imageData;
  }

  /**
   * Saves temporary images to database
   * @param ids
   */
  static async saveImages(ids: string[]): Promise<IImage[]> {
    const redisNotFound: string[] = [];
    const uniqueIds = ids.filter((id, index) => ids.indexOf(id) === index);
    const promisesRedis = uniqueIds.map(id =>
      dbRedis.client.get(RedisPrefix.TmpImage + id).then((res): ImageInput | null => {
        if (res) {
          return JSON.parse(res);
        } else {
          redisNotFound.push(id);

          return null;
        }
      })
    );

    const tmpImageInputs = await Promise.all(promisesRedis);

    if (redisNotFound.length) {
      throw new ApiError(
        ErrorCode.ImageNotFound,
        `Some temporary images were not found. Incorrect id, image expired or image was already saved.`,
        {
          missingImages: redisNotFound
        }
      );
    }

    const updatedImageInputs: ImageCreate[] = [];

    await Promise.all(
      (tmpImageInputs as ImageInput[]).map(imageInput => {
        return FileService.moveTmpImage(imageInput.sourcesInfo).then(updatedSourcesInfo => {
          const updatedImageInput: ImageCreate = {
            ...imageInput,
            srcset: generateSrcset(updatedSourcesInfo),
            src: updatedSourcesInfo.fallback.url,
            sourcesInfo: updatedSourcesInfo
          };

          dbRedis.client.del(RedisPrefix.TmpImage + imageInput._id);
          updatedImageInputs.push(updatedImageInput);
        });
      })
    );

    return await ImageManager.createMany(updatedImageInputs);
  }
}

export default ImageHandler;
