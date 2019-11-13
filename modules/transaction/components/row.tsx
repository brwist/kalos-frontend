import React, { useState } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CopyIcon from '@material-ui/icons/FileCopySharp';
import { IFile } from '../../Gallery/main';
import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import { S3Client, FileObject } from '@kalos-core/kalos-rpc/S3File';
import { TransactionDocument } from '@kalos-core/kalos-rpc/TransactionDocument';
import { getMimeType } from './card';
import { Gallery } from '../../Gallery/main';

interface props {
  txn: Transaction.AsObject;
}

interface state {
  files: IFile[];
}

export function TransactionRow({ txn }: props) {
  const [state, setState] = useState<state>({
    files: [],
  });

  return (
    <TableRow hover>
      <TableCell>
        {new Date(txn.timestamp.split(' ').join('T')).toLocaleDateString()}
      </TableCell>
      <TableCell>{txn.ownerName || 'Not Assigned'}</TableCell>
      <TableCell>
        {txn.costCenter ? txn.costCenter.description : 'Not Assigned'}
      </TableCell>
      <TableCell>
        {txn.department ? txn.department.description : 'Not Assigned'}
      </TableCell>
      <TableCell>{prettyMoney(txn.amount)}</TableCell>
      <TableCell>{txn.description}</TableCell>
      <TableCell>{txn.notes}</TableCell>
      <TableCell>
        <Tooltip title="Copy data to clipboard" placement="top">
          <IconButton
            onClick={() =>
              copyToClipboard(
                `${new Date(
                  txn.timestamp.split(' ').join('T'),
                ).toLocaleDateString()},${txn.description},${txn.amount}`,
              )
            }
          >
            <CopyIcon />
          </IconButton>
        </Tooltip>
        {txn.documentsList.length !== 0 && (
          <Gallery
            title="Receipt Photos"
            fileList={state.files}
            text="View receipt photos"
            onOpen={() => fetchFiles(txn, setState)}
            iconButton
          />
        )}
      </TableCell>
    </TableRow>
  );
}

async function fetchFiles(
  txn: Transaction.AsObject,
  setState: (state: state) => void,
) {
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
  const files = filesList.map(f => {
    const fileObj = fileObjects.find(
      obj => obj.key.split(/\d{1,}-/)[1] === f.name,
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

function fetchFile(doc: TransactionDocument.AsObject, id: number) {
  const s3 = new S3Client('https://core-dev.kalosflorida.com:8443');
  const fileObj = new FileObject();
  fileObj.setBucket('kalos-transactions');
  fileObj.setKey(`${id}-${doc.reference}`);
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

function prettyMoney(amount: number): string {
  const [dollars, cents] = amount.toString().split('.');
  if (!cents) {
    return `$${dollars}.00`;
  } else if (cents.length === 1) {
    return `$${dollars}.${cents}0`;
  } else {
    return `$${dollars}.${cents}`;
  }
}
