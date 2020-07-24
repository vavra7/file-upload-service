import express from 'express';

const PORT = 4000;

const app = express();

app.get('/', (req, res) => res.json({ hello: 'world' }));

app.listen(PORT, () => console.log('ready - started server on http://localhost:%s', PORT));
