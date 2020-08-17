import { EMPTY_TMP_AGE } from '../config';
import Image, { IImage, IImageInput } from '../model/Image';
import dbRedis, { RedisPrefix } from '../utils/dbRedis';
import ApiError, { ErrorCode } from '../utils/errors';
import ImageConvertor from '../utils/imageConvertor';

export async function getImage(id: IImage['_id']): Promise<IImage | null> {
  return Image.findById(id);
}

export async function saveImages(ids: Array<IImage['_id']>): Promise<IImage[]> {
  const notFound: string[] = [];
  const uniqueIds = ids.filter((id, index) => ids.indexOf(id) === index);

  const promises = uniqueIds.map(id =>
    dbRedis.client.get(RedisPrefix.TmpImage + id).then(res => {
      if (res) {
        return JSON.parse(res);
      } else {
        notFound.push(id);

        return null;
      }
    })
  );

  const imageData = await Promise.all(promises);

  if (notFound.length) {
    throw new ApiError(
      ErrorCode.ImageNotFound,
      `Some images not found. Incorrect id or image expired.`,
      {
        missingImages: notFound
      }
    );
  }

  return await Image.insertMany([...imageData] as IImageInput[]);
}

export async function processImage(buffer: Buffer, originalName?): Promise<IImageInput> {
  const imageConvertor = new ImageConvertor(buffer, originalName);

  await imageConvertor.examine();

  const imageData = await imageConvertor.convert();

  dbRedis.client.set(
    RedisPrefix.TmpImage + imageData._id,
    JSON.stringify(imageData),
    'EX',
    Math.max(60 * 5, EMPTY_TMP_AGE - 60 * 60 * 24)
  );

  return imageData;
}
