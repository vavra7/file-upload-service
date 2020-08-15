import express from 'express';
import { createListing, getListing } from '../controllers/listing';
import { bodyJson } from '../middlewares/bodyParser';

const router = express.Router();

/**
 * @swagger
 *
 * /listing/{id}:
 *   get:
 *     description: Returns listing
 *     parameters:
 *       - in: path
 *         name: id
 *     responses:
 *       200:
 *         description: Listing data
 */
router.get('/:id', getListing);

/**
 * @swagger
 *
 * /listing:
 *   post:
 *    description: Creates new listing
 */
router.post('/', bodyJson, createListing);

export default router;
