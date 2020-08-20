import { Document, model, Schema } from 'mongoose';

export interface IFile extends Document {
  _id: string;
  name: string;
  mimeType: string;
  originalName: string;
  size: number;
  path: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFileInput {
  _id: IFile['_id'];
  name: IFile['name'];
  mimeType: IFile['mimeType'];
  originalName: IFile['originalName'];
  size: IFile['size'];
  path: IFile['path'];
  url: IFile['url'];
}

const fileSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    mimeType: { type: String, required: true },
    originalName: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
    url: { type: String, required: true }
  },
  {
    collection: 'file',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
);

export default model<IFile>('File', fileSchema);
