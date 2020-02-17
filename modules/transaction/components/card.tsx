import * as React from 'react';
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
import { TransactionAccount } from '@kalos-core/kalos-rpc/TransactionAccount';
import { FileObject, S3Client } from '@kalos-core/kalos-rpc/S3File';
import { Gallery, IFile } from '../../Gallery/main';
import { GalleryData } from '../../AltGallery/main';
import { CostCenterPicker } from '../../Pickers/CostCenter';
import { DepartmentPicker } from '../../Pickers/Department';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import AddAPhotoTwoTone from '@material-ui/icons/AddAPhotoTwoTone';
import SendTwoTone from '@material-ui/icons/SendTwoTone';
import InfoSharp from '@material-ui/icons/InfoSharp';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { red, green } from '@material-ui/core/colors';
import { Event, EventClient } from '@kalos-core/kalos-rpc/Event';
import { TaskClient } from '@kalos-core/kalos-rpc/Task';
import CloseIcon from '@material-ui/icons/CloseSharp';
import { PDFMaker } from '../../PDFMaker/main';
import ReIcon from '@material-ui/icons/RefreshSharp';
import { timestamp } from '../../../helpers';

interface props {
  txn: Transaction.AsObject;
  userDepartmentID: number;
  userName: string;
  userID: number;
  isAdmin?: boolean;
  isManager?: boolean;
  fetchFn(): void;
  toggleLoading(cb?: () => void): void;
}

interface state {
  txn: Transaction.AsObject;
  files: IFile[];
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

  constructor(props: props) {
    super(props);
    this.state = {
      txn: props.txn,
      files: [],
    };
    const endpoint = 'https://core-dev.kalosflorida.com:8443';
    const { userID } = props;
    this.TxnClient = new TransactionClient(userID, endpoint);
    this.DocsClient = new TransactionDocumentClient(userID, endpoint);
    this.LogClient = new TransactionActivityClient(userID, endpoint);
    this.S3Client = new S3Client(userID, endpoint);
    this.EventClient = new EventClient(userID, endpoint);
    this.TaskClient = new TaskClient(userID, endpoint);

    this.FileInput = React.createRef();
    this.NotesInput = React.createRef();

    this.openFilePrompt = this.openFilePrompt.bind(this);
    this.updateTransaction = this.updateTransaction.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.fetchFiles = this.fetchFiles.bind(this);
    this.fetchFile = this.fetchFile.bind(this);
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
  updateNotes = this.updateTransaction('notes');
  updateVendor = this.updateTransaction('vendor');
  updateCostCenterID = this.updateTransaction('costCenterId');
  updateDepartmentID = this.updateTransaction('departmentId');
  updateStatus = this.updateTransaction('statusId');
  handleJobNumber = this.updateTransaction('jobId');

  updateJobNumber(jobString: string) {
    let jobNumber;
    if (jobString.includes('-')) {
      jobNumber = parseInt(jobString.split('-')[1]);
    } else {
      jobNumber = parseInt(jobString);
    }

    this.handleJobNumber(jobNumber);
  }

  async submit() {
    const { txn } = this.state;
    try {
      const ok = confirm(
        'Are you sure you want to submit this transaction? You will be unable to edit it again unless it is rejected, so please make sure all information is correct',
      );
      if (ok) {
        if (txn.jobId !== 0) {
          const job = new Event();
          job.setId(txn.jobId);
          let res;
          try {
            res = await this.EventClient.Get(job);
          } catch (err) {
            console.log(err);
          }
          if (!res || res.id === 0) {
            throw 'The entered job number is invalid';
          }
        }
        if (!txn.costCenter) {
          throw 'A purchase category must be assigned';
        } else if (txn.documentsList.length === 0) {
          throw 'This receipt requires a photo';
        } else if (txn.notes === '') {
          throw 'Please provide a brief description in the notes';
        } else {
          await this.updateStatus(2);
          if (txn.costCenterId === 673002) {
            await this.TaskClient.newToolPurchase(
              txn.amount,
              txn.ownerId,
              txn.vendor,
              txn.notes,
              txn.timestamp,
            );
          }
          await this.makeSubmitLog(2, 'submitted for approval');
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

  async approve() {
    const ok = confirm('Are you sure you want to approve this transaction?');
    if (ok) {
      await this.updateStatus(4);
      await this.makeSubmitLog(4, 'approved');
      await this.props.fetchFn();
    }
  }

  async reject() {
    const ok = confirm(
      'Are you sure you want to reject this transaction? Make sure to update the notes with a reason for this rejection before proceeding',
    );
    if (ok) {
      await this.updateStatus(5);
      await this.makeSubmitLog(5, 'rejected');
      await this.props.fetchFn();
    }
  }

  testCostCenter(acc: TransactionAccount.AsObject) {
    return hardcodedList.includes(acc.id);
  }

  deriveCallout(txn: Transaction.AsObject) {
    const style = {
      backgroundColor: red[900],
      color: 'white',
      width: '100%',
      borderRadius: '3px',
      padding: '5px',
    };
    if (!txn.costCenter || txn.costCenter.id === 0) {
      return (
        <Grid container direction="row" style={style}>
          <InfoSharp />
          <Typography style={{ color: 'white' }}>
            Please select a purchase category
          </Typography>
        </Grid>
      );
    } else if (txn.documentsList.length === 0) {
      return (
        <Grid container direction="row" style={style}>
          <InfoSharp />
          <Typography style={{ color: 'white' }}>
            This transaction record requires a photo of your receipt
          </Typography>
        </Grid>
      );
    } else if (txn.costCenterId === 601002 && txn.notes === '') {
      return (
        <Grid container direction="row" style={style}>
          <InfoSharp />
          <Typography style={{ color: 'white' }}>
            Fuel purchases must include mileage and gallons in the notes
          </Typography>
        </Grid>
      );
    } else if (txn.notes === '') {
      return (
        <Grid container direction="row" style={style}>
          <InfoSharp />
          <Typography style={{ color: 'white' }}>
            Purchases should include a brief description in the notes
          </Typography>
        </Grid>
      );
    } else {
      style.backgroundColor = green[700];
      return (
        <Grid container direction="row" style={style}>
          <InfoSharp />
          <Typography style={{ color: 'white' }}>
            This transaction is ready for submission
          </Typography>
        </Grid>
      );
    }
  }

  openFilePrompt() {
    this.FileInput.current && this.FileInput.current.click();
  }

  async onPDFGenerate(fileData: Blob) {
    this.props.toggleLoading();
    await this.DocsClient.upload(
      this.state.txn.id,
      `${timestamp()}-generated.pdf`,
      fileData,
    );
    await this.refresh();
    this.props.toggleLoading(() =>
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

  fetchFile(doc: TransactionDocument.AsObject) {
    const fileObj = new FileObject();
    fileObj.setBucket('kalos-transactions');
    fileObj.setKey(`${this.state.txn.id}-${doc.reference}`);
    return this.S3Client.Get(fileObj);
  }

  getGalleryData(): GalleryData[] {
    return this.state.txn.documentsList.map(d => {
      return {
        key: `${this.state.txn.id}-${d.reference}`,
        bucket: 'kalos-transactions',
      };
    });
  }

  async fetchFiles() {
    const filesList = this.state.txn.documentsList
      .filter(d => d.reference)
      .map(d => {
        const arr = d.reference.split('.');
        const mimeTypeStr = arr[arr.length - 1];
        console.log(mimeTypeStr);
        console.log(this.S3Client.getMimeType(mimeTypeStr));
        return {
          name: d.reference,
          mimeType: this.S3Client.getMimeType(mimeTypeStr),
          data: '',
        };
      });

    const promiseArr = this.state.txn.documentsList
      .filter(d => d.reference)
      .map(this.fetchFile);

    const fileObjects = await Promise.all(promiseArr);
    const files = filesList.map(f => {
      const fileObj = fileObjects.find(
        obj => obj.key.replace(`${this.state.txn.id}-`, '') === f.name,
      );
      if (fileObj) {
        f.data = fileObj.data as string;
      }
      return f;
    });
    console.log(files);
    this.setState({
      files,
    });
  }

  componentDidMount() {
    if (this.state.txn.departmentId === 0) {
      this.updateDepartmentID(this.props.userDepartmentID);
    }
  }

  render() {
    const t = this.state.txn;
    let subheader = `${t.description.split(' ')[0]} - ${t.vendor}`;
    return (
      <>
        <Card elevation={3} className="card" key={`${t.id}`} id={`${t.id}`}>
          {this.deriveCallout(t)}
          <CardHeader
            title={`${new Date(
              t.timestamp.split(' ').join('T'),
            ).toDateString()} - $${t.amount}`}
            subheader={subheader}
          />
          <Grid container direction="row" wrap="nowrap" spacing={2}>
            <Grid
              container
              item
              direction="column"
              justify="space-evenly"
              alignItems="flex-start"
            >
              <CostCenterPicker
                onSelect={this.updateCostCenterID}
                selected={t.costCenterId}
                sort={costCenterSortByPopularity}
                hideInactive
              />
              <DepartmentPicker
                onSelect={this.updateDepartmentID}
                selected={t.departmentId || this.props.userDepartmentID}
              />
              <TextField
                label="Job Number"
                defaultValue={t.jobId}
                onChange={e => this.updateJobNumber(e.currentTarget.value)}
                variant="outlined"
                margin="none"
                style={{ marginBottom: 10 }}
              />
              <TextField
                label="Notes"
                defaultValue={t.notes}
                inputRef={this.NotesInput}
                onChange={e => this.updateNotes(e.currentTarget.value)}
                variant="outlined"
                margin="none"
                multiline
                fullWidth
                style={{ marginBottom: 10 }}
              />
            </Grid>
            <Grid
              container
              item
              direction="column"
              justify="space-evenly"
              alignItems="center"
            >
              <Button
                onClick={this.openFilePrompt}
                startIcon={<AddAPhotoTwoTone />}
                size="large"
                fullWidth
                style={{
                  height: 44,
                  marginBottom: 10,
                }}
              >
                Photo
              </Button>
              <Gallery
                title="Receipt Photo(s)"
                text="Photo(s)"
                fileList={this.state.files}
                onOpen={this.fetchFiles}
                disabled={t.documentsList.length === 0}
                deleteFn={this.deleteFile}
              />
              <Button
                startIcon={<SendTwoTone />}
                size="large"
                fullWidth
                style={{ height: 44, marginBottom: 10 }}
                onClick={this.submit}
              >
                Submit
              </Button>
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
            </Grid>
          </Grid>
        </Card>
        <input
          type="file"
          ref={this.FileInput}
          onChange={this.handleFile}
          style={{ display: 'none' }}
        />
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
