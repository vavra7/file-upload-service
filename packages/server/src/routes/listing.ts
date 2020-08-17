import express from 'express';
import { createListing, getListing } from '../controllers/listing';
import { bodyJson } from '../middlewares/bodyParser';

const router = express.Router();

/**
 * @swagger
 *
 * /listing/{id}:
 *   get:
 *     summary: Returns listing
 *     parameters:
 *       - in: path
 *         name: id
 *     responses:
 *       200:
 *         description: Listing data
 *     tags:
 *       - Listing
 */
router.get('/:id', getListing);

/**
 * @swagger
 *
 * /listing:
 *   post:
 *     summary: Creates a new listing
 *     responses:
 *       200:
 *         description: Listing data
 *     tags:
 *       - Listing
 */
router.post('/', bodyJson, createListing);

export default router;
