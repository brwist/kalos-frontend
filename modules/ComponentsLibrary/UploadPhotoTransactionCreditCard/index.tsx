import React, { FC, useState, useCallback } from 'react';
import Alert from '@material-ui/lab/Alert';
import { Form, Schema } from '../Form';
import { Transaction } from '../../../@kalos-core/kalos-rpc/Transaction';
import { TransactionAccountList } from '../../../@kalos-core/kalos-rpc/TransactionAccount';
import {
  getFileExt,
  SUBJECT_TAGS_TRANSACTIONS,
  timestamp,
  TransactionActivityClientService,
  TransactionClientService,
  uploadPhotoToExistingTransaction,
} from '../../../helpers';

import { RoleType } from '../Payroll';
import { SUBJECT_TAGS_ACCOUNTS_PAYABLE } from '../../../@kalos-core/kalos-rpc/S3File';
import { Confirm } from '../Confirm';
import { format } from 'date-fns';
import { TransactionActivity } from '../../../@kalos-core/kalos-rpc/TransactionActivity';

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
  vendor: string;
  cost: number;
  ownerId: number;
  costCenter: number;
  department: number;
};
export type CostCenter = {
  value: number;
  label: string;
};
export const UploadPhotoTransactionCreditCard: FC<Props> = ({
  onClose,
  bucket,
  loggedUserId,
  costCenters,
  title = 'Create Transaction',
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
    ownerId: loggedUserId,
    vendor: '',
    cost: 0,
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
      newTransaction.setStatusId(2);
      newTransaction.setIsActive(1);
      newTransaction.setOwnerId(data.ownerId);
      newTransaction.setAssignedEmployeeId(loggedUserId);
      newTransaction.setAmount(data.cost);
      newTransaction.setDescription(data.description);
      newTransaction.setNotes(data.description);
      newTransaction.setVendor(data.vendor);
      newTransaction.setCostCenterId(data.costCenter);
      newTransaction.setTimestamp(timestamp());
      newTransaction.setIsRecorded(true);
      newTransaction.setDepartmentId(data.department);

      let insert: Transaction | undefined = undefined;
      try {
        insert = await TransactionClientService.Create(newTransaction);
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

      if (!insert) {
        console.error(
          `No transaction to upload a photo for, as the call to TransactionClientService.Create was unsuccessful. Returning.`,
        );
        return;
      }

      if (data.file) {
        const ext = getFileExt(data.file);
        const name = `${insert!.getId()}-${data.description}-${Math.floor(
          Date.now() / 1000,
        )}.${ext}`;
        await uploadPhotoToExistingTransaction(
          name,
          undefined,
          fileData,
          insert,
          loggedUserId,
          1,
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
    [loggedUserId, onUpload, fileData, formKey],
  );
  function uniq(a: { label: string; value: string }[]) {
    let newArray = [];
    for (let i = 0; i < a.length; i++) {
      const temp = newArray.find(
        b => b.value === a[i].value && b.label === a[i].label,
      );
      if (temp == undefined) {
        newArray.push(a[i]);
      }
    }
    return newArray;
  }
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
        name: 'ownerId',
        label: 'Purchaser ',
        type: 'technician',
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
      {
        name: 'costCenter',
        label: 'Cost Center',
        type: 'number',
        options: costCenters.getResultsList().map(center => ({
          label: `${center.getDescription()} (${center.getId()})`,
          value: center.getId(),
        })),
        required: true,
      },
    ],
    [
      {
        name: 'cost',
        label: 'Cost',
        type: 'number',
      },
    ],
  ] as Schema<Entry>;
  console.log('its opening');
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
        key={formKey}
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
