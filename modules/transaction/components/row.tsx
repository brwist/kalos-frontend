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
import { PopoverComponent } from '../../ComponentsLibrary/Popover';
import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import { S3Client } from '@kalos-core/kalos-rpc/S3File';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { TransactionDocumentClient } from '@kalos-core/kalos-rpc/TransactionDocument';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { EmailClient, EmailConfig } from '@kalos-core/kalos-rpc/Email';
import { TxnLog } from './log';
import { TxnNotes } from './notes';
import { getSlackID, slackNotify, EventClientService } from '../../../helpers';
import { ENDPOINT } from '../../../constants';
import { AccountPicker } from '../../ComponentsLibrary/Pickers/index';
import { AltGallery, GalleryData } from '../../AltGallery/main';
import { Row } from '../../ComponentsLibrary/InfoTable';
import { Tooltip } from '../../ComponentsLibrary/Tooltip';
import { parseISO } from 'date-fns';
import { EventClient } from '@kalos-core/kalos-rpc/Event';

interface props {
  txn: Transaction;
  departmentView: boolean;
  acceptOverride: boolean;
  userID: number;
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
  editingCostCenter: boolean;
  toggleEditingCostCenter(): void;
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
  acceptOverride,
  updateCostCenter,
  //jobInfo,
  userID,
  editingCostCenter,
  toggleEditingCostCenter,
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
          'Customer' +
          (res.getCustomer() === undefined
            ? 'No Customer: '
            : `${res
                .getCustomer()!
                .getFirstname()} ${res.getCustomer()!.getLastname()}`);
        const property =
          'Property: ' +
          (res.getProperty() === undefined
            ? 'No Property'
            : `${res
                .getProperty()!
                .getAddress()} ${res.getProperty()!.getCity()}`);
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
      value: editingCostCenter ? (
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
        `${txn
          .getCostCenter()!
          .getDescription()} (${txn.getCostCenter()!.getId()})`
      ) : (
        ''
      ),
      actions: [
        <IconButton key="edit" size="small" onClick={toggleEditingCostCenter}>
          {editingCostCenter ? <CloseIcon /> : <EditIcon />}
        </IconButton>,
      ],
    },
    {
      value: txn.getDepartment()
        ? `${txn
            .getDepartment()!
            .getDescription()} (${txn.getDepartment()!.getClassification()})`
        : '',
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
      value: `$ ${amount}`,
    },
    {
      value: txn.getVendor(),
    },
    {
      value: '',
      actions: [
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
        <AltGallery
          key="receiptPhotos"
          title="Transaction Photos"
          fileList={getGalleryData(txn)}
          transactionID={txn.getId()}
          text="View photos"
          iconButton
        />,
        <TxnLog key="txnLog" iconButton txnID={txn.getId()} />,
        <TxnNotes
          key="viewNotes"
          iconButton
          text="View notes"
          notes={txn.getNotes()}
          disabled={txn.getNotes() === ''}
        />,
        ...([9928, 9646, 1734].includes(userID)
          ? [
              <Tooltip
                key="audit"
                content={
                  txn.getIsAudited() && userID !== 1734
                    ? 'This transaction has already been audited'
                    : 'Mark as correct'
                }
              >
                <IconButton
                  size="small"
                  onClick={userID === 1734 ? forceAccept : auditTxn}
                  disabled={txn.getIsAudited() && userID !== 1734}
                >
                  <CheckIcon />
                </IconButton>
              </Tooltip>,
            ]
          : []),
        <Tooltip
          key="submit"
          content={acceptOverride ? 'Mark as accepted' : 'Mark as entered'}
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
      ],
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
