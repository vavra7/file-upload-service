import potrace from 'potrace';
import sharp from 'sharp';
import Svgo from 'svgo';

class ImageTracer {
  private buffer: Buffer;

  constructor(buffer: Buffer) {
    this.buffer = buffer;
  }

  /**
   * Generate traces SVG from image
   */
  public async generate(): Promise<string> {
    let buffer = this.buffer;
    let svg: string;

    buffer = await this.convert(this.buffer);
    svg = await this.trace(buffer);
    svg = await this.optimize(svg);
    svg = this.encodeUri(svg);

    return svg;
  }

  /**
   * Converts to jpeg and resizes image
   * @param buffer
   */
  private async convert(buffer: Buffer): Promise<Buffer> {
    return await sharp(buffer).toFormat('jpeg').resize(400).toBuffer();
  }

  private async trace(buffer: Buffer): Promise<string> {
    return await new Promise<string>((resolve, reject) => {
      potrace.trace(
        buffer,
        {
          color: 'lightgray',
          optTolerance: 0.4,
          turdSize: 100,
          turnPolicy: potrace.Potrace.TURNPOLICY_MAJORITY
        },
        (err, svg) => {
          if (!err) resolve(svg);
          else reject(err);
        }
      );
    });
  }

  /**
   * Reduces size of SVG
   * @param svg
   */
  private optimize(svg: string): Promise<string> {
    const svgo = new Svgo({
      floatPrecision: 0,
      plugins: [
        {
          removeViewBox: false
        },
        {
          addAttributesToSVGElement: {
            attributes: [
              {
                preserveAspectRatio: 'none'
              }
            ]
          }
        }
      ]
    });

    return svgo.optimize(svg).then(({ data }) => data);
  }

  /**
   * Encoding
   * @param str
   */
  private encodeUri(str: string): string {
    return `data:image/svg+xml,${encodeURIComponent(str)}`;
  }
}

export default ImageTracer;
