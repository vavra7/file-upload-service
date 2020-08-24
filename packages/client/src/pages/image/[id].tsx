import axios from 'axios';
import { NextPage } from 'next';
import { ChangeEvent } from 'react';

const Image: NextPage = props => {
  const {
    image: { tracedSvg, srcsetType, srcset, src, originalName, aspectRatio }
  } = props as any;

  return (
    <>
      <div style={{ position: 'relative' }}>
        <div aria-hidden style={{ width: '100%', paddingBottom: `${100 / aspectRatio}%` }}></div>
        <img
          src={tracedSvg}
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center'
          }}
        />
        <picture>
          <source type={srcsetType} srcSet={srcset} />
          <img
            src={src}
            loading="lazy"
            alt={originalName}
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              opacity: '0',
              transitionDelay: '500ms',
              transition: 'opacity 500ms ease 0s'
            }}
            onLoad={(e: ChangeEvent<HTMLImageElement>) => (e.target.style.opacity = '1')}
          />
        </picture>
      </div>

      <pre style={{ maxWidth: '100%', overflow: 'auto' }}>{JSON.stringify(props, null, 4)}</pre>
    </>
  );
};

Image.getInitialProps = async context => {
  const { data } = await axios({
    url: `http://localhost:4000/image/${context.query.id}`
  });

  return {
    image: data
  };
};

export default Image;