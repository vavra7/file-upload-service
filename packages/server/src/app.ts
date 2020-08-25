import cors from 'cors';
import express, { Application } from 'express';
import { baseUrl, port } from './config';
import handleErrors from './middlewares/handleErrors';
import routes from './routes';
import dbMongo from './utils/dbMongo';
import dbRedis from './utils/dbRedis';
import { removeTmpFiles } from './utils/scheduledJobs';
import swaggerDocsUi from './utils/swaggerDocsUi';

class App {
  public app: Application;

  constructor() {
    this.app = express();

    this.connectDatabases();
    this.initApp();
    this.startScheduledJobs();
    this.apiDocumentationUi();
  }

  public listen(): void {
    this.app.listen(port, () => console.log('ready - started server on %s', baseUrl));
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

  private apiDocumentationUi(): void {
    this.app.use('/api-docs', ...swaggerDocsUi);
  }
}

new App().listen();
