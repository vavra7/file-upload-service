import express from 'express';
import fs from 'fs';

const router = express.Router();

router.get('/', (req, res) => res.send('Home'));
router.get('/test', (req, res) => res.send('Test'));

router.get('/my-file/:fileName', (req, res) => {
  fs.readFile('uploads/' + req.params.fileName, (err, data) => {
    if (err) {
      res.send('Some thing went wrong');
    }
    if (data) {
      res.send(data);
    } else {
      res.send('File not found');
    }
  });
});

export default router;
