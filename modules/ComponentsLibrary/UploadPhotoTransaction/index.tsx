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
  ActivityLogClientService,
  TransactionActivityClientService,
} from '../../../helpers';
import './styles.less';
import { ENDPOINT } from '../../../constants';
import { RoleType } from '../Payroll';
import { SUBJECT_TAGS_ACCOUNTS_PAYABLE } from '@kalos-core/kalos-rpc/S3File';
import { File } from '@kalos-core/kalos-rpc/File';
import { TransactionDocument } from '@kalos-core/kalos-rpc/TransactionDocument';
import { Confirm } from '../Confirm';
import { ActivityLog } from '@kalos-core/kalos-rpc/ActivityLog';
import { format } from 'date-fns';
import { TransactionActivity } from '@kalos-core/kalos-rpc/TransactionActivity';
import { InsertChartOutlinedRounded } from '@material-ui/icons';

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
  invoiceNumber: string;
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
  title = 'Upload Transaction For Non Credit Card Receipts',
  defaultTag = 'PickTicket',
  defaultPurchase = 'Fuel',
  fullWidth = true,
  role,
  onUpload,
}) => {
  const [fileData, setFileData] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [validateJobNumber, setValidateJobNumber] = useState<Entry | undefined>(
    undefined,
  );
  const [nameValidationError, setNameValidationError] = useState<
    string | undefined
  >(undefined);
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
    invoiceNumber: '',
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
      const newTransaction = new Transaction();
      newTransaction.setJobId(data.eventId);
      const type = data.tag.replace('Subject=', '');
      newTransaction.setVendorCategory(type);
      newTransaction.setStatusId(2);
      newTransaction.setIsActive(1);
      newTransaction.setOwnerId(loggedUserId);
      newTransaction.setAmount(data.cost);
      newTransaction.setDescription(data.description);
      newTransaction.setVendor(data.vendor);
      newTransaction.setCostCenterId(data.costCenter);
      newTransaction.setTimestamp(timestamp());
      newTransaction.setIsRecorded(true);
      newTransaction.setDepartmentId(data.department);
      newTransaction.setOrderNumber(data.orderNumber);
      newTransaction.setInvoiceNumber(data.invoiceNumber);
      const insertRecord = new TransactionClient(ENDPOINT);
      let insert: Transaction | undefined = undefined;
      try {
        insert = await insertRecord.Create(newTransaction);
      } catch (err) {
        console.error(
          `An error occurred while uploading a transaction: ${err}`,
        );
        try {
          let log = new TransactionActivity();
          log.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
          log.setUserId(loggedUserId);
          log.setStatusId(2);
          log.setIsActive(1);
          log.setDescription(
            `ERROR : An error occurred while uploading a transaction: ${err}. Vendor: ${data.vendor}`,
          );
          await TransactionActivityClientService.Create(log);
        } catch (err) {
          console.error(
            `An error occurred while uploading a transaction activity log for an error in an S3 bucket: ${err}`,
          );
        }
      }
      if (data.file) {
        const ext = getFileExt(data.file);
        const name = `${insert!.getId()}-${data.description}-${Math.floor(
          Date.now() / 1000,
        )}.${ext}`;
        const nameWithoutId = `${data.description}-${Math.floor(
          Date.now() / 1000,
        )}.${ext}`;
        console.log(name);

        let initialDocumentLength = 0;
        // Get how many docs there are
        try {
          initialDocumentLength = (
            await TransactionDocumentClientService.byTransactionID(
              insert!.getId(),
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
          status = await uploadFileToS3Bucket(name, fileData, bucket, data.tag);
          console.log(`UPLOADED WITH STATUS '${status}'`);
          if (status === 'ok') {
            const fReq = new File();
            fReq.setBucket(bucket);
            fReq.setName(name);
            fReq.setMimeType(data.file);
            fReq.setOwnerId(loggedUserId);
            const uploadFile = await FileClientService.Create(fReq);

            const tDoc = new TransactionDocument();
            if (insert) tDoc.setTransactionId(insert.getId());
            tDoc.setReference(nameWithoutId);
            tDoc.setFileId(uploadFile.getId());
            tDoc.setTypeId(1);
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
                `ERROR : An error occurred while uploading a file to the S3 bucket ${bucket} (Status came back as ${status}). File name: ${name}`,
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
              insert!.getId(),
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
              `ERROR : An error occurred while uploading a file to the S3 bucket ${bucket}. File name: ${name}. Error: ${err}`,
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
    [fileData, setSaving, setFormKey, formKey, bucket, loggedUserId, onUpload],
  );

  const handleSetValidateJobNumber = useCallback(
    (validate: Entry | undefined) => setValidateJobNumber(validate),
    [setValidateJobNumber],
  );
  const handleValidate = useCallback(
    (entry: Entry) => {
      // @ts-expect-error
      if (entry.eventId === '') {
        handleSetValidateJobNumber(entry);
        return;
      }
      handleSubmit(entry);
    },
    [handleSetValidateJobNumber, handleSubmit],
  );

  let SCHEMA: Schema<Entry> = [
    [
      {
        name: 'tag',
        label: 'Tag',
        required: role != 'AccountsPayable',
        options: SUBJECT_TAGS_ACCOUNTS_PAYABLE,
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
        required: role != 'AccountsPayable',
      },
    ],
    [
      {
        name: 'orderNumber',
        label: 'Order #',
        required: true,
      },
      {
        name: 'invoiceNumber',
        label: 'Invoice #',
      },
    ],
    [
      {
        name: 'eventId',
        label: 'Job Number',
        type: 'eventId',
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
    [
      {
        name: 'cost',
        label: 'Cost',
        type: 'number',
        invisible:
          formData.tag != 'Subject=Receipt' &&
          formData.tag != 'Subject=Invoice',
      },
    ],
  ] as Schema<Entry>;
  return (
    <>
      {validateJobNumber && (
        <Confirm
          title="No Job Number Set"
          open={validateJobNumber !== undefined}
          onClose={() => handleSetValidateJobNumber(undefined)}
          onConfirm={() => {
            handleSubmit(validateJobNumber);
            handleSetValidateJobNumber(undefined);
          }}
        >
          Are you sure that this transaction does not require a job number?
        </Confirm>
      )}
      <Form<Entry>
        key={formKey + formData.tag}
        title={title}
        schema={SCHEMA}
        data={formData}
        onClose={onClose}
        onSave={saved => handleValidate(saved)}
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
