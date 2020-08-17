import { Controller } from '.';
import { EMPTY_TMP_AGE } from '../config';
import Image, { IImageInput } from '../model/Image';
import dbRedis, { RedisPrefix } from '../utils/dbRedis';
import ApiError, { ErrorCode } from '../utils/errors';
import ImageConvertor from '../utils/imageConvertor';

export const getImage: Controller = async (req, res, next) => {
  let image;

  try {
    image = await Image.findById(req.params.id);
  } catch (err) {
    next(err);

    return;
  }

  res.json(image);
};

export const saveImages: Controller = async (req, res, next) => {
  const notFound: string[] = [];
  const ids: string[] = req.body;

  const promises = ids.map(id =>
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
    next(
      new ApiError(
        ErrorCode.ImageNotFound,
        `Image ${notFound[0]} not found. Incorrect id or image expired.`
      )
    );

    return;
  }

  try {
    await Image.insertMany([...imageData] as IImageInput[]);
  } catch (err) {
    next(err);

    return;
  }

  res.json(imageData);
};

export const processImage: Controller = async (req, res, next) => {
  const imageConvertor = new ImageConvertor(req.file.buffer, req.file.originalname);

  try {
    await imageConvertor.examine();
  } catch (err) {
    next(err);

    return;
  }

  const imageData = await imageConvertor.convert();

  dbRedis.client.set(
    RedisPrefix.TmpImage + imageData._id,
    JSON.stringify(imageData),
    'EX',
    Math.max(60 * 5, EMPTY_TMP_AGE - 60 * 60 * 24)
  );

  res.json(imageData);
};
