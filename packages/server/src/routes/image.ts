import express from 'express';
import { getImage, processImage } from '../controllers/image';
import { imageUpload } from '../middlewares/uploads';

const router = express.Router();

router.post('/', imageUpload, processImage);
router.get('/:imageName', getImage);

export default router;
