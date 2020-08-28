import axios from 'axios';
import { NextPage } from 'next';
import { ChangeEvent, FormEvent, useState } from 'react';
import Layout1 from '../components/layouts/Layout1';

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
      url: 'http://localhost:4000/image',
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
    <Layout1>
      <form onSubmit={handleSubmit}>
        <h1>File Upload</h1>

        <label htmlFor="file">File: </label>
        <input id="file" onChange={onFileSelect} type="file" /* accept="image/*"  */ />

        <button type="submit">Submit</button>
      </form>
    </Layout1>
  );
};

export default index;
