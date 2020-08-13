import express from 'express';
import homeRouter from './home';
import imageRouter from './image';

const router = express.Router();

router.use('/', homeRouter);
router.use('/image', imageRouter);

// router.get('/my-file/:fileName', (req, res) => {
//   fs.readFile('uploads/' + req.params.fileName, (err, data) => {
//     if (err) {
//       res.send('Some thing went wrong');
//     }
//     if (data) {
//       res.send(data);
//     } else {
//       res.send('File not found');
//     }
//   });
// });

export default router;
