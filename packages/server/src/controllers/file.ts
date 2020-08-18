import { Express } from 'express';
import path from 'path';
import { Bucket, EXPIRE_REDIS_TMP, URL } from '../config';
import { IFileInput } from '../model/File';
import dbRedis, { RedisPrefix } from '../utils/dbRedis';

export default {
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
