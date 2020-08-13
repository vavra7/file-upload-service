import { AxiosRequestConfig } from 'axios';

export const imageUploadRequest: AxiosRequestConfig = {
  url: 'http://localhost:4000/image',
  method: 'POST',
  headers: { 'Content-Type': 'multipart/form-data' }
};
