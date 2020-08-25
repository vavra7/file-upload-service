import { CronJob } from 'cron';
import fs from 'fs';
import moment from 'moment';
import path from 'path';
import { tmpMaxAge } from '../config';
import FileService from './FileService';

const TIMEZONE = 'Europe/Prague';

export const removeTmpFiles = new CronJob(
  '*/2 * * * *',
  () => {
    const destination = FileService.tmpFolderPath;

    if (!fs.existsSync(destination)) return;

    fs.readdirSync(destination).forEach(fileName => {
      const filePath = path.join(destination, fileName);

      fs.stat(filePath, (err, stats) => {
        const age = moment().diff(moment(stats.birthtime), 'seconds');

        if (age >= tmpMaxAge) {
          fs.unlink(filePath, err => err && console.error(err));
        }
      });
    });
  },
  null,
  false,
  TIMEZONE
);
