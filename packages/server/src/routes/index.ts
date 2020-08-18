import express from 'express';
import fileRouter from './file';
import imageRouter from './image';
import listingRouter from './listing';

const router = express.Router();

router.use('/file', fileRouter);
router.use('/image', imageRouter);
router.use('/listing', listingRouter);

export default router;
