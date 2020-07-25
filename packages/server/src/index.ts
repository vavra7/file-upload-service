import express from 'express';
import routes from './routes';

const PORT = 4000;

const app = express();

app.use(express.static('public'));
app.use('/', routes);

app.listen(PORT, () => console.log('ready - started server on http://localhost:%s', PORT));
