// This is the module that allows for users to add logs with photos, etc uploaded with them
// this files ts-ignore lines have been checked
import { ActivityLog } from '@kalos-core/kalos-rpc/ActivityLog';
import { Typography } from '@material-ui/core';
import React, { FC, useCallback, useState } from 'react';
import { LOG_IMAGE_BUCKET } from '../../../constants';
import {
  ActivityLogClientService,
  getS3LogImageFileName,
  S3ClientService,
  keyToMethodName,
} from '../../../helpers';
import { Loader } from '../../Loader/main';
import { Alert } from '../Alert';
import { Form, Schema } from '../Form';
import { ImagePreview } from '../ImagePreview';
import { Modal } from '../Modal';

interface Props {
  onClose: () => any;
  onSave?: (savedLog: ActivityLog) => void;
  loggedUserId: number;
  eventId?: number; // Will pre-fill event id when adding log
}

interface FileLog extends ActivityLog.AsObject {
  fileData: string;
}

export const AddLog: FC<Props> = ({
  onClose,
  onSave,
  loggedUserId,
  eventId,
}) => {
  const [log] = useState<FileLog>({
    eventId: eventId,
  } as FileLog);
  const [error, setError] = useState<string>('');
  const [saving, setSaving] = useState<boolean>();
  const [confirmed, setConfirmed] = useState<boolean>(); // For if the image is confirmed to be uploaded as well
  const [fileData, setFileData] = useState<
    { fileData: string; fileName: string } | undefined
  >();

  const handleSetError = useCallback((err: string) => setError(err), [
    setError,
  ]);

  const handleSetFileData = useCallback(
    (fileData: string, fileName: string) => setFileData({ fileData, fileName }),
    [setFileData],
  );

  const handleSetConfirmed = useCallback(
    (confirmed: boolean) => setConfirmed(confirmed),
    [setConfirmed],
  );

  const handleSubmitFileToS3 = useCallback(
    async (fileData: string, fileName, logId: number) => {
      try {
        const result = await S3ClientService.uploadFileToS3Bucket(
          getS3LogImageFileName(fileName, eventId, logId),
          fileData,
          LOG_IMAGE_BUCKET,
          eventId ? `EventID-${eventId}` : undefined, // Images submitted to S3 are tracked by event ID this way
        );
        if (result === 'nok') {
          throw new Error(
            'An unknown error occurred while uploading the file.',
          );
        }
        handleSetFileData('', '');
        setConfirmed(false);
      } catch (err) {
        console.error(
          `An error occurred while uploading the file to S3: ${err}`,
        );
      }
    },
    [eventId, handleSetFileData],
  );

  const handleSaveLog = useCallback(
    async (logToSave: ActivityLog) => {
      logToSave.setUserId(loggedUserId);
      try {
        setSaving(true);
        const response = await ActivityLogClientService.Create(logToSave);
        if (onSave) onSave(logToSave);
        setSaving(false);
        if (!response) {
          throw new Error(
            `No response was given from the client service - an error occurred. `,
          );
        }

        if (!fileData) return; // no image along with the log

        handleSubmitFileToS3(
          fileData!.fileData,
          fileData!.fileName,
          response.getId(),
        );
      } catch (err) {
        console.error(
          `An error occurred while attempting to create a new log: ${err}`,
        );
        setError(
          `An error occurred while attempting to create a new log: ${err}. If this issue persists, please contact the webtech team.`,
        );
        setSaving(false);
      }
    },
    [fileData, handleSubmitFileToS3, loggedUserId, onSave],
  );

  // TODO This is set as an AsObject until the Form and Schema can handle non-AsObject forms
  const SCHEMA: Schema<FileLog> = [
    [
      {
        name: 'activityName',
        label: 'Description',
      },
      {
        name: 'activityDate',
        label: 'Date',
        type: 'mui-datetime',
      },
    ],
    [
      {
        name: 'propertyId',
        label: 'Property ID',
        type: 'number',
      },
      {
        name: 'contractId',
        label: 'Contract ID',
        type: 'number',
      },
      {
        name: 'customerId',
        label: 'Customer ID',
        type: 'number',
      },
      {
        name: 'taskId',
        label: 'Task ID',
        type: 'number',
      },
      {
        name: 'timesheetLineId',
        label: 'Timesheet ID',
        type: 'number',
      },
      {
        name: 'eventId',
        label: 'Event / Project ID',
        type: 'number',
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
    [
      {
        name: 'fileData',
        label: 'Upload Photo',
        type: 'file',
        onFileLoad: (data, fileName) => {
          if (data === null) {
            return;
          }
          if (typeof data === 'string') {
            handleSetFileData(String(data), fileName);
          } else {
            let decoder = new TextDecoder();
            let dataNew = decoder.decode(data); // Converting it to string
            handleSetFileData(dataNew, fileName);
          }
        },
      },
    ],
  ];
  return (
    <>
      {saving && <Loader />}
      {error && (
        <Alert open={true} onClose={() => handleSetError('')}>
          <Typography>{error}</Typography>{' '}
        </Alert>
      )}
      <Form
        title="Log Details"
        onSave={(savedLog: FileLog) => {
          let saved = new ActivityLog();
          for (const field in savedLog) {
            if (field == 'fileData') {
              continue;
            }
            // @ts-ignore
            saved[keyToMethodName(set, field)](savedLog[field]);
          }
          handleSaveLog(saved);
        }}
        onClose={() => onClose()}
        schema={SCHEMA}
        data={log}
        submitLabel="Save"
        cancelLabel="Close"
      />
      {fileData?.fileData && !confirmed && (
        <Modal
          open={true}
          onClose={() => {
            handleSetFileData('', '');
            handleSetConfirmed(false);
          }}
        >
          <ImagePreview
            fileData={fileData.fileData}
            onSubmit={() => handleSetConfirmed(true)}
            onClose={() => {
              handleSetFileData('', '');
              handleSetConfirmed(false);
            }}
          />
        </Modal>
      )}
    </>
  );
};
