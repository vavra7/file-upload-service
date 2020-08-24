import fs from 'fs';
import mkdirp from 'mkdirp';
import moment from 'moment';
import path from 'path';
import { BASE_URL } from '../config';
import { FileInput } from '../entities/File';
import { ImageInput, SourceInfo } from '../entities/Image';

export async function move(oldPath, newPath): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fs.rename(oldPath, newPath, err => {
      if (err) reject(err);
      else resolve();
    });
  });
}

class FileService {
  static tmpFolderPath = 'public/tmp';
  static imagesFolderPath = 'public/image';
  static fileFolderPath = 'public/file';

  static tmpUrlPath = 'tmp';
  static imagesUrlPath = 'image';
  static filesUrlPath = 'file';

  static ensureDestination(destination: string): void {
    if (!fs.existsSync(destination)) {
      mkdirp.sync(destination);
    }
  }

  static getDateSubfolder(): string {
    return moment().format('YY-MM');
  }

  static getTmpImagePath(imageFullName: string): string {
    return path.join(FileService.tmpFolderPath, imageFullName);
  }

  static getTmpImageUrl(imageFullName: string): string {
    return new URL(path.join(FileService.tmpUrlPath, imageFullName), BASE_URL).toString();
  }

  static getTmpFileUrl(fileFullName: string): string {
    return new URL(path.join(FileService.tmpUrlPath, fileFullName), BASE_URL).toString();
  }

  /**
   * Based on sources info moves images from tmp folder
   * in regular folder. Returns updated sources info.
   * @param sourcesInfo
   */
  static async moveTmpImage(
    sourcesInfo: ImageInput['sourcesInfo']
  ): Promise<ImageInput['sourcesInfo']> {
    const dateSubfolder = FileService.getDateSubfolder();
    const destination = path.join(FileService.imagesFolderPath, dateSubfolder);

    FileService.ensureDestination(destination);

    const updatedSourcesInfo = sourcesInfo;

    await Promise.all(
      (Object.values(sourcesInfo) as SourceInfo[]).map(sourceInfo => {
        const oldPath = sourceInfo.path;
        const newPath = path.join(destination, sourceInfo.fullName);
        const newUrl = new URL(
          path.join(FileService.imagesUrlPath, dateSubfolder, sourceInfo.fullName),
          BASE_URL
        ).toString();

        updatedSourcesInfo[sourceInfo.srcCode]!.path = newPath;
        updatedSourcesInfo[sourceInfo.srcCode]!.url = newUrl;

        return move(oldPath, newPath);
      })
    );

    return updatedSourcesInfo;
  }

  /**
   * Based on file data moves file from tmp folder
   * in regular folder. Returns updated file input.
   * @param fileInput
   */
  static async moveTmpFile(fileInput: FileInput): Promise<FileInput> {
    const dateSubfolder = FileService.getDateSubfolder();
    const destination = path.join(FileService.fileFolderPath, dateSubfolder);
    const oldPath = fileInput.path;
    const newPath = path.join(destination, fileInput.fullName);
    const newUrl = new URL(
      path.join(FileService.filesUrlPath, dateSubfolder, fileInput.fullName),
      BASE_URL
    ).toString();

    FileService.ensureDestination(destination);

    return move(oldPath, newPath).then(() => ({
      ...fileInput,
      path: newPath,
      url: newUrl
    }));
  }
}

export default FileService;
