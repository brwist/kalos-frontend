import React, { useState } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CopyIcon from '@material-ui/icons/FileCopySharp';
import SubmitIcon from '@material-ui/icons/ThumbUpSharp';
import { PopoverGallery } from '../../PopoverGallery/main';
import RejectIcon from '@material-ui/icons/ThumbDownSharp';
import KeyboardIcon from '@material-ui/icons/KeyboardSharp';
import UploadIcon from '@material-ui/icons/CloudUploadSharp';
import NotesIcon from '@material-ui/icons/EditSharp';
import { Prompt } from '../../Prompt/main';
import { IFile } from '../../Gallery/main';
import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import { S3Client, FileObject } from '@kalos-core/kalos-rpc/S3File';
import {
  TransactionDocumentClient,
  TransactionDocument,
} from '@kalos-core/kalos-rpc/TransactionDocument';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { EmailClient, EmailConfig } from '@kalos-core/kalos-rpc/Email';
import { TxnLog } from './log';
import { TxnNotes } from './notes';
import { getSlackID, slackNotify } from '../../../helpers';
import { ENDPOINT } from '../../../constants';

interface props {
  txn: Transaction.AsObject;
  departmentView: boolean;
  enter(): Promise<void>;
  accept(): Promise<void>;
  reject(reason?: string): Promise<void>;
  refresh(): Promise<void>;
  addJobNumber(jn: string): Promise<void>;
  updateNotes(notes: string): Promise<void>;
  toggleLoading(cb?: () => void): void;
}

interface state {
  files: IFile[];
}

export function TransactionRow({
  txn,
  departmentView,
  enter,
  accept,
  reject,
  refresh,
  addJobNumber,
  toggleLoading,
  updateNotes,
}: props) {
  const [state, setState] = useState<state>({
    files: [],
  });
  const FileInput = React.createRef<HTMLInputElement>();

  const clients = {
    user: new UserClient(ENDPOINT),
    email: new EmailClient(ENDPOINT),
    docs: new TransactionDocumentClient(ENDPOINT),
    s3: new S3Client(ENDPOINT),
  };

  const handleFile = (e: any) => {
    const fr = new FileReader();
    fr.onload = async () => {
      try {
        await clients.docs.upload(
          txn.id,
          FileInput.current!.files![0].name,
          new Uint8Array(fr.result as ArrayBuffer),
        );
      } catch (err) {
        alert('File could not be uploaded');
        console.log(err);
      }

      await refresh();
      alert('Upload complete!');
      //toggleLoading(() => alert('Upload complete!'));
    };
    if (FileInput.current && FileInput.current.files) {
      fr.readAsArrayBuffer(FileInput.current.files[0]);
    }
  };

  const openFileInput = () => {
    FileInput.current && FileInput.current.click();
  };

  const updateStatus = async () => {
    const ok = confirm(
      `Are you sure you want to mark this transaction as ${
        departmentView ? 'accepted' : 'recorded'
      }?`,
    );
    if (ok) {
      const fn = departmentView ? accept : enter;
      await fn();
      await refresh();
    }
  };

  const dispute = async (reason: string) => {
    const userReq = new User();
    userReq.setId(txn.ownerId);
    const user = await clients.user.Get(userReq);
    const body = `Reason: ${reason}\r\nInfo: ${prettyMoney(txn.amount)} - ${
      txn.description
    } - ${
      txn.vendor
    }\r\nReview transactions here: https://app.kalosflorida.com?action=admin:reports.transactions`;
    const email: EmailConfig = {
      type: 'receipts',
      recipient: user.email,
      body,
    };

    try {
      await clients.email.sendMail(email);
    } catch (err) {
      alert('An error occurred, user was not notified via email');
    }
    try {
      const id = await getSlackID(txn.ownerName);
      await slackNotify(
        id,
        `A receipt you submitted has been rejected | ${
          txn.description
        } | $${prettyMoney(txn.amount)}. Reason: ${reason}`,
      );
      await slackNotify(
        id,
        `https://app.kalosflorida.com?action=admin:reports.transactions`,
      );
    } catch (err) {
      console.log(err);
      alert('An error occurred, user was not notified via slack');
    }

    await reject(reason);
    await refresh();
  };

  const amount = prettyMoney(txn.amount);
  return (
    <>
      <TableRow hover>
        <TableCell align="center">
          {new Date(txn.timestamp.split(' ').join('T')).toLocaleDateString()}
        </TableCell>
        <TableCell align="center">
          {`${txn.ownerName} (${txn.cardUsed})` || ''}
        </TableCell>
        <TableCell align="center">
          {txn.costCenter
            ? `${txn.costCenter.description} (${txn.costCenter.id})`
            : ''}
        </TableCell>
        <TableCell align="center">
          {txn.department
            ? `${txn.department.description} (${txn.department.classification})`
            : ''}
        </TableCell>
        <TableCell align="center">{txn.jobId}</TableCell>
        <TableCell align="center">${amount}</TableCell>
        <TableCell align="center">
          {txn.description} / {txn.vendor}
        </TableCell>
        <TableCell align="right">
          <Tooltip title="Copy data to clipboard" placement="top">
            <IconButton
              onClick={() =>
                copyToClipboard(
                  `${new Date(
                    txn.timestamp.split(' ').join('T'),
                  ).toLocaleDateString()},${txn.description},${amount},${
                    txn.ownerName
                  },${txn.vendor}`,
                )
              }
            >
              <CopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Upload File" placement="top">
            <IconButton onClick={openFileInput}>
              <UploadIcon />
            </IconButton>
          </Tooltip>
          <Prompt
            confirmFn={addJobNumber}
            text="Update Job Number"
            prompt="New Job Number: "
            Icon={KeyboardIcon}
          />
          <Prompt
            confirmFn={updateNotes}
            text="Edit Notes"
            prompt="Update Txn Notes: "
            Icon={NotesIcon}
            defaultValue={txn.notes}
            multiline
          />
          <PopoverGallery
            title="Receipt Photos"
            fileList={state.files}
            text="View receipt photos"
            //@ts-ignore
            onOpen={() => fetchFiles(txn, setState, clients.s3.getMimeType)}
            disabled={txn.documentsList.length === 0}
            iconButton
          />
          <TxnLog iconButton txnID={txn.id} />
          <TxnNotes
            iconButton
            text="View notes"
            notes={txn.notes}
            disabled={txn.notes === ''}
          />
          <Tooltip
            title={departmentView ? 'Mark as accepted' : 'Mark as entered'}
            placement="top"
          >
            <IconButton onClick={updateStatus}>
              <SubmitIcon />
            </IconButton>
          </Tooltip>
          <Prompt
            confirmFn={dispute}
            text="Reject transaction"
            prompt="Enter reason for rejection: "
            Icon={RejectIcon}
          />
        </TableCell>
        <TableCell style={{ display: 'none' }}>
          <input
            type="file"
            ref={FileInput}
            onChange={handleFile}
            style={{ display: 'none' }}
          />
        </TableCell>
      </TableRow>
    </>
  );
}

async function fetchFiles(
  txn: Transaction.AsObject,
  setState: (state: state) => void,
  getMimeType: (str: string) => string,
) {
  const filesList = txn.documentsList
    .filter(d => d.reference)
    .map(d => {
      const arr = d.reference.split('.');
      const mimeTypeStr = arr[arr.length - 1];
      return {
        name: d.reference,
        mimeType: getMimeType(mimeTypeStr),
        data: '',
      };
    });

  const promiseArr = txn.documentsList.filter(d => d.reference).map(fetchFile);

  const fileObjects = await Promise.all(promiseArr);
  const files = filesList.map(f => {
    const fileObj = fileObjects.find(
      obj => obj.key.replace(`${txn.id}-`, '') === f.name,
    );
    if (fileObj) {
      f.data = fileObj.data as string;
    }
    return f;
  });

  setState({
    files,
  });
}

function fetchFile(doc: TransactionDocument.AsObject) {
  const s3 = new S3Client(ENDPOINT);
  const fileObj = new FileObject();
  fileObj.setBucket('kalos-transactions');
  fileObj.setKey(`${doc.transactionId}-${doc.reference}`);
  return s3.Get(fileObj);
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
