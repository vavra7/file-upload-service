import path from 'path';
import { FileInput, IFile } from '../entities/File';
import FileManager, { FileCreate } from '../model/FileManager';
import ApiError, { ErrorCode } from '../utils/ApiError';
import dbRedis, { expiryTime, RedisPrefix } from '../utils/dbRedis';
import FileService from '../utils/FileService';

class FileHandler {
  /**
   * Get file data
   * @param id
   */
  static async get(id: string): Promise<IFile | null> {
    return FileManager.get(id);
  }

  /**
   * Processing files after upload
   * @param file
   */
  static process(file: Express.Multer.File): FileInput {
    const fileData: FileInput = {
      _id: path.parse(file.filename).name,
      name: path.parse(file.filename).name,
      fullName: file.filename,
      originalName: path.parse(file.originalname).name,
      originalFullName: file.originalname,
      mimeType: file.mimetype,
      path: file.path,
      size: file.size,
      url: FileService.getTmpFileUrl(file.filename)
    };

    dbRedis.client.set(
      RedisPrefix.TmpFile + fileData._id,
      JSON.stringify(fileData),
      'EX',
      expiryTime.tmp
    );

    return fileData;
  }

  /**
   * Saves temporary files to database
   * @param ids
   */
  static async saveFiles(ids: string[]): Promise<IFile[]> {
    const redisNotFound: string[] = [];
    const uniqueIds = ids.filter((id, index) => ids.indexOf(id) === index);
    const promisesRedis = uniqueIds.map(id =>
      dbRedis.client.get(RedisPrefix.TmpFile + id).then((res): FileInput | null => {
        if (res) {
          return JSON.parse(res);
        } else {
          redisNotFound.push(id);

          return null;
        }
      })
    );

    const tmpFileInputs = await Promise.all(promisesRedis);

    if (redisNotFound.length) {
      throw new ApiError(
        ErrorCode.FileNotFound,
        `Some temporary files were not found. Incorrect id, file expired or file was already saved.`,
        {
          missingFiles: redisNotFound
        }
      );
    }

    const updatedFileInputs: FileCreate[] = await Promise.all(
      (tmpFileInputs as FileInput[]).map(fileInput => {
        dbRedis.client.del(RedisPrefix.TmpFile + fileInput._id);

        return FileService.moveTmpFile(fileInput);
      })
    );

    return await FileManager.createMany(updatedFileInputs);
  }
}

export default FileHandler;
