import { Controller } from '.';
import { EMPTY_TMP_AGE } from '../config';
import dbRedis, { RedisPrefix } from '../utils/dbRedis';
import ImageConvertor from '../utils/imageConvertor';

export const processImage: Controller = async (req, res, next) => {
  const imageConvertor = new ImageConvertor(req.file.buffer, req.file.originalname);

  try {
    await imageConvertor.examine();
  } catch (err) {
    next(err);

    return;
  }

  const convertOutputInfo = await imageConvertor.convert();

  dbRedis.client.set(
    RedisPrefix.TmpImage + convertOutputInfo.id,
    JSON.stringify(convertOutputInfo),
    'EX',
    Math.max(60, EMPTY_TMP_AGE - 60 * 60 * 24)
  );

  res.send('done');
};

export const getImage: Controller = (req, res) => {
  //   fs.readFile('uploads/' + req.params.fileName, (err, data) => {
  //     if (err) {
  //       res.send('Some thing went wrong');
  //     }
  //     if (data) {
  //       res.send(data);
  //     } else {
  //       res.send('File not found');
  //     }
  //   });

  res.send('TODO get based on bucket');
};
