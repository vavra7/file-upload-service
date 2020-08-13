import { Controller } from '.';
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

  console.log(convertOutputInfo);

  res.send('done');
};
