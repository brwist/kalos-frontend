import React, { FC, useState, useCallback, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import { Form, Schema } from '../Form';
import {
  Transaction,
  TransactionClient,
} from '@kalos-core/kalos-rpc/Transaction';
import {
  TransactionAccount,
  TransactionAccountList,
  TransactionAccountClient,
} from '@kalos-core/kalos-rpc/TransactionAccount';
import {
  uploadFileToS3Bucket,
  getFileExt,
  getMimeType,
  upsertFile,
  upsertTransactionDocument,
  SUBJECT_TAGS,
  UserClientService,
  timestamp,
} from '../../../helpers';
import './styles.less';
import { ENDPOINT } from '../../../constants';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import { type } from 'os';
import { AccountPicker } from '../Pickers';
import { id } from 'date-fns/locale';

interface Props {
  loggedUserId: number;
  title?: string;
  bucket: string;
  onClose: (() => void) | null;
  defaultTag?: string;
  defaultPurchase?: number;
  costCenters: TransactionAccountList;
}

type Entry = {
  file?: string;
  description: string;
  eventId: number;
  tag: string;
  vendor: string;
  cost: number;
  costCenter: number;
  department: number;
};
export type CostCenter = {
  value: number;
  label: string;
};
export const UploadPhotoTransaction: FC<Props> = ({
  onClose,
  bucket,
  loggedUserId,
  costCenters,
  title = 'Upload Transaction',
  defaultTag = 'Receipt',
  defaultPurchase = 'Fuel',
}) => {
  const [fileData, setFileData] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [load, setLoad] = useState<boolean>(false);
  let temp = costCenters.getResultsList().map(entry => {
    return {
      value: entry.toObject().id,
      label: entry.toObject().description,
    };
  });
  const [costCenterList, setCostCenterList] = useState<CostCenter[]>(temp);
  console.log({ costCenterList });
  const [formData, setFormData] = useState<Entry>({
    file: '',
    description: '',
    eventId: 0,
    department: 0,
    costCenter: (
      temp.find(({ label }) => label === defaultPurchase) || {
        value: 0,
      }
    ).value,
    vendor: '',
    cost: 0,
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
      const newTransaction = new Transaction();
      newTransaction.setJobId(data.eventId);
      const type = data.tag.replace('Subject=', '');
      newTransaction.setVendorCategory(type);
      newTransaction.setStatusId(1);
      newTransaction.setIsActive(1);
      newTransaction.setOwnerId(loggedUserId);
      newTransaction.setAmount(data.cost);
      newTransaction.setNotes(data.description);
      newTransaction.setVendor(data.vendor);
      newTransaction.setCostCenterId(data.costCenter);
      newTransaction.setTimestamp(timestamp());
      newTransaction.setIsRecorded(true);
      newTransaction.setDepartmentId(data.department);
      const insertRecord = new TransactionClient(ENDPOINT);
      const insert = await insertRecord.Create(newTransaction);
      if (data.file) {
        const ext = getFileExt(data.file);
        const name = `${insert.id}-${data.description}-${Math.floor(
          Date.now() / 1000,
        )}.${ext}`;
        const nameWithoutId = `${data.description}-${Math.floor(
          Date.now() / 1000,
        )}.${ext}`;
        console.log(name);
        const status = await uploadFileToS3Bucket(
          name,
          fileData,
          bucket,
          data.tag,
        );
        if (status === 'ok') {
          const uploadFile = await upsertFile({
            bucket,
            name,
            mimeType: getMimeType(data.file),
            ownerId: loggedUserId,
          });
          await upsertTransactionDocument({
            transactionId: insert.id,
            reference: nameWithoutId,
            fileId: uploadFile.id,
            typeId: 1,
          });
          setSaving(false);
          setSaved(true);
          setFormKey(formKey + 1);
        } else {
          setError(true);
        }
      } else {
        setSaving(false);
        setSaved(true);
        setFormKey(formKey + 1);
      }
    },
    [fileData, setSaving, setFormKey, formKey, bucket, loggedUserId],
  );
  console.log({ costCenterList });

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
        onFileLoad: handleFileLoad,
      },
    ],
    [
      {
        name: 'description',
        label: 'Description',
        required: true,
      },
    ],
    [
      {
        name: 'eventId',
        label: 'Job ID,',
        type: 'eventId',
        required: true,
      },
    ],
    [
      {
        name: 'department',
        label: 'Department,',
        type: 'department',
        required: true,
      },
    ],
    [
      {
        name: 'vendor',
        label: 'Vendor',
        type: 'string',
      },
    ],
    [
      {
        name: 'costCenter',
        label: 'Purchase Type,',
        required: true,
        options: costCenterList,
      },
    ],
    [
      {
        name: 'cost',
        label: 'Cost',
        type: 'number',
        required: true,
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
      submitLabel="Create Transaction"
      cancelLabel="Close"
      disabled={saving}
      intro={
        saved && (
          <Alert severity="success" className="UploadPhotoSuccess">
            <big>Transaction Created!</big>
            <br />
            You can upload another file.
          </Alert>
        )
      }
      error={error && <>Error while uploading file. Please try again.</>}
    />
  );
};
