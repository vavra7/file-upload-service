import express from 'express';
import { getImage, processImage, saveImages } from '../controllers/image';
import { bodyJson } from '../middlewares/bodyParser';
import { imageUpload } from '../middlewares/uploads';
import ApiError, { ErrorCode } from '../utils/errors';

const router = express.Router();

/**
 * @swagger
 *
 * /image/{id}:
 *   get:
 *     summary: Returns image data if image is saved
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Image data
 *       404:
 *         description: Image not found
 *     tags:
 *       - Image
 */
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const image = await getImage(id);

    if (!image) throw new ApiError(ErrorCode.ImageNotFound, `Image ${id} not found.`);

    res.json(image);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 *
 * /image:
 *   put:
 *     summary: Saves image from temporary bucket into regular one
 *     parameters:
 *       - in: body
 *         required: true
 *         name: ids
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *     responses:
 *       200:
 *         description: Array of images data
 *     tags:
 *       - Image
 */
router.put('/', bodyJson, async (req, res, next) => {
  try {
    const ids = req.body;

    if (!ids?.length) throw new ApiError(ErrorCode.InvalidInput, 'Missing image ids');

    const images = await saveImages(ids);

    res.json(images);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 *
 * /image:
 *   post:
 *     summary: Image upload and storing in temporary file
 *     consumes:
 *      - multipart/form-data
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: file
 *         in: formData
 *         required: true
 *         type: file
 *     responses:
 *       200:
 *         description: Image data
 *     tags:
 *       - Image
 */
router.post('/', imageUpload, async (req, res, next) => {
  try {
    const buffer = req.file?.buffer;

    if (!buffer) throw new ApiError(ErrorCode.InvalidInput, 'No image was received');

    const originalName = req.file.originalname;

    const image = await processImage(buffer, originalName);

    res.json(image);
  } catch (err) {
    next(err);
  }
});

export default router;
