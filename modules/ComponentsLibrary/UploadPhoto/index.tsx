import React, { FC, useState, useCallback } from 'react';
import Alert from '@material-ui/lab/Alert';
import { Form, Schema } from '../Form';
import { uploadFileToS3Bucket, getFileExt } from '../../../helpers';
import './styles.less';

interface Props {
  title?: string;
  bucket: string;
  onClose: (() => void) | null;
}

type Entry = {
  file: string;
  name: string;
};

export const UploadPhoto: FC<Props> = ({
  onClose,
  bucket,
  title = 'Upload Photo',
}) => {
  const [fileData, setFileData] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [formKey, setFormKey] = useState<number>(0);
  const handleFileLoad = useCallback(
    (fileData: string) => setFileData(fileData),
    [setFileData],
  );
  const handleSubmit = useCallback(
    async (data: Entry) => {
      setSaved(false);
      setError(false);
      setSaving(true);
      const ext = getFileExt(data.file);
      const filename = `${data.name}-${Date.now()}.${ext}`;
      const status = await uploadFileToS3Bucket(filename, fileData, bucket);
      setSaving(false);
      if (status === 'ok') {
        setSaved(true);
        setFormKey(formKey + 1);
      } else {
        setError(true);
      }
    },
    [fileData, setSaving, setFormKey, formKey, bucket],
  );
  const SCHEMA: Schema<Entry> = [
    [
      {
        name: 'file',
        label: 'Receipt Photo',
        type: 'file',
        required: true,
        onFileLoad: handleFileLoad,
      },
    ],
    [
      {
        name: 'name',
        label: 'Receipt Name',
        required: true,
      },
    ],
  ] as Schema<Entry>;
  return (
    <Form<Entry>
      key={formKey}
      title={title}
      schema={SCHEMA}
      data={{
        file: '',
        name: '',
      }}
      onClose={onClose}
      onSave={handleSubmit}
      submitLabel="Upload"
      disabled={saving}
      intro={
        saved && (
          <Alert severity="success" className="UploadPhotoSuccess">
            <big>File uploaded successfully!</big>
            <br />
            You can upload another file.
          </Alert>
        )
      }
      error={error && <>Error while uploading file. Please try again.</>}
    />
  );
};
