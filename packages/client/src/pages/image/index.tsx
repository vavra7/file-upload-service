import axios from 'axios';
import { NextPage } from 'next';
import Link from 'next/link';
import Img from '../../components/common/Img';

const ImageList: NextPage = props => {
  const { images } = props as any;

  return (
    <>
      <h1>Image List</h1>

      {images.map(image => (
        <div key={image._id} style={{ marginBottom: '20px' }}>
          <Link as={'/image/' + image._id} href={'/image/[id]'}>
            <div style={{ width: '300px', height: '300px' }}>
              <Img
                cover
                imgSrc={{
                  tracedSvg: image.tracedSvg,
                  srcsetType: image.srcsetType,
                  srcset: image.srcset,
                  src: image.src,
                  originalName: image.originalName,
                  aspectRatio: image.aspectRatio
                }}
              />
            </div>
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
