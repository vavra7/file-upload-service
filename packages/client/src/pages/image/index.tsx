import axios from 'axios';
import { NextPage } from 'next';
import Link from 'next/link';
import AspectRatio from '../../components/common/AspectRatio';
import Img from '../../components/common/Img';
import Layout1 from '../../components/layouts/Layout1';
import scopedStyles from './index.module.scss';

const ImageList: NextPage = props => {
  const { images } = props as any;

  return (
    <Layout1>
      <h1>Image List</h1>

      <div className={scopedStyles['gallery']}>
        {images.map(image => (
          <Link as={'/image/' + image._id} href={'/image/[id]'} key={image._id}>
            <a>
              <AspectRatio aspectRatio={1}>
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
                  sizes="400px"
                />
              </AspectRatio>
            </a>
          </Link>
        ))}
      </div>
    </Layout1>
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
