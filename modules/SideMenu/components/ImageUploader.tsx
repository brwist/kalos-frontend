// this files ts-ignore lines have been checked
import React, { useRef, FC } from 'react';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import { Button } from '../../ComponentsLibrary/Button';
import { BugReportImage } from '../../../helpers';
import './ImageUploader.module.less';

type Props = {
  images: BugReportImage[];
  attachImage: (img: BugReportImage) => void;
  detachImage: (label: string) => void;
  ignoreImages: boolean;
  setIgnoreImages: (ignore: boolean) => void;
  loading: boolean;
};

const acceptedFileTypes = [
  'image/x-png',
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
];

const ImageUploader: FC<Props> = ({
  images,
  attachImage,
  detachImage,
  ignoreImages,
  setIgnoreImages,
  loading,
}: Props): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    const file = e.target.files[0],
      reader = new FileReader();
    if (!acceptedFileTypes.includes(file.type)) {
      return;
    }
    reader.onloadend = async function () {
      // @ts-ignore
      const imgBase64 = reader.result.replace(/^data:.+;base64,/, '');
      attachImage({
        label: file.name,
        data: imgBase64,
      });
    };

    reader.readAsDataURL(file);
  };
  return (
    <>
      <Box className="ImageUploaderControls">
        <Button
          className="ImageUploaderButton"
          label="Upload Image"
          startIcon={<InsertPhotoIcon />}
          onClick={() => inputRef?.current?.click()}
          disabled={ignoreImages || loading}
        />
        <input
          ref={inputRef}
          type="file"
          id="upload-image"
          hidden
          onChange={handleUploadImage}
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={ignoreImages}
              onChange={() => setIgnoreImages(!ignoreImages)}
              disabled={loading}
            />
          }
          label="There's no need for a screenshot"
        />
      </Box>
      {!ignoreImages && (
        <Box className="ImageUploaderChips">
          {images.map(img => (
            <Chip
              key={img.label}
              className="ImageUploaderChip"
              label={img.label}
              onDelete={() => detachImage(img.label)}
            />
          ))}
        </Box>
      )}
    </>
  );
};

export default ImageUploader;
