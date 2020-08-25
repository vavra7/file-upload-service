import express from 'express';
import FileHandler from '../handlers/FileHandler';
import { bodyJson } from '../middlewares/bodyParser';
import { fileUpload } from '../middlewares/uploads';
import ApiError, { ErrorCode } from '../utils/ApiError';

const router = express.Router();

/**
 * @swagger
 *
 * /file/{id}:
 *   get:
 *     summary: Returns file data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: File data
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *     tags:
 *       - File
 */
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const file = await FileHandler.get(id);

    if (!file) throw new ApiError(ErrorCode.FileNotFound, `File '${id}' was not found`);

    res.json(file);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 *
 * /file/download/{id}:
 *   get:
 *     summary: Downloads file
 *     produces:
 *      - application/octet-stream
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Downloads file
 *       404:
 *         description: File not found
 *     tags:
 *       - File
 */
router.get('/download/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const file = await FileHandler.get(id);

    if (!file) throw new ApiError(ErrorCode.FileNotFound, `File '${id}' was not found`);

    res.setHeader('Content-Type', file.mimeType);
    res.download(file.path, file.originalFullName);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 *
 * /file:
 *   put:
 *     summary: Saves files from temporary folder into regular one
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
 *         description: Array of files data
 *     tags:
 *       - File
 */
router.put('/', bodyJson, async (req, res, next) => {
  try {
    const ids = req.body;

    if (!ids?.length) throw new ApiError(ErrorCode.InvalidInput, 'Missing file ids');

    const files = await FileHandler.saveFiles(ids);

    res.json(files);
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

    const fileData = FileHandler.process(file);

    res.json(fileData);
  } catch (err) {
    next(err);
  }
});

export default router;
