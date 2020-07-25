import { NextPage } from 'next';
import axios from 'axios';
import { uploadRequest } from '../api';
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

    axios(uploadRequest)
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

        <input type="file" onChange={onFileSelect} />

        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default index;
