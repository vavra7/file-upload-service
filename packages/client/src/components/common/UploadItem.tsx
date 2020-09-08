import { FC } from 'react';
import scopedStyles from './UploadItem.module.scss';

interface Props {
  name: string;
  size: number;
  uploaded: number;
  onRemove: () => void;
}

const UploadItem: FC<Props> = ({ name, size, uploaded, onRemove, children }) => {
  const percent = `${Math.min(Math.round((uploaded / size) * 100), 100)}%`;

  return (
    <div className={scopedStyles['upload-item']}>
      <div className={scopedStyles['upload-item__preview']}>{children}</div>
      <div className={scopedStyles['upload-item__body']}>
        <div className={scopedStyles['name']}>{name}</div>
        <small>{`${Math.round(size / 1000)} kb`}</small>
        <div className={scopedStyles['percentage']}>{percent}</div>

        <div className={scopedStyles['progress-wrapper']}>
          <div className={scopedStyles['progress']} style={{ width: percent }}></div>
        </div>

        <div className={scopedStyles['actions']} onClick={onRemove}>
          X
        </div>
      </div>
    </div>
  );
};

export default UploadItem;
