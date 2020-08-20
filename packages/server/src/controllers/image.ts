import fs from 'fs';
import mkdirp from 'mkdirp';
import moment from 'moment';
import { Bucket, EXPIRE_REDIS_TMP, URL } from '../config';
import Image, { IImage, IImageInput, SizeInfo } from '../model/Image';
import ApiError, { ErrorCode } from '../utils/ApiError';
import dbRedis, { RedisPrefix } from '../utils/dbRedis';
import ImageConvertor from '../utils/ImageConvertor';

export default {
  getImage: async function (id: IImage['_id']): Promise<IImage | null> {
    return Image.findById(id);
  },
  saveImages: async function (ids: Array<IImage['_id']>): Promise<IImage[]> {
    const redisNotFound: string[] = [];
    const uniqueIds = ids.filter((id, index) => ids.indexOf(id) === index);
    const promisesRedis = uniqueIds.map(id =>
      dbRedis.client.get(RedisPrefix.TmpImage + id).then(res => {
        if (res) {
          return JSON.parse(res);
        } else {
          redisNotFound.push(id);

          return null;
        }
      })
    );

    const imagesData: IImageInput[] = await Promise.all(promisesRedis);

    if (redisNotFound.length) {
      throw new ApiError(
        ErrorCode.ImageNotFound,
        `Some temporary images were not found. Incorrect id, image expired or image was already saved.`,
        {
          missingImages: redisNotFound
        }
      );
    }

    const moveErrors: Error[] = [];
    const promisesMove: Promise<boolean>[] = [];
    const bucket = Bucket.Image;
    const dateFolder = moment().format('YY-MM');

    if (!fs.existsSync(`public/${bucket}/${dateFolder}`)) {
      mkdirp.sync(`public/${bucket}/${dateFolder}`);
    }

    // TODO: encapsulate functionality
    imagesData.forEach(imageInput => {
      for (const sizeCode in imageInput.sizes) {
        const sizeInfo: SizeInfo = imageInput.sizes[sizeCode];
        const oldPath = sizeInfo.path;
        const newPath = `public/${bucket}/${dateFolder}/${sizeInfo.name}`;
        const newUrl = `${URL}/${bucket}/${dateFolder}/${sizeInfo.name}`;
        const promise: Promise<boolean> = new Promise((resolve, reject) => {
          fs.rename(oldPath, newPath, err => {
            if (err) {
              reject(err);
            } else {
              sizeInfo.path = newPath;
              sizeInfo.url = newUrl;

              resolve(true);
            }
          });
        });

        promisesMove.push(promise);
      }

      dbRedis.client.del(RedisPrefix.TmpImage + imageInput._id);
    });

    await Promise.all(promisesMove).catch(err => moveErrors.push(err));

    if (moveErrors.length) {
      throw moveErrors[0];
    }

    return await Image.insertMany(imagesData);
  },
  processImage: async function (buffer: Buffer, originalName?): Promise<IImageInput> {
    const imageConvertor = new ImageConvertor(buffer, originalName);

    await imageConvertor.examine();

    const imageData = await imageConvertor.convert();

    dbRedis.client.set(
      RedisPrefix.TmpImage + imageData._id,
      JSON.stringify(imageData),
      'EX',
      EXPIRE_REDIS_TMP
    );

    return imageData;
  }
};
