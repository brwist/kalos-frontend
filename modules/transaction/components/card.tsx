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
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { red, green } from '@material-ui/core/colors';

interface props {
  txn: Transaction.AsObject;
  userDepartmentID: number;
  userName: string;
  userID: number;
  isAdmin?: boolean;
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
  S3Client: S3Client;
  FileInput: React.RefObject<HTMLInputElement>;
  NotesInput: React.RefObject<HTMLInputElement>;

  constructor(props: props) {
    super(props);
    this.state = {
      txn: props.txn,
      files: [],
    };

    this.TxnClient = new TransactionClient();
    this.DocsClient = new TransactionDocumentClient();
    this.LogClient = new TransactionActivityClient();
    this.S3Client = new S3Client();

    this.FileInput = React.createRef();
    this.NotesInput = React.createRef();

    this.openFilePrompt = this.openFilePrompt.bind(this);
    this.updateTransaction = this.updateTransaction.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.fetchFiles = this.fetchFiles.bind(this);
    this.fetchFile = this.fetchFile.bind(this);
    this.submit = this.submit.bind(this);
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

  submit() {
    const { txn } = this.state;
    try {
      const ok = confirm(
        'Are you sure you want to submit this transaction? You will be unable to edit it again unless it is rejected, so please make sure all information is correct',
      );
      if (ok) {
        if (!txn.costCenter) {
          throw 'A purchase category must be assigned';
        } else if (
          txn.amount > txn.costCenter.thresholdAmount &&
          txn.documentsList.length === 0
        ) {
          throw 'This receipt requires a photo';
        } else {
          this.updateStatus(2);
        }
      }
    } catch (err) {
      alert(err);
    }
  }

  approve() {
    const ok = confirm('Are you sure you want to approve this transaction?');
    if (ok) {
      this.updateStatus(4);
    }
  }

  reject() {
    const ok = confirm(
      'Are you sure you want to reject this transaction? Make sure to update the notes with a reason for this rejection before proceeding',
    );
    if (ok) {
      this.updateStatus(5);
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

    if (!txn.costCenter) {
      return (
        <Grid container direction="row" style={style}>
          <InfoSharp />
          <Typography>Please select a purchase category</Typography>
        </Grid>
      );
    } else if (
      txn.amount > txn.costCenter.thresholdAmount &&
      txn.documentsList.length === 0
    ) {
      return (
        <Grid container direction="row" style={style}>
          <InfoSharp />
          <Typography>
            This transaction record requires a photo of your receipt
          </Typography>
        </Grid>
      );
    } else if (txn.costCenterId === 601002 && txn.notes === '') {
      return (
        <Grid container direction="row" style={style}>
          <InfoSharp />
          <Typography>
            Fuel purchases must include mileage and gallons in the notes
          </Typography>
        </Grid>
      );
    } else if (txn.statusId === 1) {
      style.backgroundColor = green[700];
      return (
        <Grid container direction="row" style={style}>
          <InfoSharp />
          <Typography>This transaction is ready for submission</Typography>
        </Grid>
      );
    }
  }

  openFilePrompt() {
    this.FileInput.current && this.FileInput.current.click();
  }

  handleFile() {
    const fr = new FileReader();
    fr.onload = async () => {
      await this.DocsClient.upload(
        this.state.txn.id,
        this.FileInput.current!.files![0].name,
        new Uint8Array(fr.result as ArrayBuffer),
      );
      await this.refresh();
    };
    if (this.FileInput.current && this.FileInput.current.files) {
      fr.readAsArrayBuffer(this.FileInput.current.files[0]);
    }
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

  fetchFile(doc: TransactionDocument.AsObject) {
    const fileObj = new FileObject();
    fileObj.setBucket('kalos-transactions');
    fileObj.setKey(`${this.state.txn.id}-${doc.reference}`);
    return this.S3Client.Get(fileObj);
  }

  async fetchFiles() {
    const filesList = this.state.txn.documentsList
      .filter(d => d.reference)
      .map(d => {
        return {
          name: d.reference,
          mimeType: getMimeType(d.reference.split('.')[1]),
          data: '',
        };
      });

    const promiseArr = this.state.txn.documentsList
      .filter(d => d.reference)
      .map(this.fetchFile);

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
    let subheader = `${t.description} - $${t.amount}`;
    if (this.props.isAdmin) {
      subheader = `${subheader}\n${t.ownerName}`;
    }
    return (
      <>
        <Card elevation={3} className="card" key={`${t.id}`} id={`${t.id}`}>
          {this.deriveCallout(t)}
          <CardHeader
            title={`${new Date(
              t.timestamp.split(' ').join('T'),
            ).toDateString()}`}
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
                test={this.testCostCenter}
                useDevClient
              />
              <DepartmentPicker
                onSelect={this.updateDepartmentID}
                selected={t.departmentId || this.props.userDepartmentID}
                useDevClient
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
              {!this.props.isAdmin && (
                <Button
                  onClick={this.openFilePrompt}
                  startIcon={<AddAPhotoTwoTone />}
                  variant="outlined"
                  size="large"
                  fullWidth
                  style={{ height: 44, marginBottom: 10 }}
                >
                  Photo
                </Button>
              )}
              <Gallery
                title="Receipt Photo(s)"
                text="Photo(s)"
                fileList={this.state.files}
                onOpen={this.fetchFiles}
              />
              {!this.props.isAdmin && (
                <Button
                  startIcon={<SendTwoTone />}
                  variant="outlined"
                  size="large"
                  fullWidth
                  style={{ height: 44, marginBottom: 10 }}
                  onClick={this.submit}
                >
                  Submit
                </Button>
              )}
              {this.props.isAdmin && (
                <Button
                  startIcon={<SendTwoTone />}
                  variant="outlined"
                  size="large"
                  fullWidth
                  style={{ height: 44, marginBottom: 10 }}
                  onClick={this.approve}
                >
                  Approve
                </Button>
              )}
              {this.props.isAdmin && (
                <Button
                  startIcon={<SendTwoTone />}
                  variant="outlined"
                  size="large"
                  fullWidth
                  style={{ height: 44, marginBottom: 10 }}
                  onClick={this.reject}
                >
                  Reject
                </Button>
              )}
            </Grid>
          </Grid>
        </Card>
        <Hidden xsUp>
          <input type="file" ref={this.FileInput} onChange={this.handleFile} />
        </Hidden>
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
