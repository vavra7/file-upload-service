import { CronJob } from 'cron';
import fs from 'fs';
import moment from 'moment';
import path from 'path';
import { Bucket } from '../config';

const TIMEZONE = 'Europe/Prague';

export const removeTmpFiles = new CronJob(
  '*/2 * * * *',
  () => {
    const destination = `public/${Bucket.Temporary}`;
    const hoursRemove = 0;

    if (!fs.existsSync(destination)) return;

    fs.readdirSync(destination).forEach(fileName => {
      const filePath = path.join(destination, fileName);

      fs.stat(filePath, (err, stats) => {
        const hoursAge = moment().diff(moment(stats.birthtime), 'hours');

        if (hoursAge >= hoursRemove) {
          fs.unlink(filePath, err => err && console.error(err));
        }
      });
    });
  },
  null,
  false,
  TIMEZONE
);
