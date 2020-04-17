import React, { useState } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CopyIcon from '@material-ui/icons/FileCopySharp';
import SubmitIcon from '@material-ui/icons/ThumbUpSharp';
import { Gallery } from '../../Gallery/main';
import RejectIcon from '@material-ui/icons/ThumbDownSharp';
import KeyboardIcon from '@material-ui/icons/KeyboardSharp';
import UploadIcon from '@material-ui/icons/CloudUploadSharp';
import NotesIcon from '@material-ui/icons/EditSharp';
import CheckIcon from '@material-ui/icons/CheckCircleSharp';
import Button from '@material-ui/core/Button';
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
import { CostCenterPicker } from '../../Pickers/CostCenter';

interface props {
  txn: Transaction.AsObject;
  departmentView: boolean;
  acceptOverride: boolean;
  enter(): Promise<void>;
  audit(): Promise<void>;
  accept(): Promise<void>;
  reject(reason?: string): Promise<void>;
  refresh(): Promise<void>;
  addJobNumber(jn: string): Promise<void>;
  updateNotes(notes: string): Promise<void>;
  updateCostCenter(id: number): Promise<void>;
  updateDepartment(id: number): Promise<void>;
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
  audit,
  addJobNumber,
  updateNotes,
  acceptOverride,
  updateCostCenter,
}: props) {
  console.log('will accept', acceptOverride);
  const [state, setState] = useState<state>({
    files: [],
  });
  const [isEditingCostCenter, setIsEditingCostCenter] = useState(false);

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
        const u8 = new Uint8Array(fr.result as ArrayBuffer);
        await clients.docs.upload(
          txn.id,
          FileInput.current!.files![0].name,
          u8,
        );
      } catch (err) {
        alert('File could not be uploaded');
        console.log(err);
      }

      await refresh();
      alert('Upload complete!');
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
        acceptOverride ? 'accepted' : 'recorded'
      }?`,
    );
    if (ok) {
      const fn = acceptOverride ? accept : enter;
      await fn();
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

  const handleCostCenterSelect = async (id: number) => {
    await updateCostCenter(id);
    setIsEditingCostCenter(false);
  };

  const amount = prettyMoney(txn.amount);
  console.log(departmentView, 'is department');
  return (
    <>
      <TableRow hover>
        <TableCell align="center" style={{ padding: 4 }}>
          {new Date(txn.timestamp.split(' ').join('T')).toLocaleDateString()}
        </TableCell>
        <TableCell align="center" style={{ padding: 4 }}>
          {`${txn.ownerName} (${txn.cardUsed})` || ''}
        </TableCell>
        <TableCell align="center" style={{ padding: 4 }}>
          {isEditingCostCenter && (
            <CostCenterPicker
              selected={txn.costCenter ? txn.costCenter.id : 0}
              onSelect={handleCostCenterSelect}
              hideInactive
            />
          )}
          {!isEditingCostCenter && (
            <Button onClick={() => setIsEditingCostCenter(true)}>
              {txn.costCenter
                ? `${txn.costCenter.description} (${txn.costCenter.id})`
                : ''}
            </Button>
          )}
        </TableCell>
        <TableCell align="center" style={{ padding: 4 }}>
          {txn.department
            ? `${txn.department.description} (${txn.department.classification})`
            : ''}
        </TableCell>
        <TableCell align="center" style={{ padding: 4 }}>
          {txn.jobId}
        </TableCell>
        <TableCell align="center" style={{ padding: 4 }}>
          ${amount}
        </TableCell>
        <TableCell align="center" style={{ padding: 4 }}>
          {txn.vendor}
        </TableCell>
        <TableCell align="right" colSpan={2} style={{ padding: 4 }}>
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
          <Gallery
            title="Receipt Photos"
            fileList={state.files}
            text="View receipt photos"
            //@ts-ignore
            onOpen={() => fetchFiles(txn, setState, clients.s3.getMimeType)}
            disabled={txn.documentsList.length === 0}
            iconButton
          />
          {/*<PopoverGallery
            title="Receipt Photos"
            fileList={state.files}
            text="View receipt photos"
            //@ts-ignore
            onOpen={() => fetchFiles(txn, setState, clients.s3.getMimeType)}
            disabled={txn.documentsList.length === 0}
            iconButton
          />*/}
          <TxnLog iconButton txnID={txn.id} />
          <TxnNotes
            iconButton
            text="View notes"
            notes={txn.notes}
            disabled={txn.notes === ''}
          />
          {!departmentView && !txn.isAudited && (
            <Tooltip title={'Mark as correct'} placement="top">
              <IconButton onClick={auditTxn}>
                <CheckIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip
            title={acceptOverride ? 'Mark as accepted' : 'Mark as entered'}
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
    .filter((d) => d.reference)
    .map((d) => {
      const arr = d.reference.split('.');
      const mimeTypeStr = arr[arr.length - 1];
      return {
        name: d.reference,
        mimeType: getMimeType(mimeTypeStr),
        data: new Uint8Array(0),
      };
    });

  const docsArr = txn.documentsList.filter((d) => d.reference).map(downloadDoc);
  const docObjects = await Promise.all(docsArr);

  const files = filesList.map((f) => {
    const docObj = docObjects.find(
      (obj) => obj.getKey().replace(`${txn.id}-`, '') === f.name,
    );
    if (docObj) {
      f.data = docObj.getData() as Uint8Array;
    }
    return f;
  });

  setState({
    files,
  });
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

async function downloadDoc(doc: TransactionDocument.AsObject) {
  const docClient = new TransactionDocumentClient(ENDPOINT);
  return await docClient.download(doc.transactionId, doc.reference);
}
