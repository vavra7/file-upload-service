import express, { Application } from 'express';
import routes from './routes';
import cors from 'cors';
import { PORT } from './config';
import handleErrors from './middlewares/handleErrors';

class App {
  public app: Application;

  constructor() {
    this.app = express();

    this.connectDatabase();
    this.initApp();
  }

  public listen(): void {
    this.app.listen(PORT, () => console.log('ready - started server on http://localhost:%s', PORT));
  }

  private connectDatabase(): void {
    console.log('TODO database connection');
  }

  private initApp(): void {
    this.app.use(cors());
    this.app.use(express.static('public'));
    this.app.use('/', routes);
    this.app.use(handleErrors);
  }
}

new App().listen();
