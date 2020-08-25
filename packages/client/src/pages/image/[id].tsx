import axios from 'axios';
import { NextPage } from 'next';
import Img from '../../components/common/Img';

const Image: NextPage = props => {
  const {
    image: { tracedSvg, srcsetType, srcset, src, originalName, aspectRatio }
  } = props as any;

  return (
    <>
      <Img imgSrc={{ tracedSvg, srcsetType, srcset, src, originalName, aspectRatio }} />
    </>
  );
};

Image.getInitialProps = async (context): Promise<any> => {
  const { data } = await axios({
    url: `http://localhost:4000/image/${context.query.id}`
  });

  return {
    image: data
  };
};

export default Image;
