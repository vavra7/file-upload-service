import { Express } from 'express';
import fs from 'fs';
import mkdirp from 'mkdirp';
import moment from 'moment';
import path from 'path';
import { Bucket, EXPIRE_REDIS_TMP, URL } from '../config';
import File, { IFile, IFileInput } from '../model/File';
import ApiError, { ErrorCode } from '../utils/ApiError';
import dbRedis, { RedisPrefix } from '../utils/dbRedis';

export default {
  getFile: async function (id: IFile['_id']): Promise<IFile | null> {
    return File.findById(id);
  },
  saveFiles: async function (ids: Array<IFile['_id']>): Promise<IFile[]> {
    const redisNotFound: string[] = [];
    const uniqueIds = ids.filter((id, index) => ids.indexOf(id) === index);
    const promisesRedis = uniqueIds.map(id =>
      dbRedis.client.get(RedisPrefix.TmpFile + id).then(res => {
        if (res) {
          return JSON.parse(res);
        } else {
          redisNotFound.push(id);

          return null;
        }
      })
    );

    const filesData: IFileInput[] = await Promise.all(promisesRedis);

    if (redisNotFound.length) {
      throw new ApiError(
        ErrorCode.FileNotFound,
        `Some temporary files were not found. Incorrect id, file expired or file was already saved.`,
        {
          missingFiles: redisNotFound
        }
      );
    }

    const moveErrors: Error[] = [];
    const promisesMove: Promise<boolean>[] = [];
    const bucket = Bucket.File;
    const dateFolder = moment().format('YY-MM');

    if (!fs.existsSync(`public/${bucket}/${dateFolder}`)) {
      mkdirp.sync(`public/${bucket}/${dateFolder}`);
    }

    filesData.forEach(fileInput => {
      const oldPath = fileInput.path;
      const newPath = `public/${bucket}/${dateFolder}/${fileInput.name}`;
      const newUrl = `${URL}/${bucket}/${dateFolder}/${fileInput.name}`;
      const promise: Promise<boolean> = new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, err => {
          if (err) {
            reject(err);
          } else {
            fileInput.path = newPath;
            fileInput.url = newUrl;

            resolve(true);
          }
        });
      });

      promisesMove.push(promise);
      dbRedis.client.del(RedisPrefix.TmpFile + fileInput._id);
    });

    await Promise.all(promisesMove).catch(err => moveErrors.push(err));

    if (moveErrors.length) {
      throw moveErrors[0];
    }

    return await File.insertMany(filesData);
  },
  processFile: function (file: Express.Multer.File) {
    const fileData: IFileInput = {
      _id: path.parse(file.filename).name,
      name: file.filename,
      mimeType: file.mimetype,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      url: `${URL}/${Bucket.Temporary}/${file.filename}`
    };

    dbRedis.client.set(
      RedisPrefix.TmpFile + fileData._id,
      JSON.stringify(fileData),
      'EX',
      EXPIRE_REDIS_TMP
    );

    return fileData;
  }
};
