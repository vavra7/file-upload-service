import express from 'express';
import upload from 'express-fileupload';

const PORT = 4000;

const app = express();

app.use(upload());

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
app.post('/', (req, res) => {
  const file = req.files?.file;

  if (file && !(file instanceof Array)) {
    file.mv('./uploads/' + file.name, (err: any) => {
      if (err) {
        res.send(err);
      } else {
        res.send('File uploaded');
      }
    });
  }
});

app.listen(PORT, () => console.log('ready - started server on http://localhost:%s', PORT));
