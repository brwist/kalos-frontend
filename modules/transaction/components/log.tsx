import React from 'react';
import {
  TransactionActivity,
  TransactionActivityClient,
} from '@kalos-core/kalos-rpc/TransactionActivity';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/CloseSharp';
import IconButton from '@material-ui/core/IconButton';

interface props {
  txnID: number;
}

interface state {
  list: TransactionActivity.AsObject[];
  isOpen: boolean;
}

export class TxnLog extends React.PureComponent<props, state> {
  LogClient: TransactionActivityClient;
  constructor(props: props) {
    super(props);

    this.state = {
      list: [],
      isOpen: false,
    };

    this.LogClient = new TransactionActivityClient();

    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.addLog = this.addLog.bind(this);
  }

  toggleVisibility() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  addLog(log: TransactionActivity.AsObject) {
    this.setState(prevState => ({ list: prevState.list.concat(log) }));
  }

  componentDidUpdate(prevProps: props, prevState: state) {
    if (prevState.isOpen === false && this.state.isOpen === true) {
      const log = new TransactionActivity();
      log.setTransactionId(this.props.txnID);
      this.LogClient.List(log, this.addLog);
    }

    if (
      prevState.isOpen === true &&
      this.state.isOpen === false &&
      this.state.list.length !== 0
    ) {
      this.setState({ list: [] });
    }
  }

  render() {
    return (
      <>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          style={{ height: 44, marginBottom: 10 }}
          onClick={this.toggleVisibility}
        >
          View Activity Log
        </Button>
        <Modal open={this.state.isOpen} onClose={this.toggleVisibility}>
          <Paper style={{ width: '100%', overflowX: 'auto' }}>
            <IconButton onClick={this.toggleVisibility}>
              <CloseIcon />
            </IconButton>
            <Table aria-label="transaction activity log table">
              <TableHead>
                <TableRow>
                  <TableCell>Action Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.list.map(activity => (
                  <TableRow>
                    <TableCell>{activity.timestamp}</TableCell>
                    <TableCell>{activity.description}</TableCell>
                    <TableCell>{activity.userId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Modal>
      </>
    );
  }
}
