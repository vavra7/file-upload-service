import express from 'express';
import multer from 'multer';
import storage from '../lib/storageEngine';

const router = express.Router();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500000
  }
});

router.get('/', (req, res) => res.send('Home'));
router.post('/image-upload', upload.single('file'), (req, res) => {
  // console.log('after', (req.file as any).convertOutputInfo);
  // console.log('after', req.file);

  res.send('done');
});

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
