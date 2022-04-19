import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import CopyIcon from '@material-ui/icons/FileCopySharp';
import SubmitIcon from '@material-ui/icons/ThumbUpSharp';
import RejectIcon from '@material-ui/icons/ThumbDownSharp';
import KeyboardIcon from '@material-ui/icons/KeyboardSharp';
import UploadIcon from '@material-ui/icons/CloudUploadSharp';
import NotesIcon from '@material-ui/icons/EditSharp';
import CheckIcon from '@material-ui/icons/CheckCircleSharp';
import CloseIcon from '@material-ui/icons/Close';
import { Prompt } from '../../Prompt/main';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import { Checkbox } from '@material-ui/core';
import { PopoverComponent } from '../../ComponentsLibrary/Popover';
import { Transaction } from '../../../@kalos-core/kalos-rpc/Transaction';
import { S3Client } from '../../../@kalos-core/kalos-rpc/S3File';
import { Event } from '../../../@kalos-core/kalos-rpc/Event';
import { TransactionDocumentClient } from '../../../@kalos-core/kalos-rpc/TransactionDocument';
import { UserClient, User } from '../../../@kalos-core/kalos-rpc/User';
import { EmailClient, EmailConfig } from '../../../@kalos-core/kalos-rpc/Email';
import { TxnLog } from './log';
import { TxnNotes } from './notes';
import {
  getSlackID,
  timestamp,
  EventClientService,
  TransactionDocumentClientService,
} from '../../../helpers';
import { ENDPOINT } from '../../../constants';
import { PDFMaker } from '../../ComponentsLibrary/PDFMaker';
import {
  AccountPicker,
  DepartmentPicker,
} from '../../ComponentsLibrary/Pickers/index';
import { AltGallery, GalleryData } from '../../AltGallery/main';
import { Row } from '../../ComponentsLibrary/InfoTable';

import { Tooltip } from '../../ComponentsLibrary/Tooltip';
import { parseISO } from 'date-fns';
import { EventClient } from '../../../@kalos-core/kalos-rpc/Event';
import { FlagOutlined } from '@material-ui/icons';

interface props {
  txn: Transaction;
  departmentView: boolean;
  acceptOverride: boolean;
  userID: number;
  accountingAdmin: boolean;
  enter(): Promise<void>;
  audit(): Promise<void>;
  accept(): Promise<void>;
  reject(reason?: string): Promise<void>;
  refresh(): Promise<void>;
  addJobNumber(jn: string): Promise<void>;
  updateNotes(notes: string): Promise<void>;
  markAsDuplicate(notes: string): Promise<void>;
  reactivateTransaction(notes: string): Promise<void>;
  updateCostCenter(id: number): Promise<void>;
  updateDepartment(id: number): Promise<void>;
  updateStateTax(status: boolean): Promise<void>;
  toggleLoading(cb?: () => void): void;
  editingCostCenter: boolean;
  editingDepartment: boolean;
  editingStateTax: boolean;
  toggleEditingCostCenter(): void;
  toggleEditingDepartment(): void;
  toggleEditingStateTax(): void;
}

export function TransactionRow({
  txn,
  enter,
  accept,
  reject,
  refresh,
  audit,
  addJobNumber,
  updateNotes,
  markAsDuplicate,
  reactivateTransaction,
  acceptOverride,
  updateCostCenter,
  updateStateTax,
  updateDepartment,
  editingDepartment,
  editingStateTax,
  accountingAdmin,
  //jobInfo,
  userID,
  editingCostCenter,
  toggleEditingCostCenter,
  toggleEditingDepartment,
  toggleEditingStateTax,
}: props): Row {
  const FileInput = React.createRef<HTMLInputElement>();

  const clients = {
    user: new UserClient(ENDPOINT),
    email: new EmailClient(ENDPOINT),
    docs: new TransactionDocumentClient(ENDPOINT),
    s3: new S3Client(ENDPOINT),
    job: new EventClient(ENDPOINT),
  };

  const getJobNumberInfo = async (number: number) => {
    let returnString = ['No Job Info Found'];
    if (number != 0) {
      try {
        console.log('we got called to get info');
        const eventReq = new Event();
        eventReq.setId(number);
        const res = await EventClientService.Get(eventReq);
        const descritpion = 'Job Description: ' + res.getDescription();
        const customer =
          'Customer: ' +
          (res.getCustomer() === undefined
            ? 'No Customer '
            : `${res.getCustomer()!.getFirstname()} ${res
                .getCustomer()!
                .getLastname()}`);
        const property =
          'Property: ' +
          (res.getProperty() === undefined
            ? 'No Property'
            : `${res.getProperty()!.getAddress()} ${res
                .getProperty()!
                .getCity()}`);
        returnString = [descritpion, customer, property];
      } catch (error) {
        console.log('Not a number');
      }
    }
    return returnString;
  };
  const handleFile = (e: any) => {
    const fr = new FileReader();
    fr.onload = async () => {
      try {
        const u8 = new Uint8Array(fr.result as ArrayBuffer);
        await clients.docs.upload(
          txn.getId(),
          FileInput.current!.files![0].name,
          u8,
        );
      } catch (err) {
        alert('File could not be uploaded');
        console.log(err);
      }
      if (accountingAdmin) {
        await accept();
        await audit();
      }
      await refresh();
      alert('Upload complete!');
    };
    if (FileInput.current && FileInput.current.files) {
      fr.readAsArrayBuffer(FileInput.current.files[0]);
    }
  };

  const generateMissing = async (fileData: Uint8Array, txn: Transaction) => {
    await TransactionDocumentClientService.upload(
      txn.getId(),
      `${timestamp()}-generated.pdf`,
      fileData,
    );

    if (accountingAdmin) {
      await accept();
      await audit();
    }
    alert('A PDF has been generated and uploaded for you.');
  };

  const openFileInput = () => {
    FileInput.current && FileInput.current.click();
  };

  const updateStatus = async () => {
    const ok = confirm(
      `Are you sure you want to mark this transaction as ${
        acceptOverride ? 'accepted' : 'recorded'
      }?`,
    );
    if (ok) {
      const fn = acceptOverride ? accept : enter;
      await fn();
      await refresh();
    }
  };

  const forceAccept = async () => {
    const ok = confirm(
      `Are you sure you want to mark this transaction as accepted?`,
    );
    if (ok) {
      await accept();
      await refresh();
    }
  };
  const auditTxn = async () => {
    const ok = confirm(
      'Are you sure you want to mark all the information on this transaction (including all attached photos) as correct? This action is irreversible.',
    );
    if (ok) {
      await audit();
      await refresh();
    }
  };

  const dispute = async (reason: string) => {
    const userReq = new User();
    userReq.setId(txn.getOwnerId());
    const user = await clients.user.Get(userReq);

    // Request for this user
    const sendingReq = new User();
    sendingReq.setId(userID);
    const sendingUser = await clients.user.Get(sendingReq);
    const body = getRejectTxnBody(
      reason,
      txn.getAmount(),
      txn.getDescription(),
      txn.getVendor(),
    );
    const email: EmailConfig = {
      type: 'receipts',
      recipient: user.getEmail(),
      subject: 'Receipts',
      from: sendingUser.getEmail(),
      body,
    };

    try {
      await clients.email.sendMail(email);
    } catch (err) {
      console.log(err);
      alert('An error occurred, user was not notified via email');
    }
    try {
      /*const id = await getSlackID(txn.getOwnerName());
      await slackNotify(
        id,
        `A receipt you submitted has been rejected | ${txn.getDescription()} | $${prettyMoney(
          txn.getAmount(),
        )}. Reason: ${reason}`,
      );
      await slackNotify(
        id,
        `https://app.kalosflorida.com?action=admin:reports.transactions`,
      );*/
    } catch (err) {
      console.log(err);
      alert('An error occurred, user was not notified via slack');
    }

    await reject(reason);
    console.log(body);
    await refresh();
  };

  const handleCostCenterSelect = async (id: number) => {
    await updateCostCenter(id);
    toggleEditingCostCenter();
  };
  const handleDepartmentSelect = async (id: number) => {
    await updateDepartment(id);
    toggleEditingDepartment();
  };
  const handleStateTaxSelect = async (status: boolean) => {
    await updateStateTax(status);
    toggleEditingStateTax();
  };
  const amount = prettyMoney(txn.getAmount());
  return [
    {
      value: parseISO(
        txn.getTimestamp().split(' ').join('T'),
      ).toLocaleDateString(),
    },
    {
      value: `${txn.getOwnerName()}` || '',
    },
    {
      value:
        editingCostCenter && txn.getIsActive() == 1 ? (
          <AccountPicker
            selected={txn.getCostCenter() ? txn.getCostCenter()!.getId() : 0}
            onSelect={handleCostCenterSelect}
            hideInactive
            renderItem={i => (
              <option
                value={i.getId()}
                key={`${i.getDescription()}-${i.getId()}`}
              >
                {i.getDescription()}
              </option>
            )}
          />
        ) : txn.getCostCenter() ? (
          `${txn.getCostCenter()!.getDescription()} (${txn
            .getCostCenter()!
            .getId()})`
        ) : (
          ''
        ),
      actions:
        txn.getIsActive() == 1
          ? [
              <IconButton
                key="edit"
                size="small"
                onClick={toggleEditingCostCenter}
              >
                {editingCostCenter ? <CloseIcon /> : <EditIcon />}
              </IconButton>,
            ]
          : undefined,
    },
    {
      value:
        editingDepartment && txn.getIsActive() ? (
          <DepartmentPicker
            selected={txn.getDepartmentId() ? txn.getDepartmentId() : 0}
            onSelect={handleDepartmentSelect}
            hideInactive
            renderItem={i => (
              <option
                value={i.getId()}
                key={`${i.getDescription()}-${i.getValue()}`}
              >
                {i.getDescription()}
              </option>
            )}
          />
        ) : txn.getDepartment() ? (
          `${txn.getDepartment()!.getDescription()}`
        ) : (
          ''
        ),
      actions:
        txn.getIsActive() == 1
          ? [
              <IconButton
                key="edit"
                size="small"
                onClick={toggleEditingDepartment}
              >
                {editingDepartment ? <CloseIcon /> : <EditIcon />}
              </IconButton>,
            ]
          : undefined,
    },

    {
      value:
        txn.getJobId() != 0 ? (
          <PopoverComponent
            buttonLabel={txn.getJobId() === 0 ? '' : txn.getJobId().toString()}
            onClick={() => getJobNumberInfo(txn.getJobId())}
          />
        ) : (
          txn.getJobId()
        ),
    },
    {
      value: txn.getArtificalId(),
    },
    {
      value: `$ ${amount}`,
    },

    {
      value: txn.getVendor(),
    },
    {
      value:
        editingStateTax && txn.getIsActive() == 1 ? (
          <Checkbox
            checked={txn.getStateTaxApplied()}
            onChange={event => handleStateTaxSelect(event.target.checked)}
          />
        ) : txn.getStateTaxApplied() != undefined ? (
          `${txn.getStateTaxApplied() === true ? 'Applied' : 'Not Applied'}`
        ) : (
          ''
        ),
      actions:
        txn.getIsActive() == 1
          ? [
              <IconButton
                key="edit"
                size="small"
                onClick={toggleEditingStateTax}
              >
                {editingStateTax ? <CloseIcon /> : <EditIcon />}
              </IconButton>,
            ]
          : undefined,
    },
    {
      value: '',
      actions:
        txn.getIsActive() == 1
          ? [
              <Tooltip key="copy" content="Copy data to clipboard">
                <IconButton
                  size="small"
                  onClick={() =>
                    copyToClipboard(
                      `${parseISO(
                        txn.getTimestamp().split(' ').join('T'),
                      ).toLocaleDateString()},${txn.getDescription()},${amount},${txn.getOwnerName()},${txn.getVendor()}`,
                    )
                  }
                >
                  <CopyIcon />
                </IconButton>
              </Tooltip>,
              <Tooltip key="upload" content="Upload File">
                <IconButton size="small" onClick={openFileInput}>
                  <UploadIcon />
                  <input
                    type="file"
                    ref={FileInput}
                    onChange={handleFile}
                    style={{ display: 'none' }}
                  />
                </IconButton>
              </Tooltip>,
              <Prompt
                key="updateJobNumber"
                confirmFn={addJobNumber}
                text="Update Job Number"
                prompt="New Job Number: "
                Icon={KeyboardIcon}
              />,
              <Prompt
                key="editNotes"
                confirmFn={updateNotes}
                text="Edit Notes"
                prompt="Update Txn Notes: "
                Icon={NotesIcon}
                defaultValue={txn.getNotes()}
                multiline
              />,
              ...([9928, 9646, 103323, 9809, 1734].includes(userID)
                ? [
                    <Prompt
                      key="markDuplicate"
                      confirmFn={markAsDuplicate}
                      text="Mark as Duplicate"
                      prompt="Enter Reason for Marking as Duplicate "
                      Icon={FlagOutlined}
                      defaultValue={''}
                      multiline
                    />,
                  ]
                : []),
              <AltGallery
                key="receiptPhotos"
                title="Transaction Photos"
                fileList={getGalleryData(txn)}
                transactionID={txn.getId()}
                text="View photos"
                iconButton
              />,
              <TxnLog key="txnLog" iconButton txnID={txn.getId()} />,
              <PDFMaker
                key={'missing' + txn.getId()}
                dateStr={txn.getTimestamp()}
                name={txn.getOwnerName()}
                title="Missing"
                icon={<CloseIcon />}
                iconLabel={'Upload Missing PDF'}
                amount={txn.getAmount()}
                onCreate={output => generateMissing(output, txn)}
                jobNumber={`${txn.getJobId()}`}
                vendor={txn.getVendor()}
                pdfType="Missing Receipt Manager"
              />,
              <TxnNotes
                key="viewNotes"
                iconButton
                text="View notes"
                notes={txn.getNotes()}
                disabled={txn.getNotes() === ''}
              />,
              ...([9928, 9646, 103323, 9809, 1734].includes(userID)
                ? [
                    <Tooltip
                      key="audit"
                      content={
                        txn.getIsAudited() && userID !== 1734
                          ? 'This transaction has already been audited'
                          : 'Mark as correct'
                      }
                    >
                      <span>
                        <IconButton
                          size="small"
                          onClick={userID === 1734 ? forceAccept : auditTxn}
                          disabled={txn.getIsAudited() && userID !== 1734}
                        >
                          <CheckIcon />
                        </IconButton>
                      </span>
                    </Tooltip>,
                  ]
                : []),
              <Tooltip
                key="submit"
                content={
                  acceptOverride ? 'Mark as accepted' : 'Mark as entered'
                }
              >
                <IconButton size="small" onClick={updateStatus}>
                  <SubmitIcon />
                </IconButton>
              </Tooltip>,
              <Prompt
                key="reject"
                confirmFn={dispute}
                text="Reject transaction"
                prompt="Enter reason for rejection: "
                Icon={RejectIcon}
              />,
            ]
          : txn.getIsActive() == 0 && acceptOverride
          ? [
              <Prompt
                key="makeActive"
                confirmFn={reactivateTransaction}
                text="Reactivate Transaction"
                prompt="Enter Reason for Reactivating Transaction "
                Icon={KeyboardReturnIcon}
                defaultValue={''}
                multiline
              />,
            ]
          : undefined,
      actionsFullWidth: true,
    },
  ];
}

function copyToClipboard(text: string): void {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

export function prettyMoney(amount: number): string {
  const [dollars, cents] = amount.toString().split('.');
  if (!cents) {
    return `${dollars}.00`;
  } else if (cents.length === 1) {
    return `${dollars}.${cents}0`;
  } else {
    return `${dollars}.${cents}`;
  }
}

function getGalleryData(txn: Transaction): GalleryData[] {
  return txn.getDocumentsList().map(d => {
    return {
      key: `${txn.getId()}-${d.getReference()}`,
      bucket: 'kalos-transactions',
      typeId: d.getTypeId(),
      description: d.getDescription(),
    };
  });
}

function getRejectTxnBody(
  reason: string,
  amount: number,
  description: string,
  vendor: string,
): string {
  return `
<body>
  <table style="width:70%;">
    <thead>
      <th style="text-align:left;">Reason</th>
      <th style="text-align:left;">Amount</th>
      <th style="text-align:left;">Info</th>
    </thead>
    <tbody>
      <tr>
        <td>${reason}</td>
        <td>${prettyMoney(amount)}</td>
        <td>${description}${vendor != '' ? ` - ${vendor}` : ''}</td>
      </tr>
    </body>
  </table>
  <a href="https://app.kalosflorida.com?action=admin:reports.transactions">Go to receipts</a>
</body>`;
}
