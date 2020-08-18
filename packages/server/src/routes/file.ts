import express from 'express';
import fileController from '../controllers/file';
import { fileUpload } from '../middlewares/uploads';
import ApiError, { ErrorCode } from '../utils/ApiError';

const router = express.Router();

router.get('/:id', (req, res, next) => {
  try {
    res.send('TODO');
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 *
 * /file:
 *   post:
 *     summary: File upload and storing in temporary folder
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
 *         description: File data
 *     tags:
 *       - File
 */
router.post('/', fileUpload, async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) throw new ApiError(ErrorCode.InvalidInput, 'No file was received');

    const fileData = await fileController.processFile(file);

    res.json(fileData);
  } catch (err) {
    next(err);
  }
});

export default router;
