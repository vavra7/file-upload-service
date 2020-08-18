import multer, { diskStorage, memoryStorage } from 'multer';
import path from 'path';
import { v4 } from 'uuid';
import { Bucket } from '../config';

export const imageUpload = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 3000000,
    files: 1
  }
}).single('image');

export const fileUpload = multer({
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, `public/${Bucket.Temporary}`);
    },
    filename: (req, file, cb) => {
      cb(null, v4() + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 2000000,
    files: 1
  }
}).single('file');
