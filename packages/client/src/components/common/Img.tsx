import { ChangeEvent, FC } from 'react';

interface IImg {
  tracedSvg: string;
  srcsetType: string;
  srcset: string;
  src: string;
  originalName?: string;
  aspectRatio: number;
}

interface Props {
  imgSrc: IImg;
  cover?: boolean;
}

const Img: FC<Props> = ({ imgSrc, cover }) => {
  const { tracedSvg, srcsetType, srcset, src, originalName, aspectRatio } = imgSrc;
  const coverStyle = cover ? { width: '100%', height: '100%' } : {};

  return (
    <div style={{ position: 'relative', ...coverStyle }}>
      {!cover && (
        <div aria-hidden style={{ width: '100%', paddingBottom: `${100 / aspectRatio}%` }} />
      )}
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
        <source srcSet={srcset} type={srcsetType} />
        <img
          alt={originalName}
          loading="lazy"
          onLoad={(e: ChangeEvent<HTMLImageElement>): void => {
            e.target.style.opacity = '1';
          }}
          src={src}
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            opacity: '0',
            transition: 'opacity 300ms ease 0s'
          }}
        />
      </picture>
    </div>
  );
};

Img.defaultProps = {
  cover: false
};

export default Img;
