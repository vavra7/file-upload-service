import multer from 'multer';

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5000000,
    files: 1
  }
}).single('file');
