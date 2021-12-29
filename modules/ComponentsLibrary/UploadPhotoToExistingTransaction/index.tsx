import React, { FC, useState, useCallback } from 'react';
import Alert from '@material-ui/lab/Alert';

import { Form, Schema } from '../Form';
import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import { getFileExt, uploadPhotoToExistingTransaction } from '../../../helpers';
import './styles.less';
import { WaiverTypes } from '../../../constants';
import { RoleType } from '../Payroll';

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
  description: 'Receipt' | 'PickTicket' | 'Invoice';
  invoiceWaiverType: number;
};

export const UploadPhotoToExistingTransaction: FC<Props> = ({
  onClose,
  loggedUserId,
  transactionPassed,
  onUpload,
  title = 'Submit File To Transaction',
  fullWidth = true,
}) => {
  const [fileData, setFileData] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [formData, setFormData] = useState<Entry>({
    file: '',
    description: 'Receipt',
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
        console.log(name);

        uploadPhotoToExistingTransaction(
          name,
          data.description,
          fileData,
          transactionPassed,
          loggedUserId,
          data.invoiceWaiverType,
        );
        setSaving(false);
        setSaved(true);
        setFormKey(formKey + 1);
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
