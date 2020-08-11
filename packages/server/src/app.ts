import express from 'express';
import routes from './routes';
import cors from 'cors';
import { PORT } from './config';

const app = express();

app.use(cors());
// app.use((res, req, next) => setTimeout(next, 500));
app.use(express.static('public'));
app.use('/', routes);

app.listen(PORT, () => console.log('ready - started server on http://localhost:%s', PORT));
