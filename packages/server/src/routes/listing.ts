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
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const listing = await getListing(id);

    res.json(listing);
  } catch (err) {
    next(err);
  }
});

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
router.post('/', bodyJson, async (req, res, next) => {
  try {
    // TODO: validate input
    const listingInput = req.body;

    const listing = await createListing(listingInput);

    res.json(listing);
  } catch (err) {
    next(err);
  }
});

export default router;
