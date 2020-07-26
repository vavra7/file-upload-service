import { AxiosRequestConfig } from 'axios';

export const imageUploadRequest: AxiosRequestConfig = {
  url: 'http://localhost:4000/image-upload',
  method: 'POST',
  headers: { 'Content-Type': 'multipart/form-data' }
};
