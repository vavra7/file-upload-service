import express from 'express';
import { listingInputSchema } from '../entities/Listing';
import ListingHandler from '../handlers/ListingHandler';
import { bodyJson } from '../middlewares/bodyParser';
import ApiError, { ErrorCode } from '../utils/ApiError';

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
 *       404:
 *         description: Listing not found
 *     tags:
 *       - Listing
 */
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const listing = await ListingHandler.get(id);

    if (!listing) throw new ApiError(ErrorCode.ListingNotFound, `Listing '${id}' was not found`);

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
    const listingInput = req.body;

    listingInputSchema.validateSync(listingInput, { abortEarly: false });

    const listing = await ListingHandler.create(listingInput);

    res.json(listing);
  } catch (err) {
    next(err);
  }
});

export default router;
