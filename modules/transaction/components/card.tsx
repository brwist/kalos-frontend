import * as React from 'react';
import {
  Transaction,
  TransactionClient,
} from '@kalos-core/kalos-rpc/Transaction';
import { TransactionAccount } from '@kalos-core/kalos-rpc/TransactionAccount';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import {
  TransactionDocumentClient,
  TransactionDocument,
} from '@kalos-core/kalos-rpc/TransactionDocument';
import { FileObject, S3Client } from '@kalos-core/kalos-rpc/S3File';
import { DepartmentDropdown } from '../../Dropdown/main';
import { TextList } from '../../List/main';
import { Gallery, IFile } from '../../Gallery/main';
import { CostCenterPicker } from '../../Pickers/CostCenter';
import { DepartmentPicker } from '../../Pickers/Department';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CloudUploadTwoTone from '@material-ui/icons/CloudUploadTwoTone';
import SendTwoTone from '@material-ui/icons/SendTwoTone';
import InfoSharp from '@material-ui/icons/InfoSharp';

interface props {
  txn: Transaction.AsObject;
  userDepartmentID: number;
}

interface state {
  txn: Transaction.AsObject;
  files: IFile[];
}

export class TxnCard extends React.PureComponent<props, state> {
  TxnClient: TransactionClient;
  DocsClient: TransactionDocumentClient;
  S3Client: S3Client;
  FileInput: React.RefObject<HTMLInputElement>;

  constructor(props: props) {
    super(props);
    this.state = {
      txn: props.txn,
      files: [],
    };

    this.TxnClient = new TransactionClient();
    this.DocsClient = new TransactionDocumentClient();
    this.S3Client = new S3Client();

    this.FileInput = React.createRef();

    this.updateTransaction = this.updateTransaction.bind(this);
    this.openFilePrompt = this.openFilePrompt.bind(this);
    this.updateCostCenter = this.updateCostCenter.bind(this);
    this.updateDepartment = this.updateDepartment.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.fetchFiles = this.fetchFiles.bind(this);
    this.fetchFile = this.fetchFile.bind(this);
  }

  updateTransaction<K extends keyof Transaction.AsObject>(prop: K) {
    return async (value: Transaction.AsObject[K]) => {
      try {
        const reqObj = new Transaction();
        const upperCaseProp = `${prop[0].toLocaleUpperCase()}${prop.slice(1)}`;
        const methodName = `set${upperCaseProp}`;
        reqObj.setId(this.state.txn.id);
        //@ts-ignore
        reqObj[methodName](value);
        reqObj.setFieldMaskList([upperCaseProp]);
        const updatedTxn = await this.TxnClient.Update(reqObj);
        console.log(updatedTxn);
        this.setState({ txn: updatedTxn });
      } catch (err) {
        console.log(err);
      }
    };
  }

  updateNotes = this.updateTransaction('notes');

  updateVendor = this.updateTransaction('vendor');

  updateCostCenterID = this.updateTransaction('costCenterId');
  updateCostCenter(c: TransactionAccount.AsObject) {
    this.updateCostCenterID(c.id);
  }

  updateDepartmentID = this.updateTransaction('departmentId');
  updateDepartment(d: TimesheetDepartment.AsObject) {
    this.updateDepartmentID(d.id);
  }

  deriveCallout(txn: Transaction.AsObject) {
    if (txn.documentsList.length === 0) {
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

  refresh() {
    return new Promise(async resolve => {
      try {
        const req = new Transaction();
        req.setId(this.state.txn.id);
        const refreshTxn = await this.TxnClient.Get(req);
        this.setState(
          {
            txn: refreshTxn,
          },
          async () => {
            await this.fetchFiles();
            resolve(true);
          },
        );
      } catch (err) {
        alert(
          'Network error, displayed information may be incorrect. Refresh is advised',
        );
        console.log(err);
      }
    });
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

  async componentDidMount() {
    await this.fetchFiles();
  }

  render() {
    const t = this.state.txn;
    return (
      <>
        <Card
          elevation={3}
          className="m-h-10 m-b-10 flex-col align-stretch"
          key={`${t.id}`}
          id={`${t.id}`}
        >
          <div className="flex-row justify-around">
            {this.deriveCallout(t)}
            <div className="flex-col">
              <TextList
                contents={[
                  {
                    primary: 'Purchase Date:',
                    secondary: new Date(t.timestamp).toLocaleDateString(
                      'en-US',
                    ),
                  },
                  {
                    primary: 'Description:',
                    secondary: t.description,
                  },
                  {
                    primary: 'Amount',
                    secondary: `$${t.amount}`,
                  },
                ]}
              />
            </div>
            <div className="flex-col justify-evenly">
              <CostCenterPicker
                onSelect={this.updateCostCenter}
                selected={t.costCenterId}
              />
              <TextField
                label="Notes"
                value={t.notes}
                onChange={e => this.updateNotes(e.currentTarget.value)}
              />
              <DepartmentPicker
                onSelect={this.updateDepartment}
                selected={t.departmentId || this.props.userDepartmentID}
              />
            </div>
          </div>
          <div className="flex-row justify-center">
            <div className="flex-col w-75 justify-evenly">
              <Button
                onClick={this.openFilePrompt}
                startIcon={<CloudUploadTwoTone />}
                variant="outlined"
                size="large"
                style={{ height: 44, marginBottom: 5 }}
                className="m-b-5"
              >
                Add Receipt Photo
              </Button>
              <Gallery
                title="Receipt Photo(s)"
                text="View Receipt Photo(s)"
                fileList={this.state.files}
              />
              <Button
                startIcon={<SendTwoTone />}
                variant="outlined"
                size="large"
                style={{ height: 44, marginBottom: 5 }}
                className="m-b-5"
              >
                Submit For Review
              </Button>
            </div>
          </div>
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
