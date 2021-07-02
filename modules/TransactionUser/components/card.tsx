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
import { AccountPicker } from '../../ComponentsLibrary/Pickers';
import {
  TransactionAccount,
  TransactionAccountClient,
  TransactionAccountList,
} from '@kalos-core/kalos-rpc/TransactionAccount';
import { S3Client } from '@kalos-core/kalos-rpc/S3File';
import { GalleryData, AltGallery } from '../../AltGallery/main';
import { Event, EventClient } from '@kalos-core/kalos-rpc/Event';
import { TaskClient } from '@kalos-core/kalos-rpc/Task';
import CloseIcon from '@material-ui/icons/CloseSharp';
import { PDFMaker } from '../../ComponentsLibrary/PDFMaker';
import ReIcon from '@material-ui/icons/RefreshSharp';
import {
  timestamp,
  S3ClientService,
  getFileExt,
  FileClientService,
  TransactionDocumentClientService,
} from '../../../helpers';
import { File } from '@kalos-core/kalos-rpc/File';
import { ENDPOINT } from '../../../constants';
import { EmailClient, EmailConfig } from '@kalos-core/kalos-rpc/Email';
import { Field } from '../../ComponentsLibrary/Field';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Button } from '../../ComponentsLibrary/Button';
import { NoteField } from './NoteField';
import { FileGallery } from '../../ComponentsLibrary/FileGallery';
import { Modal } from '../../ComponentsLibrary/Modal';
import './card.css';
import { parseISO } from 'date-fns';

interface props {
  txn: Transaction;
  userDepartmentID: number;
  userName: string;
  userID: number;
  isAdmin?: boolean;
  isManager?: boolean;
  fetchFn(): void;
  toggleLoading(cb?: () => void): Promise<void>;
  loggedUserId: number;
}

interface state {
  txn: Transaction;
  pendingAddFromGallery: boolean;
  pendingAddFromSingleFile: boolean;
  costCenters: TransactionAccountList;
}

const hardcodedList = [
  1, 2, 601002, 674002, 674001, 673002, 61700, 681001, 601001, 51500, 68500,
  62600, 643002,
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
  LastSingleFileUpload: {
    filename: string;
    fileurl: string;
    filedata: Uint8Array;
  } | null;

  constructor(props: props) {
    super(props);
    this.state = {
      txn: props.txn,
      pendingAddFromGallery: false,
      pendingAddFromSingleFile: false,
      costCenters: new TransactionAccountList(),
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
    this.LastSingleFileUpload = null; // Will be set when user uploads an image
  }

  async makeLog<K extends keyof Transaction>(
    prop: K,
    oldValue: Transaction[K],
    newValue: Transaction[K],
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

  updateTransaction<K extends keyof Transaction>(prop: K) {
    return async (value: Transaction[K]) => {
      try {
        const reqObj = new Transaction();
        const fieldMaskItem = `${prop.slice(2)}`;
        const methodName = `${prop}`;
        const fetchMethod = `g${prop.substring(1, prop.length)}`;
        //@ts-ignore
        const oldValue = this.state.txn[fetchMethod]();
        reqObj.setId(this.state.txn.getId());
        //@ts-ignore
        reqObj[methodName](value);
        reqObj.setFieldMaskList([fieldMaskItem]);
        const updatedTxn = await this.TxnClient.Update(reqObj);
        this.setState(() => ({ txn: updatedTxn }));
        if (prop !== 'setNotes') {
          await this.makeLog(prop, oldValue, value);
        }
      } catch (err) {
        console.log(err);
      }
    };
  } //These functions both serve to update the individual fields of the record, and change
  //the state value for the entity in React
  updateNotes = (val: React.ReactText) =>
    this.state.txn.setNotes(val.toString());
  updateVendor = this.updateTransaction('setVendor');
  updateCostCenterID = this.updateTransaction('setCostCenterId');
  updateDepartmentID = this.updateTransaction('setDepartmentId');
  updateStatus = this.updateTransaction('setStatusId');
  updateJobNumber = this.updateTransaction('setJobId');
  handleUpdateCostCenterId() {}
  async submit() {
    const { txn } = this.state;
    try {
      const ok = confirm(
        'Are you sure you want to submit this transaction? You will be unable to edit it again unless it is rejected, so please make sure all information is correct',
      );
      if (ok) {
        if (txn.getJobId() !== 0) {
          try {
            const job = new Event();
            job.setId(txn.getJobId());
            //const res = await this.EventClient.Get(job);
            //console.log(res);
            //if (!res || res.id === 0) {
            //throw 'The entered job number is invalid';
            //}
          } catch (err) {
            console.log(err);
          }
        }
        if (!txn.getCostCenter()) {
          throw 'A purchase category must be assigned';
        } else if (txn.getNotes() === '') {
          throw 'Please provide a brief description in the notes';
        } else {
          try {
            const d = new TransactionDocument();
            d.setTransactionId(this.state.txn.getId());
            // const res = await this.DocsClient.Get(d);
          } catch (err) {
            throw 'Please attach a photo to this receipt before submitting';
          }
          let statusID = this.props.isManager ? 3 : 2;
          let statusMessage = this.props.isManager
            ? 'manager receipt accepted automatically'
            : 'submitted for approval';
          if (
            txn.getCostCenterId() === 2 ||
            txn.getCostCenter()?.getId() === 2 ||
            txn.getCostCenterId() === 1 ||
            txn.getCostCenter()?.getId() === 1
          ) {
            statusID = 3;
            statusMessage =
              'receipt marked as accidental or fraudulent and sent directly to accounting for review';
            const mailBody = `<html><body><p>A${getTransactionTypeString(
              txn,
            )} transaction has been reported by ${txn.getOwnerName()} (${txn.getCardUsed()}).
              Amount $${txn.getAmount()} Vendor: ${txn.getVendor()} Post date: ${txn.getTimestamp()}
              Department: ${txn.getDepartment()?.getClassification()} ${txn
              .getDepartment()
              ?.getDescription()}
              ${txn.getNotes() != '' ? `Notes: ${txn.getNotes()}` : ''}</p>
              <a href="https://app.kalosflorida.com/index.cfm?action=admin:reports.transactions">Click here to view receipts</a>
              </body></html>
            `;
            //@ts-ignore
            //TODO : Fix email type config definition
            const mailConfig: EmailConfig = {
              type: 'receipts',
              recipient: 'accounts@kalosflorida.com',
              body: mailBody,
              subject: 'Receipts',
            };
            try {
              await this.EmailClient.sendMail(mailConfig);
            } catch (err) {
              console.log('failed to send mail to accounting', err);
            }
          }
          this.state.txn.setStatusId(statusID);
          await this.updateStatus(this.state.txn.getStatusId);
          await this.makeSubmitLog(statusID, statusMessage);
          if (
            txn.getCostCenterId() === 673002 ||
            txn.getCostCenter()?.getId() === 673002
          ) {
            await this.TaskClient.newToolPurchase(
              txn.getAmount(),
              txn.getOwnerId(),
              txn.getVendor(),
              txn.getNotes(),
              txn.getTimestamp(),
            );
          }
          await this.props.fetchFn();
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async makeSubmitLog(status: number, action: string) {
    const log = new TransactionActivity();
    log.setUserId(this.props.userID);
    log.setTransactionId(this.state.txn.getId());
    log.setStatusId(status);
    log.setDescription(action);
    await this.LogClient.Create(log);
  }

  testCostCenter(acc: TransactionAccount) {
    return hardcodedList.includes(acc.getId());
  }

  toggleAddFromGallery = () =>
    this.setState({ pendingAddFromGallery: !this.state.pendingAddFromGallery });

  toggleAddFromSingleFile = () =>
    this.setState({
      pendingAddFromSingleFile: !this.state.pendingAddFromSingleFile,
    });

  addFromSingleFile = async ({ file }: { file: File; url: string }) => {
    this.setState({ pendingAddFromSingleFile: false });
    const id = this.state.txn.getId();
    const bucket = 'kalos-transactions';
    const status = await S3ClientService.moveFileBetweenS3Buckets(
      {
        key: file.getName(),
        bucket: file.getBucket(),
      },
      {
        key: `${id}-${file.getName()}`,
        bucket,
      },
    );
    if (status === 'nok') {
      alert(
        'Upload failed. Please try again, or contact an administrator if you keep experiencing issues.',
      );
      return;
    }
    const fileReq = new File();
    fileReq.setId(file.getId());
    fileReq.setBucket(bucket);
    fileReq.setOwnerId(0);
    await FileClientService.upsertFile(fileReq);
    const txnDocReq = new TransactionDocument();
    txnDocReq.setTransactionId(this.state.txn.getId());
    txnDocReq.setReference(file.getName());
    txnDocReq.setFileId(file.getId());
    txnDocReq.setTypeId(1);
    await TransactionDocumentClientService.upsertTransactionDocument(txnDocReq);
    alert('Upload complete');
  };

  addFromGallery = async ({ file }: { file: File; url: string }) => {
    this.setState({ pendingAddFromGallery: false });
    const id = this.state.txn.getId();
    const bucket = 'kalos-transactions';
    const status = await S3ClientService.moveFileBetweenS3Buckets(
      {
        key: file.getName(),
        bucket: file.getBucket(),
      },
      {
        key: `${id}-${file.getName()}`,
        bucket,
      },
    );
    if (status === 'nok') {
      alert('Upload failed. Please try again, or contact an administrator');
      return;
    }
    const fileReq = new File();
    fileReq.setId(file.getId());
    fileReq.setBucket(bucket);
    fileReq.setOwnerId(0);
    await FileClientService.upsertFile(fileReq);
    const txnDocReq = new TransactionDocument();
    txnDocReq.setTransactionId(this.state.txn.getId());
    txnDocReq.setReference(file.getName());
    txnDocReq.setFileId(file.getId());
    txnDocReq.setTypeId(1);
    await TransactionDocumentClientService.upsertTransactionDocument(txnDocReq);
    alert('Upload complete');
  };

  deriveCallout(txn: Transaction): {
    severity: 'error' | 'success';
    text: string;
  } {
    if (!txn.getCostCenter() || txn.getCostCenter()?.getId() === 0)
      return {
        severity: 'error',
        text: 'Please select a purchase category',
      };
    if (txn.getCostCenterId() === 601002 && txn.getNotes() === '')
      return {
        severity: 'error',
        text: 'Fuel purchases must include mileage and gallons in the notes',
      };
    if (txn.getNotes() === '')
      return {
        severity: 'error',
        text: 'Purchases should include a brief description in the notes',
      };
    if (txn.getStatusId() === 4) {
      return {
        severity: 'error',
        text: `Rejection Reason: ${this.getRejectionReason()}`,
      };
    }
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
      this.state.txn.getId(),
      `${timestamp()}-generated.pdf`,
      fileData,
    );
    await this.refresh();
    await this.props.toggleLoading(() => {
      alert(
        'A PDF has been generated and uploaded for you, it is recommended you review this document before proceeding',
      );
    });
  }

  uploadSingleFileData = async () => {
    if (!this.LastSingleFileUpload) {
      console.error('Cannot upload file - no file exists.');
      return;
    }
    try {
      await this.DocsClient.upload(
        this.state.txn.getId(),
        this.FileInput.current!.files![0].name,
        this.LastSingleFileUpload?.filedata,
      );
    } catch (err) {
      alert(err);
    }

    this.props.toggleLoading();
    await this.refresh();
  };

  handleFile() {
    this.props.toggleLoading(() => {
      const fr = new FileReader();
      fr.onload = async () => {
        try {
          const fileName = this.FileInput.current!.files![0].name;
          const fileData = new Uint8Array(fr.result as ArrayBuffer);
          const srcUrl = URL.createObjectURL(
            new Blob([fileData.buffer], {
              type: getMimeType(getFileExt(fileName)),
            }),
          );

          this.LastSingleFileUpload = {
            filename: fileName,
            fileurl: srcUrl,
            filedata: fileData,
          };
        } catch (err) {
          alert('File could not be uploaded');
          console.error(err);
        }
        await this.refresh();
        this.toggleAddFromSingleFile();
      };
      if (
        this.FileInput.current &&
        this.FileInput.current.files &&
        this.FileInput.current.files.length != 0
      ) {
        fr.readAsArrayBuffer(this.FileInput.current.files[0]);
      }
    });

    if (!this.FileInput.current?.files) return;

    // Just to get rid of an outlier
    if (this.FileInput?.current?.files.length == 0) {
      this.props.toggleLoading();
    }
  }

  // Allows users to upload multiple of the same file without running into issues
  clearFileInput() {
    if (this.FileInput == null) {
      return;
    } else {
      try {
        this.FileInput!.current!.value = '';
      } catch (ex) {
        if (this.FileInput!.current!.value) {
          if (this.FileInput!.current!.parentNode == null) {
            return;
          }
          this.FileInput!.current!.parentNode!.replaceChild(
            this.FileInput!.current!.cloneNode(true),
            this.FileInput!.current!,
          );
        }
      }
    }
  }

  async refresh() {
    try {
      const req = new Transaction();
      req.setId(this.state.txn.getId());
      const refreshTxn = await this.TxnClient.Get(req);
      this.setState({
        txn: refreshTxn,
      });
    } catch (err) {
      alert(
        'Network error, displayed information may be incorrect. Refresh is advised',
      );
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
    if (this.state.txn.getDepartmentId() === 0) {
      this.state.txn.setDepartmentId(this.props.userDepartmentID);
      this.updateDepartmentID(this.state.txn.getDepartmentId);
    }
  }

  async openPromptWithInputPassed(thisInput: any) {
    thisInput.openFilePrompt();
  }

  continueSingleUpload = async ({ confirmed }: { confirmed: boolean }) => {
    if (!confirmed) {
      // If someone cancelled via the "cancel" button on the FileGallery
      this.toggleAddFromSingleFile();
      this.clearFileInput();
      await this.refresh();
      this.props.toggleLoading();
      return;
    }
    this.toggleAddFromSingleFile();
    this.uploadSingleFileData();
    this.clearFileInput();
    await this.refresh();
  };
  getRejectionReason = () => {
    const res = this.state.txn.getActivityLogList().find(a => {
      return a.getDescription().includes('rejected');
    });
    if (res) {
      return res.getDescription().replace('rejected', '');
    }
  };

  setCostCenters = async () => {
    const req = new TransactionAccount();
    req.setIsActive(1);
    const results = await new TransactionAccountClient(ENDPOINT).BatchGet(req);
    this.setState({ costCenters: results });
  };

  render() {
    const { txn, pendingAddFromGallery, pendingAddFromSingleFile } = this.state;
    const t = txn;
    const { isManager, userID } = this.props;
    let subheader = `${t.getDescription().split(' ')[0]} - ${t.getVendor()}`;
    const deriveCallout = this.deriveCallout(t);
    return (
      <>
        <Paper
          elevation={4}
          style={{
            margin: 16,
            marginTop: 32,
          }}
        >
          <SectionBar
            title={`${parseISO(
              t.getTimestamp().split(' ').join('T'),
            ).toDateString()} - $${t.getAmount()}`}
            subtitle={subheader}
            asideContent={
              <div className="TransactionUser_Actions">
                <Button
                  label="Upload Photo"
                  onClick={() => {
                    // Pass "this" to it so that we can use the FileInput then
                    // continue with the rest of the flow
                    this.openPromptWithInputPassed(this);
                  }}
                />
                <Button
                  label="Add Photo "
                  onClick={this.toggleAddFromGallery}
                />
                <AltGallery
                  title="Transaction Photo(s)"
                  text="View Photo(s)"
                  fileList={getGalleryData(t)}
                  transactionID={t.getId()}
                  canDelete
                />
                <Button label="Submit" onClick={this.submit} />
                <PDFMaker
                  dateStr={t.getTimestamp()}
                  name={t.getOwnerName()}
                  title="Missing"
                  icon={<CloseIcon />}
                  amount={t.getAmount()}
                  onCreate={this.onPDFGenerate}
                  jobNumber={`${t.getJobId()}`}
                  vendor={t.getVendor()}
                  pdfType="Missing Receipt"
                />
                {this.props.isManager && (
                  <PDFMaker
                    dateStr={t.getTimestamp()}
                    name={t.getOwnerName()}
                    icon={<ReIcon />}
                    title="Recurring"
                    amount={t.getAmount()}
                    vendor={t.getVendor()}
                    jobNumber={`${t.getJobId()}`}
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
              onSelect={(n: number) => this.updateCostCenterID(() => n)}
              selected={t.getCostCenterId()}
              sort={costCenterSortByPopularity}
              filter={
                !isManager
                  ? a => ALLOWED_ACCOUNT_IDS.includes(a.getId())
                  : undefined
              }
              hideInactive
              renderItem={i => (
                <option
                  value={i.getId()}
                  key={`${i.getId()}-${i.getDescription()}`}
                >
                  {i.getDescription()} ({i.getId()})
                </option>
              )}
            />
            <Field
              name="department"
              value={t.getDepartmentId() || this.props.userDepartmentID}
              onChange={val => this.updateDepartmentID(() => +val)}
              type="department"
            />
            <Field
              name="jobNumber"
              label="Job Number"
              value={t.getJobId()}
              onChange={val => this.updateJobNumber(() => +val)}
              type="eventId"
              style={{
                alignItems: 'flex-start',
                flexGrow: 0,
              }}
            />
            <NoteField
              initialValue={t.getNotes()}
              onChange={debounce(this.updateNotes, 500)}
            />
          </div>
          <input
            type="file"
            ref={this.FileInput}
            onChange={this.handleFile} // same image after cancel will not work
            style={{ display: 'none' }}
          />
        </Paper>
        {pendingAddFromGallery && (
          <Modal open onClose={this.toggleAddFromGallery} fullScreen>
            <FileGallery
              loggedUserId={userID}
              title="Add Photo from Gallery"
              bucket="kalos-pre-transactions"
              onClose={this.toggleAddFromGallery}
              onAdd={this.addFromGallery}
              removeFileOnAdd={false}
            />
          </Modal>
        )}
        {pendingAddFromSingleFile && (
          <Modal open onClose={this.toggleAddFromSingleFile} fullScreen>
            <FileGallery
              loggedUserId={userID}
              title="Confirm Upload"
              bucket="kalos-pre-transactions"
              onClose={
                this.toggleAddFromSingleFile
                // For some reason, the scroll bar disappears if you close it, setting overflow to
                // visible for scroll bar functionality
              }
              onAdd={this.addFromSingleFile}
              removeFileOnAdd={false}
              inputFile={this.LastSingleFileUpload}
              onlyDisplayInputFile={true}
              onConfirmAdd={this.continueSingleUpload}
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
  a: TransactionAccount,
  b: TransactionAccount,
) {
  return b.getPopularity() - a.getPopularity();
}

const ALLOWED_ACCOUNT_IDS = [
  601002, 673002, 673001, 51400, 643002, 643003, 601001, 51500, 601004, 1,
  68500, 66600,
];

function getGalleryData(txn: Transaction): GalleryData[] {
  return txn.getDocumentsList().map(d => {
    return {
      key: `${txn.getId()}-${d.getReference()}`,
      bucket: 'kalos-transactions',
    };
  });
}

function getTransactionTypeString(txn: Transaction) {
  if (txn.getCostCenterId() === 2 || txn.getCostCenter()?.getId() === 2) {
    return 'fraudulent';
  } else if (
    txn.getCostCenterId() === 1 ||
    txn.getCostCenter()?.getId() === 1
  ) {
    return 'n accidental';
  }
}
