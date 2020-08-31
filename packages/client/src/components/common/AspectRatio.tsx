import { FC } from 'react';
import scopedStyles from './AspectRatio.module.scss';

interface Props {
  aspectRatio: number;
}

const AspectRatio: FC<Props> = ({ children, aspectRatio }) => {
  return (
    <div
      className={scopedStyles['aspect-ratio-outer']}
      style={{ paddingBottom: 100 / aspectRatio + '%' }}
    >
      <div className={scopedStyles['aspect-ratio-inner']}>{children}</div>
    </div>
  );
};

export default AspectRatio;
