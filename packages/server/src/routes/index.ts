import express from 'express';
import homeRouter from './home';
import imageRouter from './image';

const router = express.Router();

router.use('/', homeRouter);
router.use('/image', imageRouter);

export default router;
