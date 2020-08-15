import express from 'express';
import homeRouter from './home';
import imageRouter from './image';
import listingRouter from './listing';

const router = express.Router();

router.use('/', homeRouter);
router.use('/image', imageRouter);
router.use('/listing', listingRouter);

export default router;
