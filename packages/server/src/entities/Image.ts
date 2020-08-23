import { Document, model, Schema } from 'mongoose';

export enum SrcCode {
  Xs = 'xs',
  Sm = 'sm',
  Md = 'md',
  Lg = 'lg',
  Xl = 'xl',
  Fallback = 'fallback'
}

export interface SourceInfo {
  srcCode: SrcCode;
  format: string;
  fullName: string;
  width: number;
  height: number;
  srcset: boolean;
  size: number;
  path: string;
  url: string;
}

export interface IImage extends Document {
  _id: string;
  originalName: string;
  originalFullName: string;
  width: number;
  height: number;
  aspectRatio: number;
  tracedSvg: string;
  srcsetType: string;
  srcset: string;
  src: string;
  sourcesInfo: {
    [SrcCode.Xs]: SourceInfo;
    [SrcCode.Sm]?: SourceInfo;
    [SrcCode.Md]?: SourceInfo;
    [SrcCode.Lg]?: SourceInfo;
    [SrcCode.Xl]?: SourceInfo;
    [SrcCode.Fallback]: SourceInfo;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type ImageInput = Pick<
  IImage,
  | '_id'
  | 'originalName'
  | 'originalFullName'
  | 'width'
  | 'height'
  | 'aspectRatio'
  | 'tracedSvg'
  | 'srcsetType'
  | 'srcset'
  | 'src'
  | 'sourcesInfo'
>;

const imageSchema = new Schema(
  {
    _id: { type: String, required: true },
    originalName: { type: String, required: true },
    fullOriginalName: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    aspectRatio: { type: Number, required: true },
    tracedSvg: { type: String, required: true },
    srcsetType: { type: String, required: true },
    srcset: { type: String, required: true },
    src: { type: String, required: true },
    sourcesInfo: {
      xs: {
        srcCode: { type: String, required: true },
        format: { type: String, required: true },
        fullName: { type: String, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        srcset: { type: Boolean, required: true },
        size: { type: Number, required: true },
        path: { type: String, required: true },
        url: { type: String, required: true }
      },
      sm: {
        srcCode: { type: String },
        format: { type: String },
        fullName: { type: String },
        width: { type: Number },
        height: { type: Number },
        srcset: { type: Boolean },
        size: { type: Number },
        path: { type: String },
        url: { type: String }
      },
      md: {
        srcCode: { type: String },
        format: { type: String },
        fullName: { type: String },
        width: { type: Number },
        height: { type: Number },
        srcset: { type: Boolean },
        size: { type: Number },
        path: { type: String },
        url: { type: String }
      },
      lg: {
        srcCode: { type: String },
        format: { type: String },
        fullName: { type: String },
        width: { type: Number },
        height: { type: Number },
        srcset: { type: Boolean },
        size: { type: Number },
        path: { type: String },
        url: { type: String }
      },
      xl: {
        srcCode: { type: String },
        format: { type: String },
        fullName: { type: String },
        width: { type: Number },
        height: { type: Number },
        srcset: { type: Boolean },
        size: { type: Number },
        path: { type: String },
        url: { type: String }
      },
      fallback: {
        srcCode: { type: String, required: true },
        format: { type: String, required: true },
        fullName: { type: String, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        srcset: { type: Boolean, required: true },
        size: { type: Number, required: true },
        path: { type: String, required: true },
        url: { type: String, required: true }
      }
    }
  },
  {
    collection: 'image',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
);

export default model<IImage>('Image', imageSchema);
