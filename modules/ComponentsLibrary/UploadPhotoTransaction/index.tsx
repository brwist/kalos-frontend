import React, { FC, useState, useCallback, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import { Form, Schema } from '../Form';
import {
  Transaction,
  TransactionClient,
} from '@kalos-core/kalos-rpc/Transaction';
import { TransactionAccountList } from '@kalos-core/kalos-rpc/TransactionAccount';
import {
  uploadFileToS3Bucket,
  getFileExt,
  getMimeType,
  SUBJECT_TAGS_TRANSACTIONS,
  timestamp,
  TransactionDocumentClientService,
  FileClientService,
} from '../../../helpers';
import './styles.less';
import { ENDPOINT } from '../../../constants';
import { RoleType } from '../Payroll';
import { SUBJECT_TAGS_ACCOUNTS_PAYABLE } from '@kalos-core/kalos-rpc/S3File';
import { File } from '@kalos-core/kalos-rpc/File';
import { TransactionDocument } from '@kalos-core/kalos-rpc/TransactionDocument';

interface Props {
  loggedUserId: number;
  title?: string;
  bucket: string;
  onClose: (() => void) | null;
  onUpload?: (() => void) | null;
  defaultTag?: string;
  defaultPurchase?: number;
  costCenters: TransactionAccountList;
  fullWidth?: boolean;
  role?: RoleType;
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
  orderNumber: string;
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
  fullWidth = true,
  role,
  onUpload,
}) => {
  const [fileData, setFileData] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  let temp = costCenters.getResultsList().map(entry => {
    return {
      value: entry.toObject().id,
      label: entry.toObject().description,
    };
  });
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
      SUBJECT_TAGS_TRANSACTIONS.find(({ label }) => label === defaultTag) || {
        value: '',
      }
    ).value,
    orderNumber: '',
  });
  const [formKey, setFormKey] = useState<number>(0);
  const handleFileLoad = useCallback(
    (fileData: string) => setFileData(fileData),
    [setFileData],
  );
  // TODO reminding myself to fix this in a bit, we don't need to switch between Entry and Transaction, we can just use Transaction
  // ! Also no need to create a new Transaction client when we can reuse the one from Helpers
  const handleSubmit = useCallback(
    async (data: Entry) => {
      setSaved(false);
      setError(false);
      setSaving(true); 
      const newTransaction = new Transaction();
      newTransaction.setJobId(data.eventId);
      const type = data.tag.replace('Subject=', '');
      newTransaction.setVendorCategory(type);
      newTransaction.setStatusId(2);
      newTransaction.setIsActive(1);
      newTransaction.setOwnerId(loggedUserId);
      newTransaction.setAmount(data.cost);
      newTransaction.setNotes(data.description);
      newTransaction.setVendor(data.vendor);
      newTransaction.setCostCenterId(data.costCenter);
      newTransaction.setTimestamp(timestamp());
      newTransaction.setIsRecorded(true);
      newTransaction.setDepartmentId(data.department);
      newTransaction.setOrderNumber(data.orderNumber);
      const insertRecord = new TransactionClient(ENDPOINT);
      const insert = await insertRecord.Create(newTransaction);
      if (data.file) {
        const ext = getFileExt(data.file);
        const name = `${insert.getId()}-${data.description}-${Math.floor(
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
          const fReq = new File();
          fReq.setBucket(bucket);
          fReq.setName(name);
          fReq.setMimeType(data.file);
          fReq.setOwnerId(loggedUserId);
          const uploadFile = await FileClientService.Create(fReq);

          const tDoc = new TransactionDocument();
          tDoc.setTransactionId(insert.getId());
          tDoc.setReference(nameWithoutId);
          tDoc.setFileId(uploadFile.getId());
          tDoc.setTypeId(1);
          await TransactionDocumentClientService.Create(tDoc);
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

      if (onUpload) onUpload();
    },
    [fileData, setSaving, setFormKey, formKey, bucket, loggedUserId, onUpload],
  );

  let conditionalSchema = [
    formData.tag == 'Subject=Receipt'
      ? [
          {
            name: 'cost',
            label: 'Cost',
            type: 'number',
            required: true,
          },
        ]
      : [{}],
  ];

  let SCHEMA: Schema<Entry> = [
    [
      {
        name: 'tag',
        label: 'Tag',
        required: role != 'AccountsPayable',
        options:
          role != 'AccountsPayable'
            ? SUBJECT_TAGS_TRANSACTIONS
            : SUBJECT_TAGS_ACCOUNTS_PAYABLE,
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
        name: 'description',
        label: 'Description',
        required: role != 'AccountsPayable',
      },
    ],
    [
      {
        name: 'orderNumber',
        label: 'Order #',
        required: true,
      },
    ],
    [
      {
        name: 'eventId',
        label: 'Job Number',
        type: 'eventId',
        required: role != 'AccountsPayable',
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
        required: true,
      },
    ],
    ...conditionalSchema,
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
      fullWidth={fullWidth}
    />
  );
};
