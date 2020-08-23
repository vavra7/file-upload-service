import { Document, model, Schema } from 'mongoose';

export interface IFile extends Document {
  _id: string;
  name: string;
  fullName: string;
  originalName: string;
  originalFullName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FileInput = Pick<
  IFile,
  | '_id'
  | 'name'
  | 'fullName'
  | 'originalName'
  | 'originalFullName'
  | 'mimeType'
  | 'size'
  | 'path'
  | 'url'
>;

const fileSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    fullName: { type: String, required: true },
    originalName: { type: String, required: true },
    originalFullName: { type: String, required: true },
    mimeType: { type: String, required: true },
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
