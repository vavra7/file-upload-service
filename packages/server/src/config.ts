export enum Bucket {
  Temporary = 'tmp',
  Image = 'image',
  File = 'file'
}

export const PORT = 4000;
export const URL = `http://localhost:${PORT}`;
// export const EMPTY_TMP_AGE = 60 * 60 * 24 * 3;
export const EMPTY_TMP_AGE = 60 * 60;
