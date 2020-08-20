export enum Bucket {
  Temporary = 'tmp',
  Image = 'image',
  File = 'file'
}

// TODO: constants should be constants
export const PORT = 4000;
export const URL = `http://localhost:${PORT}`;
export const EMPTY_TMP_AGE = 60 * 60 * 24 * 3;
// TODO: deal with better
export const EXPIRE_REDIS_TMP = EMPTY_TMP_AGE - 60 * 60 * 24;
