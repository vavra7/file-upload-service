import { ChangeEvent, DragEvent, FC, useState } from 'react';
import scopedStyles from './DropZone.module.scss';

interface Props {
  onFileAdd: (file: File) => void;
  label?: string;
  accept?: string;
  multiple?: boolean;
}

const DropZone: FC<Props> = ({ onFileAdd, label, accept, multiple }) => {
  const mimeTypeRegEx = accept ? new RegExp(accept, 'i') : null;

  const [active, setActive] = useState<boolean>(false);

  const handleDrop = (e: DragEvent<HTMLLabelElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setActive(false);

    const fileList = e.dataTransfer.files;

    Array.prototype.forEach.call(fileList, (file: File) => {
      if (mimeTypeRegEx && file.type && !file.type.match(mimeTypeRegEx)) return;

      onFileAdd(file);
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const fileList = e.target.files;

    Array.prototype.forEach.call(fileList, (file: File) => {
      onFileAdd(file);
    });
  };

  return (
    <>
      <label
        className={`${scopedStyles['drop-zone']} ${active ? scopedStyles['active'] : ''}`}
        htmlFor="file-input"
        onDragEnter={() => setActive(true)}
        onDragLeave={() => setActive(false)}
        onDragOver={(e: DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={handleDrop}
      >
        {label}
      </label>

      <input
        accept={accept}
        className={scopedStyles['file-input']}
        id="file-input"
        multiple={multiple}
        onChange={handleChange}
        type="file"
      />
    </>
  );
};

export default DropZone;
