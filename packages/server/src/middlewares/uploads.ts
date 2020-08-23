import multer, { diskStorage, memoryStorage } from 'multer';
import path from 'path';
import FileManager from '../model/FileManager';
import FileService from '../utils/FileService';

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
      cb(null, FileService.tmpFolderPath);
    },
    filename: (req, file, cb) => {
      cb(null, FileManager.generateId() + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 2000000,
    files: 1
  }
}).single('file');
