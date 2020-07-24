import express from 'express';
import upload from 'express-fileupload';
import fs from 'fs';

const PORT = 4000;

const app = express();

app.use(upload());

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

app.post('/', (req, res) => {
  const file = req.files?.file;

  if (file && !(file instanceof Array)) {
    file.mv('uploads/test.jpg', (err: any) => {
      if (err) {
        res.send(err);
      } else {
        res.send('File uploaded');
      }
    });
  }
});

app.get('/my-file/:fileName', (req, res) => {
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

app.listen(PORT, () => console.log('ready - started server on http://localhost:%s', PORT));
