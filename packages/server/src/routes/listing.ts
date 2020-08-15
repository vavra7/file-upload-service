import express from 'express';
import { createListing, getListing } from '../controllers/listing';
import { bodyJson } from '../middlewares/bodyParser';

const router = express.Router();

router.get('/:id', getListing);
router.post('/', bodyJson, createListing);

export default router;
