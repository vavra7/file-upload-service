import cors from 'cors';
import express, { Application } from 'express';
import { PORT } from './config';
import handleErrors from './middlewares/handleErrors';
import routes from './routes';
import dbMongo from './utils/dbMongo';
import dbRedis from './utils/dbRedis';
import { removeTmpFiles } from './utils/scheduledJobs';

class App {
  public app: Application;

  constructor() {
    this.app = express();

    this.connectDatabases();
    this.initApp();
    this.startScheduledJobs();
  }

  public listen(): void {
    this.app.listen(PORT, () => console.log('ready - started server on http://localhost:%s', PORT));
  }

  private connectDatabases(): void {
    dbRedis.createConnection();
    dbMongo.createConnection();
  }

  private initApp(): void {
    this.app.use(cors());
    this.app.use(express.static('public'));
    this.app.use('/', routes);
    this.app.use(handleErrors);
  }

  private startScheduledJobs(): void {
    removeTmpFiles.start();
  }
}

new App().listen();
