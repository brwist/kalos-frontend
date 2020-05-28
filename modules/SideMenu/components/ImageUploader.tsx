import React, { useRef, FC } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import { Button } from '../../ComponentsLibrary/Button';
import { BugReportImage } from '../../../helpers';

type Props = {
  images: BugReportImage[],
  attachImage: (img: BugReportImage) => void,
  detachImage: (label: string) => void,
};

const acceptedFileTypes = ["image/x-png", "image/png", "image/jpg", "image/jpeg", "image/gif"];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: 0,
    },
    chips: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    chip: {
      marginTop: theme.spacing(1),
    },
  }),
);

const ImageUploader: FC<Props> = ({ images, attachImage, detachImage }: Props): JSX.Element => {
  const classes = useStyles();
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
      })
    };

    reader.readAsDataURL(file);
  };
  return (
    <>
      <label htmlFor="upload-image">
        <Button
          className={classes.button}
          label="Upload Image"
          startIcon={<InsertPhotoIcon />}
          onClick={() => inputRef?.current?.click()}
        />
      </label>
      <input
        ref={inputRef}
        type="file"
        id="upload-image"
        hidden
        onChange={handleUploadImage}
      />
      <Box className={classes.chips}>
        {images.map(img => (
          <Chip
            key={img.label}
            className={classes.chip}
            label={img.label}
            onDelete={() => detachImage(img.label)}
          />
        ))}
      </Box>
    </>
  );
};

export default ImageUploader;
