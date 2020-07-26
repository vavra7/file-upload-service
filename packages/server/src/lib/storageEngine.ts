import fs from 'fs';
import mkdirp from 'mkdirp';
import { StorageEngine } from 'multer';
import path from 'path';
import { v4 } from 'uuid';
import concat from 'concat-stream';
import sharp, { Sharp, Metadata } from 'sharp';

export interface Breakpoint {
  code: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  resizeArgs: number[];
}

export interface BreakpointOutputInfo {
  code: Breakpoint['code'];
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
  breakpoints: {
    xs?: BreakpointOutputInfo;
    sm?: BreakpointOutputInfo;
    md?: BreakpointOutputInfo;
    lg?: BreakpointOutputInfo;
    xl?: BreakpointOutputInfo;
    full: BreakpointOutputInfo;
  };
}

const BREAKPOINTS: Breakpoint[] = [
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
  private destination = 'public/tmp';
  private breakpoints: Breakpoint[] = [];
  private outputFormat = 'png';
  private convertToPng = false;
  private imageId;

  constructor() {
    if (!fs.existsSync(this.destination)) {
      mkdirp.sync(this.destination);
    }
  }

  private getImagePath(code: Breakpoint['code']) {
    return `${path.join(this.destination, this.imageId)}-${code}.${this.outputFormat}`;
  }

  private getImageName(code: Breakpoint['code']) {
    return `${this.imageId}-${code}.${this.outputFormat}`;
  }

  private setBreakpoints(imageMeta: Metadata) {
    this.breakpoints = BREAKPOINTS.filter(breakpoint => {
      const originalWidth = imageMeta.width!;

      if (breakpoint.code !== 'full' && originalWidth <= breakpoint.resizeArgs[0]) {
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

  private async convertImage(image: Sharp, breakpoint: Breakpoint) {
    const code = breakpoint.code;
    const imagePath = this.getImagePath(code);

    let converted = image.resize(...breakpoint.resizeArgs);

    if (this.convertToPng) {
      converted = converted.png();
    }

    return converted.toFile(imagePath).then(outputInfo => {
      const breakpointOutputInfo: BreakpointOutputInfo = {
        name: this.getImageName(code),
        code: code,
        width: outputInfo.width,
        height: outputInfo.height,
        size: outputInfo.size,
        url: 'TODO some url'
      };

      return breakpointOutputInfo;
    });
  }

  /**
   * Method required and called by Multer package
   */
  public _handleFile: StorageEngine['_handleFile'] = (req, file, cb) => {
    const write = concat(async buffer => {
      const promises: Promise<BreakpointOutputInfo>[] = [];
      const image = sharp(buffer);
      const imageMeta = await image.metadata();

      this.setBreakpoints(imageMeta);
      this.setOutputFormat(imageMeta);
      this.generateImageId();

      this.breakpoints.forEach(breakpoint => promises.push(this.convertImage(image, breakpoint)));

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
            breakpoints: breakpoints as ConvertOutputInfo['breakpoints']
          };

          console.log(convertOutputInfo);
        })
        .catch(err => {
          cb(err);
        });
    });

    file.stream.pipe(write);

    // const writeStream = fs.createWriteStream(finalPath);
    // file.stream.pipe(writeStream);
    // writeStream.on('error', cb);
    // writeStream.on('finish', () => {
    //   cb(null, {
    //     destination: this.destination,
    //     filename: filename,
    //     path: finalPath,
    //     size: writeStream.bytesWritten
    //   });
    // });
  };

  public _removeFile: StorageEngine['_removeFile'] = (req, file, callback) => {
    console.log('_removeFile');
  };
}

export default new DiskStorage();
