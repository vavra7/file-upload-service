import axios from 'axios';
import { NextPage } from 'next';
import Link from 'next/link';

const ImageList: NextPage = props => {
  const { images } = props as any;

  return (
    <>
      <h1>Image List</h1>

      {images.map(image => (
        <div key={image._id}>
          <Link as={'/image/' + image._id} href={'/image/[id]'}>
            <a>{image._id}</a>
          </Link>
        </div>
      ))}
    </>
  );
};

ImageList.getInitialProps = async (): Promise<any> => {
  const { data } = await axios({
    url: `http://localhost:4000/image`
  });

  return {
    images: data
  };
};

export default ImageList;
