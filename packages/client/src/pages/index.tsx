import axios from 'axios';
import { NextPage } from 'next';
import { ChangeEvent, FormEvent, useState } from 'react';
import { imageUploadRequest } from '../api';

const index: NextPage = () => {
  const [file, setFile] = useState<File | undefined>();

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

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
        <input id="file" type="file" onChange={onFileSelect} /* accept="image/*"  */ />

        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default index;
