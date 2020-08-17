import express from 'express';
import { getImage, processImage, saveImages } from '../controllers/image';
import { bodyJson } from '../middlewares/bodyParser';
import { imageUpload } from '../middlewares/uploads';

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
 *     tags:
 *       - Image
 */
router.get('/:id', getImage);

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
router.put('/', bodyJson, saveImages);

/**
 * @swagger
 *
 * /image:
 *   post:
 *     summary: Image upload and storing in temporary file
 *     responses:
 *       200:
 *         description: Image data
 *     tags:
 *       - Image
 */
router.post('/', imageUpload, processImage);

export default router;
