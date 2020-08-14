import express from 'express';
import { processImage, getImage } from '../controllers/image';
import { imageUpload } from '../middlewares/upload';

const router = express.Router();

router.post('/', imageUpload, processImage);
router.get('/:imageName', getImage);

export default router;
