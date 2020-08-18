import { Document, model, Schema } from 'mongoose';

export enum SizeCode {
  Xs = 'xs',
  Sm = 'sm',
  Md = 'md',
  Lg = 'lg',
  Xl = 'xl',
  Full = 'full'
}

export interface SizeInfo {
  code: SizeCode;
  name: string;
  width: number;
  height: number;
  size: number;
  path: string;
  url: string;
}

export interface IImage extends Document {
  _id: string;
  mimeType: string;
  originalName: string;
  sizes: {
    [SizeCode.Xs]?: SizeInfo;
    [SizeCode.Sm]?: SizeInfo;
    [SizeCode.Md]?: SizeInfo;
    [SizeCode.Lg]?: SizeInfo;
    [SizeCode.Xl]?: SizeInfo;
    [SizeCode.Full]: SizeInfo;
  };
}

export interface IImageInput {
  _id: IImage['_id'];
  mimeType: IImage['mimeType'];
  originalName: IImage['originalName'];
  sizes: {
    [SizeCode.Xs]?: SizeInfo;
    [SizeCode.Sm]?: SizeInfo;
    [SizeCode.Md]?: SizeInfo;
    [SizeCode.Lg]?: SizeInfo;
    [SizeCode.Xl]?: SizeInfo;
    [SizeCode.Full]: SizeInfo;
  };
}

const imageSchema = new Schema(
  {
    _id: { type: String },
    mimeType: { type: String },
    originalName: { type: String },
    sizes: {
      xs: {
        name: { type: String },
        code: { type: String },
        width: { type: Number },
        height: { type: Number },
        size: { type: Number },
        path: { type: String },
        url: { type: String }
      },
      sm: {
        name: { type: String },
        code: { type: String },
        width: { type: Number },
        height: { type: Number },
        size: { type: Number },
        path: { type: String },
        url: { type: String }
      },
      md: {
        name: { type: String },
        code: { type: String },
        width: { type: Number },
        height: { type: Number },
        size: { type: Number },
        path: { type: String },
        url: { type: String }
      },
      lg: {
        name: { type: String },
        code: { type: String },
        width: { type: Number },
        height: { type: Number },
        size: { type: Number },
        path: { type: String },
        url: { type: String }
      },
      xl: {
        name: { type: String },
        code: { type: String },
        width: { type: Number },
        height: { type: Number },
        size: { type: Number },
        path: { type: String },
        url: { type: String }
      },
      full: {
        name: { type: String, required: true },
        code: { type: String, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        size: { type: Number, required: true },
        path: { type: String, required: true },
        url: { type: String, required: true }
      }
    }
  },
  { collection: 'image' }
);

export default model<IImage>('Image', imageSchema);
