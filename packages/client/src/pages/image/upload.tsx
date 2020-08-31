import { FC } from 'react';
import DropZone from '../../components/common/inputs/DropZone';
import Layout1 from '../../components/layouts/Layout1';

const ImageUpload: FC = () => {
  const addFile = (file: File): void => {
    console.log(file);
  };

  return (
    <Layout1>
      <h1>Image Upload</h1>

      <DropZone
        accept="image/*"
        label="Choose images or drag some here"
        multiple
        onFileAdd={addFile}
      />
    </Layout1>
  );
};

export default ImageUpload;
