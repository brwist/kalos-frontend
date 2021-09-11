import React, { FC, useState, useCallback } from 'react';
import Alert from '@material-ui/lab/Alert';

import { Form, Schema } from '../Form';
import {
  Transaction,
} from '@kalos-core/kalos-rpc/Transaction';
import {
  uploadFileToS3Bucket,
  getFileExt,
  TransactionDocumentClientService,
  FileClientService,
  ActivityLogClientService,
} from '../../../helpers';
import './styles.less';
import { WaiverTypes } from '../../../constants';
import { RoleType } from '../Payroll';
import { File } from '@kalos-core/kalos-rpc/File';
import { TransactionDocument } from '@kalos-core/kalos-rpc/TransactionDocument';
import { ActivityLog } from '@kalos-core/kalos-rpc/ActivityLog';
import { format } from 'date-fns';

interface Props {
  loggedUserId: number;
  title?: string;
  onClose: (() => void) | null;
  onUpload?: (() => void) | null;
  fullWidth?: boolean;
  transactionPassed: Transaction;
  role?: RoleType;
}

type Entry = {
  file: string;
  description: string;
  invoiceWaiverType: number;
};

export const UploadPhotoToExistingTransaction: FC<Props> = ({
  onClose,
  loggedUserId,
  transactionPassed,
  onUpload,
  title = 'Add Photo To Transaction',
  fullWidth = true,
}) => {
  const [fileData, setFileData] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [formData, setFormData] = useState<Entry>({
    file: '',
    description: '',
    invoiceWaiverType: 1,
  });
  const [nameValidationError, setNameValidationError] = useState<
    string | undefined
  >(undefined);
  const [formKey, setFormKey] = useState<number>(0);
  const handleFileLoad = useCallback(
    (fileData: string) => setFileData(fileData),
    [setFileData],
  );
  // TODO reminding myself to fix this in a bit, we don't need to switch between Entry and Transaction, we can just use Transaction
  // ! Also no need to create a new Transaction client when we can reuse the one from Helpers
  const handleSubmit = useCallback(
    async (data: Entry) => {
      if (data.description.includes('/') || data.description.includes('\\')) {
        setNameValidationError(
          'The description field cannot contain the characters "/" or "\\".',
        );
        setError(true);
        return;
      }
      setSaved(false);
      setError(false);
      setSaving(true);
      if (data.file) {
        const ext = getFileExt(data.file);
        const name = `${transactionPassed.getId()}-${data.file}-${Math.floor(
          Date.now() / 1000,
        )}.${ext}`;
        const nameWithoutId = `${data.file}-${Math.floor(
          Date.now() / 1000,
        )}.${ext}`;
        console.log(name);

        let initialDocumentLength = 0;
        // Get how many docs there are
        try {
          initialDocumentLength = (
            await TransactionDocumentClientService.byTransactionID(
              transactionPassed.getId(),
            )
          ).length;
        } catch (err) {
          console.error(
            `An error occurred while getting the amount of items in the bucket: ${err}`,
          );
          alert(
            'An error occurred while double-checking that the file exists.',
          );
        }

        let status;
        try {
          console.log('UPLOADING TO BUCKET');
          status = await uploadFileToS3Bucket(
            name,
            fileData,
            'kalos-transactions',
          );
          console.log(`UPLOADED WITH STATUS '${status}'`);
          if (status === 'ok') {
            const fReq = new File();
            fReq.setBucket('kalos-transactions');
            fReq.setName(name);

            fReq.setMimeType(data.file);
            fReq.setOwnerId(loggedUserId);
            const uploadFile = await FileClientService.Create(fReq);

            const tDoc = new TransactionDocument();
            tDoc.setDescription(data.description);
            tDoc.setTypeId(data.invoiceWaiverType);
            if (data.description != 'Invoice') {
              tDoc.setTypeId(1);
            }
            tDoc.setTransactionId(transactionPassed.getId());
            tDoc.setReference(nameWithoutId);
            tDoc.setFileId(uploadFile.getId());
            await TransactionDocumentClientService.Create(tDoc);
            setSaving(false);
            setSaved(true);
            setFormKey(formKey + 1);
          } else {
            setError(true);
            alert(
              'An error occurred while uploading the file to the S3 bucket.',
            );
            try {
              let log = new ActivityLog();
              log.setActivityDate(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
              log.setUserId(loggedUserId);
              log.setActivityName(
                `ERROR : An error occurred while uploading a file to the S3 bucket ${'kalos-transactions'} (Status came back as ${status}). File name: ${name}`,
              );
              await ActivityLogClientService.Create(log);
            } catch (err) {
              console.error(
                `An error occurred while uploading an activity log for an error in an S3 bucket: ${err}`,
              );
            }
          }
          try {
            const docs = await TransactionDocumentClientService.byTransactionID(
              transactionPassed.getId(),
            );
            if (docs.length <= initialDocumentLength) {
              alert(
                'Upload was unsuccessful, please contact the webtech team.',
              );
              return;
            }
            console.log('DOC LENGTH WAS GOOD FROM CHECK: ', docs.length);
          } catch (err) {
            console.error(
              `An error occurred while double-checking that the file which was just uploaded exists: ${err}`,
            );
            alert(
              'An error occurred while double-checking that the file exists. Please retry the upload, and if the problem persists, please contact the webtech team.',
            );
          }
        } catch (err) {
          console.error(
            `An error occurred while uploading the file to S3: ${err}`,
          );
          try {
            let log = new ActivityLog();
            log.setActivityDate(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
            log.setUserId(loggedUserId);
            log.setActivityName(
              `ERROR : An error occurred while uploading a file to the S3 bucket ${'kalos-transactions'}. File name: ${name}. Error: ${err}`,
            );
            await ActivityLogClientService.Create(log);
          } catch (err) {
            console.error(
              `An error occurred while uploading an activity log for an error in an S3 bucket: ${err}`,
            );
          }
        }
      } else {
        setSaving(false);
        setSaved(true);
        setFormKey(formKey + 1);
      }

      if (onUpload) onUpload();
    },
    [
      fileData,
      setSaving,
      setFormKey,
      transactionPassed,
      formKey,
      loggedUserId,
      onUpload,
    ],
  );

  let SCHEMA: Schema<Entry> = [
    [
      {
        name: 'description',
        label: 'Document Type',
        options: ['PickTicket', 'Receipt', 'Invoice'],
        required: true,
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
      {
        name: 'invoiceWaiverType',
        label: 'Waiver Type',
        options: WaiverTypes,
        required: formData.description == 'Invoice',
        invisible: formData.description !== 'Invoice',
      },
    ],
  ] as Schema<Entry>;
  return (
    <>
      <Form<Entry>
        key={formKey}
        title={title}
        schema={SCHEMA}
        data={formData}
        onClose={onClose}
        onChange={a =>
          setFormData({
            description: a.description,
            file: a.file,
            invoiceWaiverType: a.invoiceWaiverType,
          })
        }
        onSave={() => handleSubmit(formData)}
        submitLabel="Add Photo To Transaction"
        cancelLabel="Close"
        disabled={saving}
        intro={
          saved && (
            <Alert severity="success" className="UploadPhotoSuccess">
              <big>File Successfully Uploaded!</big>
              <br />
              You can upload another file.
            </Alert>
          )
        }
        error={
          error &&
          (nameValidationError ? (
            <>{nameValidationError}</>
          ) : (
            <>Error while uploading file. Please try again.</>
          ))
        }
        fullWidth={fullWidth}
      />
    </>
  );
};
