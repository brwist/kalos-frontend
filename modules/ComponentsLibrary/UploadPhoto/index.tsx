import React, { FC, useState, useCallback } from 'react';
import Alert from '@material-ui/lab/Alert';
import { Form, Schema } from '../Form';
import {
  uploadFileToS3Bucket,
  getFileExt,
  getMimeType,
  SUBJECT_TAGS,
  DocumentClientService,
  FileClientService,
} from '../../../helpers';
import './styles.less';
import { File } from '@kalos-core/kalos-rpc/File';

interface Props {
  loggedUserId: number;
  title?: string;
  bucket: string;
  onClose: (() => void) | null;
  defaultTag?: string;
}

type Entry = {
  file: string;
  name: string;
  eventId: number;
  geolocationLat: number;
  geolocationLng: number;
  tag: string;
};

// TODO: Refactor tags to allow multiple tag selection, separated by &
// e.g.: Subject=Refrigeration&Classification=Service
export const UploadPhoto: FC<Props> = ({
  onClose,
  bucket,
  loggedUserId,
  title = 'Upload Photo',
  defaultTag = 'Receipt',
}) => {
  const [fileData, setFileData] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [geolocating, setGeolocating] = useState<boolean>(false);
  const [formData, setFormData] = useState<Entry>({
    file: '',
    name: '',
    eventId: 0,
    geolocationLat: 0,
    geolocationLng: 0,
    tag: (
      SUBJECT_TAGS.find(({ label }) => label === defaultTag) || {
        value: '',
      }
    ).value,
  });
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
      const name = `${data.name}-${Math.floor(Date.now() / 1000)}.${ext}`;
      const status = await uploadFileToS3Bucket(
        name,
        fileData,
        bucket,
        data.tag,
      );
      setSaving(false);
      if (status === 'ok') {
        const fReq = new File();
        fReq.setBucket(bucket);
        fReq.setName(name);
        fReq.setMimeType(data.file);
        fReq.setOwnerId(loggedUserId);
        await FileClientService.upsertFile(fReq);
        setSaved(true);
        setFormKey(formKey + 1);
      } else {
        setError(true);
      }
    },
    [fileData, setSaving, setFormKey, formKey, bucket, loggedUserId],
  );
  const onLocationSuccess = useCallback(
    ({
      coords: { latitude: geolocationLat, longitude: geolocationLng },
    }: {
      coords: { latitude: number; longitude: number };
    }) => {
      setFormData({ ...formData, geolocationLat, geolocationLng });
      setGeolocating(false);
      setFormKey(formKey + 1);
    },
    [setGeolocating, setFormData, formData, setFormKey, formKey],
  );
  const onLocationError = useCallback(
    ({ message }: any) => {
      setGeolocating(false);
      alert(message);
    },
    [setGeolocating],
  );
  const handleCheckLocation = useCallback(() => {
    setGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      onLocationSuccess,
      onLocationError,
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  }, [onLocationSuccess, onLocationError, setGeolocating]);
  const SCHEMA: Schema<Entry> = [
    [
      {
        name: 'tag',
        label: 'Tag',
        required: true,
        options: SUBJECT_TAGS,
      },
    ],
    [
      {
        name: 'file',
        label: 'Photo',
        type: 'file',
        required: true,
        onFileLoad: handleFileLoad,
      },
    ],
    [
      {
        name: 'name',
        label: 'Name',
        required: true,
      },
    ],
    [
      {
        name: 'eventId',
        label: 'Service Call Id',
        type: 'eventId',
      },
    ],
    [
      {
        headline: true,
        label: 'Location',
        actions: [
          {
            label: 'Check Location',
            compact: true,
            onClick: handleCheckLocation,
            disabled: saving || geolocating,
            loading: geolocating,
            variant: 'outlined',
            size: 'xsmall',
          },
        ],
      },
    ],
    [
      {
        name: 'geolocationLat',
        label: 'Latitude',
        type: 'number',
      },
      {
        name: 'geolocationLng',
        label: 'Longitude',
        type: 'number',
      },
    ],
  ] as Schema<Entry>;
  return (
    <Form<Entry>
      key={formKey}
      title={title}
      schema={SCHEMA}
      data={formData}
      onClose={onClose}
      onSave={handleSubmit}
      onChange={setFormData}
      submitLabel="Upload"
      cancelLabel="Close"
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
