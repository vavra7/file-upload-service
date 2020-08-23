import { v4 } from 'uuid';
import Image, { IImage, ImageInput } from '../entities/Image';

export interface ImageCreate extends Omit<ImageInput, '_id'> {
  _id?: ImageInput['_id'];
}

class ImageManager {
  static generateId(): ImageInput['_id'] {
    return v4();
  }

  static createMany(imageInputs: ImageCreate[]): Promise<IImage[]> {
    return Image.insertMany(
      imageInputs.map(({ _id, ...rest }) => ({
        _id: _id || this.generateId(),
        ...rest
      }))
    );
  }

  static get(id: IImage['_id']): Promise<IImage | null> {
    return new Promise<IImage | null>((resolve, rejects) => {
      Image.findById(id, (err, res) => {
        if (err) rejects(err);
        else resolve(res);
      });
    });
  }
}

export default ImageManager;
