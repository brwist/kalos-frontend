import React, { useState } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CopyIcon from '@material-ui/icons/FileCopySharp';
import SubmitIcon from '@material-ui/icons/ThumbUpSharp';
import { PopoverGallery } from '../../PopoverGallery/main';
import RejectIcon from '@material-ui/icons/ThumbDownSharp';
import { Prompt } from '../../Prompt/main';
import { IFile } from '../../Gallery/main';
import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import { S3Client, FileObject } from '@kalos-core/kalos-rpc/S3File';
import { TransactionDocument } from '@kalos-core/kalos-rpc/TransactionDocument';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { EmailClient, EmailConfig } from '@kalos-core/kalos-rpc/Email';
import { getMimeType } from './card';
import { TxnLog } from './log';
import { TxnNotes } from './notes';
import { getSlackID, slackNotify } from '../../../helpers';

interface props {
  txn: Transaction.AsObject;
  departmentView: boolean;
  enter(): Promise<void>;
  accept(): Promise<void>;
  reject(reason?: string): Promise<void>;
  refresh(): Promise<void>;
  addJobNumber(jn: string): Promise<void>;
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
}: props) {
  const endpoint = 'https://core-dev.kalosflorida.com:8443';
  const [state, setState] = useState<state>({
    files: [],
  });

  const clients = {
    user: new UserClient(endpoint),
    email: new EmailClient(endpoint),
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
    try {
      const id = await getSlackID(txn.ownerName);
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
      await clients.email.sendMail(email);
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
      alert('An error occurred, user was not notified');
    }

    await reject(reason);
    await refresh();
  };

  const amount = prettyMoney(txn.amount);
  return (
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
      <TableCell align="center">
        {txn.jobId !== 0 ? (
          txn.jobId
        ) : (
          <Prompt
            confirmFn={addJobNumber}
            text="Update Job Number"
            prompt="Job Number: "
          />
        )}
      </TableCell>
      <TableCell align="center">${amount}</TableCell>
      <TableCell align="center">{txn.description}</TableCell>
      <TableCell align="right">
        <Tooltip title="Copy data to clipboard" placement="top">
          <IconButton
            onClick={() =>
              copyToClipboard(
                `${new Date(
                  txn.timestamp.split(' ').join('T'),
                ).toLocaleDateString()},${txn.description},${amount}`,
              )
            }
          >
            <CopyIcon />
          </IconButton>
        </Tooltip>
        <PopoverGallery
          title="Receipt Photos"
          fileList={state.files}
          text="View receipt photos"
          onOpen={() => fetchFiles(txn, setState)}
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
    </TableRow>
  );
}

async function fetchFiles(
  txn: Transaction.AsObject,
  setState: (state: state) => void,
) {
  console.log('doc list: ', txn.documentsList);
  const filesList = txn.documentsList
    .filter(d => d.reference)
    .map(d => {
      return {
        name: d.reference,
        mimeType: getMimeType(d.reference.split('.')[1]),
        data: '',
      };
    });

  const promiseArr = txn.documentsList.filter(d => d.reference).map(fetchFile);

  const fileObjects = await Promise.all(promiseArr);
  console.log('Files from S3:', fileObjects);
  const files = filesList.map(f => {
    console.log('File in list:', f);
    console.log(fileObjects);
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
  const s3 = new S3Client('https://core-dev.kalosflorida.com:8443');
  const fileObj = new FileObject();
  fileObj.setBucket('kalos-transactions');
  console.log(`${doc.transactionId}-${doc.reference}`);
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
