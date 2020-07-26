import { NextPage } from 'next';
import axios from 'axios';
import { imageUploadRequest } from '../api';
import { useState, FormEvent, ChangeEvent } from 'react';

const index: NextPage = () => {
  const [file, setFile] = useState<File | undefined>();

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('file', file);

    const bodyFormData = new FormData();

    bodyFormData.append('file', file as any);

    const request = {
      ...imageUploadRequest,
      onUploadProgress: (progressEvent: any) => console.log(progressEvent.loaded),
      data: bodyFormData
    };

    axios(request)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>File Upload</h1>

        <label htmlFor="file">File: </label>
        <input id="file" type="file" onChange={onFileSelect} accept="image/*" />

        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default index;
