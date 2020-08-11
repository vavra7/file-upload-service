import fs from 'fs';
import mkdirp from 'mkdirp';
import { StorageEngine } from 'multer';
import path from 'path';
import { v4 } from 'uuid';
import concat from 'concat-stream';
import sharp, { Sharp, Metadata } from 'sharp';
import { Buckets, URL } from '../config';

export interface SizeInput {
  code: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  resizeArgs: number[];
}

export interface SizeOutputInfo {
  code: SizeInput['code'];
  width: number;
  height: number;
  size: number;
  url: string;
  name: string;
}

export interface ConvertOutputInfo {
  id: string;
  originalName: string;
  mimeType: string;
  sizes: {
    xs?: SizeOutputInfo;
    sm?: SizeOutputInfo;
    md?: SizeOutputInfo;
    lg?: SizeOutputInfo;
    xl?: SizeOutputInfo;
    full: SizeOutputInfo;
  };
}

const SIZES: SizeInput[] = [
  {
    code: 'xs',
    resizeArgs: [150, 150]
  },
  {
    code: 'sm',
    resizeArgs: [300]
  },
  {
    code: 'md',
    resizeArgs: [640]
  },
  {
    code: 'lg',
    resizeArgs: [1024]
  },
  {
    code: 'xl',
    resizeArgs: [1632]
  },
  {
    code: 'full',
    resizeArgs: []
  }
];

const OUTPUT_FORMATS = ['jpeg', 'png'];

class DiskStorage implements StorageEngine {
  private destination = `public/${Buckets.Temporary}`;
  private sizes: SizeInput[] = [];
  private outputFormat = 'png';
  private convertToPng = false;
  private imageId;

  constructor() {
    if (!fs.existsSync(this.destination)) {
      mkdirp.sync(this.destination);
    }
  }

  private getImageDiskPath(code: SizeInput['code']) {
    return `${path.join(this.destination, this.imageId)}-${code}.${this.outputFormat}`;
  }

  private getImageName(code: SizeInput['code']) {
    return `${this.imageId}-${code}.${this.outputFormat}`;
  }

  private getImageUrl(name: string) {
    return `${URL}/${Buckets.Temporary}/${name}`;
  }

  private setBreakpoints(imageMeta: Metadata) {
    this.sizes = SIZES.filter(size => {
      const originalWidth = imageMeta.width!;

      if (size.code !== 'full' && originalWidth <= size.resizeArgs[0]) {
        return false;
      } else {
        return true;
      }
    });
  }

  private generateImageId() {
    this.imageId = v4();
  }

  private setOutputFormat(imageMeta: Metadata) {
    const originalFormat = imageMeta.format!;

    if (OUTPUT_FORMATS.includes(originalFormat)) {
      this.outputFormat = originalFormat;
      this.convertToPng = false;
    } else {
      this.outputFormat = 'png';
      this.convertToPng = true;
    }
  }

  private async convertImage(image: Sharp, breakpoint: SizeInput) {
    const code = breakpoint.code;
    const name = this.getImageName(code);
    const imageDiskPath = this.getImageDiskPath(code);
    const url = this.getImageUrl(name);

    let converted = image.resize(...breakpoint.resizeArgs);

    if (this.convertToPng) {
      converted = converted.png();
    }

    return converted.toFile(imageDiskPath).then(outputInfo => {
      const sizeOutputInfo: SizeOutputInfo = {
        name,
        code: code,
        width: outputInfo.width,
        height: outputInfo.height,
        size: outputInfo.size,
        url
      };

      return sizeOutputInfo;
    });
  }

  /**
   * Method required and called by Multer package
   */
  public _handleFile: StorageEngine['_handleFile'] = (req, file, cb) => {
    const write = concat(async buffer => {
      const promises: Promise<SizeOutputInfo>[] = [];
      const image = sharp(buffer);
      const imageMeta = await image.metadata();

      this.setBreakpoints(imageMeta);
      this.setOutputFormat(imageMeta);
      this.generateImageId();

      this.sizes.forEach(breakpoint => promises.push(this.convertImage(image, breakpoint)));

      Promise.all(promises)
        .then(res => {
          const breakpoints = {};

          res.forEach(breakpointOutputInfo => {
            breakpoints[breakpointOutputInfo.code] = breakpointOutputInfo;
          });

          const convertOutputInfo: ConvertOutputInfo = {
            id: this.imageId,
            mimeType: `image/${this.outputFormat}`,
            originalName: file.originalname,
            sizes: breakpoints as ConvertOutputInfo['sizes']
          };

          cb(null, { convertOutputInfo } as any);
        })
        .catch(err => {
          cb(err);
        });
    });

    file.stream.pipe(write);
  };

  /**
   * Method required and called by Multer package
   */
  public _removeFile: StorageEngine['_removeFile'] = (req, file) => {
    delete file.destination;
    delete file.filename;
    delete file.path;

    if (!this.imageId) return;

    SIZES.forEach(size => {
      const code = size.code;
      const imageDiskPath = this.getImageDiskPath(code);

      if (fs.existsSync(imageDiskPath)) {
        fs.unlinkSync(imageDiskPath);
      }
    });
  };
}

export default new DiskStorage();
