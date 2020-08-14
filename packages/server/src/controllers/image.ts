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
