import { Controller } from '.';

import sharp, { Metadata } from 'sharp';
import ApiError, { ErrorCode } from '../utils/errors';

export const processImage: Controller = async (req, res, next) => {
  const image = sharp(req.file.buffer);
  let imageMeta: Metadata;

  try {
    imageMeta = await image.metadata();
  } catch {
    next(new ApiError(ErrorCode.IncorrectImageFormat, 'Incorrect or unknown image format'));

    return;
  }

  console.log(imageMeta);
  res.send('done');
};
