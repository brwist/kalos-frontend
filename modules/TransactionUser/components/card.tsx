import * as React from 'react';
import debounce from 'lodash/debounce';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import {
  Transaction,
  TransactionClient,
} from '@kalos-core/kalos-rpc/Transaction';
import {
  TransactionDocumentClient,
  TransactionDocument,
} from '@kalos-core/kalos-rpc/TransactionDocument';
import {
  TransactionActivity,
  TransactionActivityClient,
} from '@kalos-core/kalos-rpc/TransactionActivity';
import { AccountPicker } from '../../Pickers';
import { TransactionAccount } from '@kalos-core/kalos-rpc/TransactionAccount';
import { S3Client } from '@kalos-core/kalos-rpc/S3File';
import { GalleryData, AltGallery } from '../../AltGallery/main';
import { Event, EventClient } from '@kalos-core/kalos-rpc/Event';
import { TaskClient } from '@kalos-core/kalos-rpc/Task';
import CloseIcon from '@material-ui/icons/CloseSharp';
import { PDFMaker } from '../../ComponentsLibrary/PDFMaker';
import ReIcon from '@material-ui/icons/RefreshSharp';
import {
  timestamp,
  FileType,
  upsertFile,
  upsertTransactionDocument,
} from '../../../helpers';
import { ENDPOINT } from '../../../constants';
import { EmailClient, EmailConfig } from '@kalos-core/kalos-rpc/Email';
import { Field } from '../../ComponentsLibrary/Field';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Button } from '../../ComponentsLibrary/Button';
import { NoteField } from './NoteField';
import { FileGallery } from '../../ComponentsLibrary/FileGallery';
import { Modal } from '../../ComponentsLibrary/Modal';
import './card.css';

interface props {
  txn: Transaction.AsObject;
  userDepartmentID: number;
  userName: string;
  userID: number;
  isAdmin?: boolean;
  isManager?: boolean;
  fetchFn(): void;
  toggleLoading(cb?: () => void): Promise<void>;
}

interface state {
  txn: Transaction.AsObject;
  pendingAddFromGallery: boolean;
}

const hardcodedList = [
  601002,
  674002,
  674001,
  673002,
  601001,
  51500,
  68500,
  62600,
  643002,
];

export class TxnCard extends React.PureComponent<props, state> {
  TxnClient: TransactionClient;
  DocsClient: TransactionDocumentClient;
  LogClient: TransactionActivityClient;
  TaskClient: TaskClient;
  EventClient: EventClient;
  S3Client: S3Client;
  FileInput: React.RefObject<HTMLInputElement>;
  NotesInput: React.RefObject<HTMLInputElement>;
  EmailClient: EmailClient;

  constructor(props: props) {
    super(props);
    this.state = {
      txn: props.txn,
      pendingAddFromGallery: false,
    };
    this.EmailClient = new EmailClient(ENDPOINT);
    this.TxnClient = new TransactionClient(ENDPOINT);
    this.DocsClient = new TransactionDocumentClient(ENDPOINT);
    this.LogClient = new TransactionActivityClient(ENDPOINT);
    this.S3Client = new S3Client(ENDPOINT);
    this.EventClient = new EventClient(ENDPOINT);
    this.TaskClient = new TaskClient(ENDPOINT);
    this.FileInput = React.createRef();
    this.NotesInput = React.createRef();
    this.openFilePrompt = this.openFilePrompt.bind(this);
    this.updateTransaction = this.updateTransaction.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.submit = this.submit.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.onPDFGenerate = this.onPDFGenerate.bind(this);
  }

  async makeLog<K extends keyof Transaction.AsObject>(
    prop: K,
    oldValue: Transaction.AsObject[K],
    newValue: Transaction.AsObject[K],
  ) {
    try {
      const log = new TransactionActivity();
      const { userID, userName } = this.props;
      log.setDescription(
        `User ${userName} updated txn ${prop}: ${oldValue} changed to ${newValue} `,
      );
      log.setUserId(userID);
      await this.LogClient.Create(log);
    } catch (err) {
      console.log(err);
    }
  }

  updateTransaction<K extends keyof Transaction.AsObject>(prop: K) {
    return async (value: Transaction.AsObject[K]) => {
      try {
        const reqObj = new Transaction();
        const upperCaseProp = `${prop[0].toLocaleUpperCase()}${prop.slice(1)}`;
        const methodName = `set${upperCaseProp}`;
        const oldValue = this.state.txn[prop];
        reqObj.setId(this.state.txn.id);
        //@ts-ignore
        reqObj[methodName](value);
        reqObj.setFieldMaskList([upperCaseProp]);
        const updatedTxn = await this.TxnClient.Update(reqObj);
        this.setState(() => ({ txn: updatedTxn }));
        if (prop !== 'notes') {
          await this.makeLog(prop, oldValue, value);
        }
      } catch (err) {
        console.log(err);
      }
    };
  }
  updateNotes = (val: React.ReactText) =>
    this.updateTransaction('notes')(val.toString());
  updateVendor = this.updateTransaction('vendor');
  updateCostCenterID = this.updateTransaction('costCenterId');
  updateDepartmentID = this.updateTransaction('departmentId');
  updateStatus = this.updateTransaction('statusId');
  handleJobNumber = this.updateTransaction('jobId');

  async submit() {
    const { txn } = this.state;
    try {
      const ok = confirm(
        'Are you sure you want to submit this transaction? You will be unable to edit it again unless it is rejected, so please make sure all information is correct',
      );
      if (ok) {
        if (txn.jobId !== 0) {
          try {
            const job = new Event();
            job.setId(txn.jobId);
            //const res = await this.EventClient.Get(job);
            //console.log(res);
            //if (!res || res.id === 0) {
            //throw 'The entered job number is invalid';
            //}
          } catch (err) {
            console.log(err);
          }
        }
        if (!txn.costCenter) {
          throw 'A purchase category must be assigned';
        } else if (txn.notes === '') {
          throw 'Please provide a brief description in the notes';
        } else {
          try {
            const d = new TransactionDocument();
            d.setTransactionId(this.state.txn.id);
            const res = await this.DocsClient.Get(d);
          } catch (err) {
            throw 'Please attach a photo to this receipt before submitting';
          }
          let statusID = this.props.isManager ? 3 : 2;
          let statusMessage = this.props.isManager
            ? 'manager receipt accepted automatically'
            : 'submitted for approval';
          if (
            txn.costCenterId === 2 ||
            txn.costCenter?.id === 2 ||
            txn.costCenterId === 1 ||
            txn.costCenter?.id === 1
          ) {
            statusID = 3;
            statusMessage =
              'receipt marked as accidental or fraudulent and sent directly to accounting for review';
            const mailBody = `A${getTransactionTypeString(
              txn,
            )} transaction has been reported by ${txn.ownerName} (${
              txn.cardUsed
            }).
              Amount $${txn.amount} Vendor: ${txn.vendor} Post date: ${
              txn.timestamp
            }
              Department: ${txn.department?.classification} ${
              txn.department?.description
            }
              ${txn.notes != '' ? `Notes: ${txn.notes}` : ''}
              https://app.kalosflorida.com/index.cfm?action=admin:reports.transactions
            `;
            const mailConfig: EmailConfig = {
              type: 'receipts',
              recipient: 'accounts@kalosflorida.com',
              body: mailBody,
            };
            await this.EmailClient.sendMail(mailConfig);
          }
          await this.updateStatus(statusID);
          await this.makeSubmitLog(statusID, statusMessage);
          if (txn.costCenterId === 673002 || txn.costCenter.id === 673002) {
            await this.TaskClient.newToolPurchase(
              txn.amount,
              txn.ownerId,
              txn.vendor,
              txn.notes,
              txn.timestamp,
            );
          }
          console.log('submitted');
          await this.props.fetchFn();
        }
      }
    } catch (err) {
      alert(err);
    }
  }

  async makeSubmitLog(status: number, action: string) {
    const log = new TransactionActivity();
    log.setUserId(this.props.userID);
    log.setTransactionId(this.state.txn.id);
    log.setStatusId(status);
    log.setDescription(action);
    await this.LogClient.Create(log);
  }

  testCostCenter(acc: TransactionAccount.AsObject) {
    return hardcodedList.includes(acc.id);
  }

  toggleAddFromGallery = () =>
    this.setState({ pendingAddFromGallery: !this.state.pendingAddFromGallery });

  addFromGallery = async ({ file, url }: { file: FileType; url: string }) => {
    this.setState({ pendingAddFromGallery: false });
    await upsertFile({ id: file.id, ownerId: 0 });
    await upsertTransactionDocument({
      transactionId: this.state.txn.id,
      reference: file.name,
      fileId: file.id,
      typeId: 1,
    });
    alert('Upload complete');
  };

  deriveCallout(
    txn: Transaction.AsObject,
  ): { severity: 'error' | 'success'; text: string } {
    if (!txn.costCenter || txn.costCenter.id === 0)
      return {
        severity: 'error',
        text: 'Please select a purchase category',
      };
    if (txn.costCenterId === 601002 && txn.notes === '')
      return {
        severity: 'error',
        text: 'Fuel purchases must include mileage and gallons in the notes',
      };
    if (txn.notes === '')
      return {
        severity: 'error',
        text: 'Purchases should include a brief description in the notes',
      };
    return {
      severity: 'success',
      text: 'This transaction is ready for submission',
    };
  }

  openFilePrompt() {
    this.FileInput.current && this.FileInput.current.click();
  }

  async onPDFGenerate(fileData: Uint8Array) {
    await this.props.toggleLoading();
    await this.DocsClient.upload(
      this.state.txn.id,
      `${timestamp()}-generated.pdf`,
      fileData,
    );
    await this.refresh();
    await this.props.toggleLoading(() =>
      alert(
        'A PDF has been generated and uploaded for you, it is recommended you review this document before proceeding',
      ),
    );
  }

  handleFile() {
    this.props.toggleLoading(() => {
      const fr = new FileReader();
      fr.onload = async () => {
        try {
          await this.DocsClient.upload(
            this.state.txn.id,
            this.FileInput.current!.files![0].name,
            new Uint8Array(fr.result as ArrayBuffer),
          );
        } catch (err) {
          alert('File could not be uploaded');
          console.log(err);
        }
        await this.refresh();
        this.props.toggleLoading(() => alert('Upload complete'));
      };
      if (this.FileInput.current && this.FileInput.current.files) {
        fr.readAsArrayBuffer(this.FileInput.current.files[0]);
      }
    });
  }

  async refresh() {
    try {
      const req = new Transaction();
      req.setId(this.state.txn.id);
      const refreshTxn = await this.TxnClient.Get(req);
      this.setState({
        txn: refreshTxn,
      });
    } catch (err) {
      alert(
        'Network error, displayed information may be incorrect. Refresh is advised',
      );
      console.log(err);
    }
  }

  async deleteFile(name: string, bucket: string, cb?: () => void) {
    try {
      await this.DocsClient.deleteByName(name, bucket);
      if (cb) {
        cb();
      }
      await this.refresh();
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    if (this.state.txn.departmentId === 0) {
      this.updateDepartmentID(this.props.userDepartmentID);
    }
  }

  render() {
    const { txn, pendingAddFromGallery } = this.state;
    const t = txn;
    const { isManager, userID } = this.props;
    let subheader = `${t.description.split(' ')[0]} - ${t.vendor}`;
    const deriveCallout = this.deriveCallout(t);
    return (
      <>
        <Paper elevation={4} style={{ margin: 16, marginTop: 32 }}>
          <SectionBar
            title={`${new Date(
              t.timestamp.split(' ').join('T'),
            ).toDateString()} - $${t.amount}`}
            subtitle={subheader}
            asideContent={
              <div className="TransactionUser_Actions">
                <Button label="Upload Photo" onClick={this.openFilePrompt} />
                {/* // TODO finish https://github.com/rmilejcz/kalos-frontend/issues/38
                <Button
                  label="Add Photo "
                  onClick={this.toggleAddFromGallery}
                /> */}
                <AltGallery
                  title="Receipt Photo(s)"
                  text="View Photo(s)"
                  fileList={getGalleryData(this.state.txn)}
                  transactionID={this.state.txn.id}
                  canDelete
                />
                <Button label="Submit" onClick={this.submit} />
                <PDFMaker
                  dateStr={t.timestamp}
                  name={t.ownerName}
                  title="Missing"
                  icon={<CloseIcon />}
                  amount={t.amount}
                  onCreate={this.onPDFGenerate}
                  jobNumber={`${t.jobId}`}
                  vendor={t.vendor}
                  pdfType="Missing Receipt"
                />
                {this.props.isManager && (
                  <PDFMaker
                    dateStr={t.timestamp}
                    name={t.ownerName}
                    icon={<ReIcon />}
                    title="Recurring"
                    amount={t.amount}
                    vendor={t.vendor}
                    jobNumber={`${t.jobId}`}
                    onCreate={this.onPDFGenerate}
                    pdfType="Retrievable Receipt"
                  />
                )}
              </div>
            }
            sticky={false}
          />
          <Alert severity={deriveCallout.severity}>{deriveCallout.text}</Alert>
          <div className="TransactionUser_Cards">
            <AccountPicker
              onSelect={this.updateCostCenterID}
              selected={t.costCenterId}
              sort={costCenterSortByPopularity}
              filter={
                !isManager ? a => ALLOWED_ACCOUNT_IDS.includes(a.id) : undefined
              }
              hideInactive
              renderItem={i => (
                <option value={i.id} key={`${i.id}-${i.description}`}>
                  {i.description} ({i.id})
                </option>
              )}
            />
            <Field
              name="department"
              value={t.departmentId || this.props.userDepartmentID}
              onChange={val => this.updateDepartmentID(+val)}
              type="department"
            />
            <Field
              name="jobNumber"
              label="Job Number"
              value={t.jobId}
              onChange={val => this.handleJobNumber(+val)}
              type="eventId"
              style={{
                alignItems: 'flex-start',
                flexGrow: 0,
              }}
            />
            <NoteField
              initialValue={t.notes}
              onChange={debounce(this.updateNotes, 500)}
            />
          </div>
          <input
            type="file"
            ref={this.FileInput}
            onChange={this.handleFile}
            style={{ display: 'none' }}
          />
        </Paper>
        {pendingAddFromGallery && (
          <Modal open onClose={this.toggleAddFromGallery} fullScreen>
            <FileGallery
              loggedUserId={userID}
              title="Add Receipt from Gallery"
              bucket="kalos-transactions"
              onClose={this.toggleAddFromGallery}
              onAdd={this.addFromGallery}
              removeFileOnAdd={false}
            />
          </Modal>
        )}
      </>
    );
  }
}

export function getMimeType(fileType: string) {
  if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg') {
    return `image/${fileType}`;
  } else if (fileType === 'pdf') {
    return `application/${fileType}`;
  } else {
    return fileType;
  }
}

function costCenterSortByPopularity(
  a: TransactionAccount.AsObject,
  b: TransactionAccount.AsObject,
) {
  return b.popularity - a.popularity;
}

const ALLOWED_ACCOUNT_IDS = [
  601002,
  673002,
  673001,
  51400,
  643002,
  643003,
  601001,
  51500,
  601004,
  1,
  68500,
  66600,
];

function getGalleryData(txn: Transaction.AsObject): GalleryData[] {
  return txn.documentsList.map(d => {
    return {
      key: `${txn.id}-${d.reference}`,
      bucket: 'kalos-transactions',
    };
  });
}

function getTransactionTypeString(txn: Transaction.AsObject) {
  if (txn.costCenterId === 2 || txn.costCenter?.id === 2) {
    return 'fraudulent';
  } else if (txn.costCenterId === 1 || txn.costCenter?.id === 1) {
    return 'n accidental';
  }
}
