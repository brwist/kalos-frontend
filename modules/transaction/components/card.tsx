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
import { FileObject, S3Client } from '@kalos-core/kalos-rpc/S3File';
import { TextList } from '../../List/main';
import { Gallery, IFile } from '../../Gallery/main';
import { CostCenterPicker } from '../../Pickers/CostCenter';
import { DepartmentPicker } from '../../Pickers/Department';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import CloudUploadTwoTone from '@material-ui/icons/CloudUploadTwoTone';
import SendTwoTone from '@material-ui/icons/SendTwoTone';
import InfoSharp from '@material-ui/icons/InfoSharp';
import { TransactionAccount } from '@kalos-core/kalos-rpc/TransactionAccount';
import Grid from '@material-ui/core/Grid';

interface props {
  txn: Transaction.AsObject;
  userDepartmentID: number;
  userName: string;
  userID: number;
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
    const ok = confirm(
      'Are you sure you want to submit this transaction? You will be unable to edit it again unless it is rejected, so please make sure all information is correct',
    );
    if (ok) {
      this.updateStatus(2);
    }
  }

  testCostCenter(acc: TransactionAccount.AsObject) {
    return hardcodedList.includes(acc.id);
  }

  deriveCallout(txn: Transaction.AsObject) {
    if (txn.documentsList.length === 0) {
      //TODO implement receipt photo conditions
      return (
        <span style={{ backgroundColor: 'red', color: 'white', width: '100%' }}>
          <InfoSharp />
          <p>This transaction record requires a photo of your receipt</p>
        </span>
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

  render() {
    const t = this.state.txn;
    return (
      <>
        <Card
          elevation={3}
          className="m-h-10 m-b-10 p-15 flex-col align-stretch"
          key={`${t.id}`}
          id={`${t.id}`}
        >
          <CardHeader
            title={`${new Date(
              t.timestamp.split(' ').join('T'),
            ).toDateString()}`}
            subheader={`${t.description} - $${t.amount}`}
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
              />
              <DepartmentPicker
                onSelect={this.updateDepartmentID}
                selected={t.departmentId || this.props.userDepartmentID}
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
                startIcon={<CloudUploadTwoTone />}
                variant="outlined"
                size="large"
                fullWidth
                style={{ height: 44, marginBottom: 10 }}
              >
                Add Receipt Photo
              </Button>
              <Gallery
                title="Receipt Photo(s)"
                text="View Receipt Photo(s)"
                fileList={this.state.files}
                onOpen={this.fetchFiles}
              />
              <Button
                startIcon={<SendTwoTone />}
                variant="outlined"
                size="large"
                fullWidth
                style={{ height: 44, marginBottom: 10 }}
                onClick={this.submit}
              >
                Submit For Review
              </Button>
            </Grid>
          </Grid>
        </Card>
        <input
          type="file"
          ref={this.FileInput}
          className="hide"
          onChange={this.handleFile}
        />
      </>
    );
  }
}

function getMimeType(fileType: string) {
  if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg') {
    return `image/${fileType}`;
  } else if (fileType === 'pdf') {
    return `application/${fileType}`;
  } else {
    return fileType;
  }
}
