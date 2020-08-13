import express from 'express';
import multer from 'multer';
import { processImage } from '../controllers/image';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500000,
    files: 1
  }
});

router.post('/', upload.single('file'), processImage);

export default router;
