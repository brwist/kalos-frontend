// This is for an image preview component which takes image data as an argument (as a string) and displays it in an image tag

import React, { FC } from 'react';
import { SectionBar } from '../SectionBar';

interface Props {
  fileData: string;
  imageSize?: { sizeX: number; sizeY: number };
  title?: string;
  onSubmit?: (submitted: string) => any;
  onClose?: () => any;
}

export const ImagePreview: FC<Props> = ({
  fileData,
  imageSize,
  title,
  onSubmit,
  onClose,
}) => {
  let propActions = [];
  if (onSubmit) {
    propActions.push({ label: 'Submit', onClick: () => onSubmit(fileData) });
  }
  if (onClose) {
    propActions.push({ label: 'Close', onClick: () => onClose() });
  }
  return (
    <>
      <SectionBar
        title={title ? title : 'Image Preview'}
        actions={propActions}
      />
      <img
        src={String(fileData)}
        className="FileGalleryImg"
        id="SingleUploadImgPreview"
        style={{
          width: imageSize?.sizeX ? imageSize.sizeX : 'auto',
          height: imageSize?.sizeY ? imageSize.sizeY : 'auto',
        }}
      />
    </>
  );
};
