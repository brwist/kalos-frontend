import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/EditSharp';
import CancelIcon from '@material-ui/icons/CloseSharp';
import UploadIcon from '@material-ui/icons/ThumbUpSharp';
import { CostCenterPicker } from '../Pickers/CostCenter';
import {
  Transaction,
  TransactionClient,
} from '@kalos-core/kalos-rpc/Transaction';
import {
  TransactionAccount,
  TransactionAccountClient,
} from '@kalos-core/kalos-rpc/TransactionAccount';

interface props {
  source: string[];
  getUser(): Promise<number>;
  onUpload(arr: string): void;
}

interface state {
  txn: Transaction;
  postDate: string;
  category: string;
  credit: string;
  costCenterID: number;
  isEditing: boolean;
}

export class TxnUploadRow extends React.PureComponent<props, state> {
  AccountClient: TransactionAccountClient;
  TxnClient: TransactionClient;
  Description: React.RefObject<HTMLInputElement>;
  constructor(props: props) {
    super(props);
    this.state = {
      txn: sourceToTxn(props.source),
      postDate: props.source[1],
      category: props.source[4],
      credit: props.source[6],
      costCenterID: 0,
      isEditing: false,
    };
    const endpoint = 'https://core-dev.kalosflorida.com:8443';
    this.AccountClient = new TransactionAccountClient(endpoint);
    this.TxnClient = new TransactionClient(endpoint);

    this.Description = React.createRef<HTMLInputElement>();
    this.updateDescription = this.updateDescription.bind(this);
    this.updateCostCenter = this.updateCostCenter.bind(this);
    this.getCostCenter = this.getCostCenter.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
    this.submitTransaction = this.submitTransaction.bind(this);
  }

  updateDescription(e: React.ChangeEvent<HTMLInputElement>) {
    const { txn } = this.state;
    txn.setDescription(e.currentTarget.value);
    this.setState({
      txn,
    });
  }

  updateCostCenter(id: number) {
    const { txn } = this.state;
    txn.setCostCenterId(id);
    this.setState({
      costCenterID: id,
      txn,
    });
  }

  toggleEditing() {
    this.setState(prevState => ({
      isEditing: !prevState.isEditing,
    }));
  }

  componentDidUpdate(prevProps: props, prevState: state) {
    if (this.state.isEditing && this.Description.current) {
      this.Description.current.focus();
    }
  }

  async getCostCenter() {
    const accReq = new TransactionAccount();
    accReq.setDescription(`%${this.state.category}%`);
    const res = await this.AccountClient.Get(accReq);
    this.setState({ costCenterID: res.id });
  }

  async submitTransaction() {
    const userId = await this.props.getUser();
    const { txn } = this.state;
    txn.setOwnerId(userId);
    txn.setCostCenterId(this.state.costCenterID);
    try {
      const res = await this.TxnClient.Create(txn);
      this.props.onUpload(this.props.source.join(','));
    } catch (err) {
      console.log('transaction upload failed', err);
    }
  }

  render() {
    const { txn, postDate, category, credit, isEditing } = this.state;
    return (
      <TableRow>
        <TableCell>{txn.getTimestamp()}</TableCell>
        <TableCell>{postDate}</TableCell>
        <TableCell>{txn.getCardUsed()}</TableCell>
        <TableCell>
          {isEditing ? (
            <TextField
              defaultValue={txn.getDescription()}
              onChange={this.updateDescription}
              inputRef={this.Description}
              fullWidth
            />
          ) : (
            txn.getDescription()
          )}
        </TableCell>
        <TableCell>{category}</TableCell>
        <TableCell>
          <CostCenterPicker
            selected={this.state.costCenterID}
            onSelect={this.updateCostCenter}
            label="Purchase Type (optional)"
          />
        </TableCell>
        <TableCell>{isNaN(txn.getAmount()) ? '' : txn.getAmount()}</TableCell>
        <TableCell>{credit}</TableCell>
        <TableCell>
          <Tooltip
            title={isEditing ? 'Stop Editing' : 'Edit Description'}
            placement="top"
          >
            <IconButton onClick={this.toggleEditing}>
              {!isEditing ? <EditIcon /> : <CancelIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Upload Transaction" placement="top">
            <IconButton onClick={this.submitTransaction}>
              <UploadIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  }
}

function sourceToTxn(source: string[]) {
  const txn = new Transaction();
  txn.setTimestamp(source[0]);
  txn.setCardUsed(source[2]);
  txn.setDescription(source[3]);
  let amount = parseFloat(source[5]);
  txn.setAmount(amount);
  return txn;
}
