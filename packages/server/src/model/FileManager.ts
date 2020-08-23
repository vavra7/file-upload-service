import { v4 } from 'uuid';
import File, { FileInput, IFile } from '../entities/File';

export interface FileCreate extends Omit<FileInput, '_id'> {
  _id?: FileInput['_id'];
}

class FileManager {
  static generateId(): FileInput['_id'] {
    return v4();
  }

  static createMany(fileInputs: FileCreate[]): Promise<IFile[]> {
    return File.insertMany(
      fileInputs.map(({ _id, ...rest }) => ({
        _id: _id || this.generateId(),
        ...rest
      }))
    );
  }

  static get(id: IFile['_id']): Promise<IFile | null> {
    return new Promise<IFile | null>((resolve, rejects) => {
      File.findById(id, (err, res) => {
        if (err) rejects(err);
        else resolve(res);
      });
    });
  }
}

export default FileManager;
