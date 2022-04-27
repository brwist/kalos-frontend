import React from 'react';
import {
  TransactionActivity,
  TransactionActivityClient,
} from '../../../@kalos-core/kalos-rpc/TransactionActivity';
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
import ListIcon from '@material-ui/icons/ListSharp';
import { UserClient, User } from '../../../@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../../constants';
import { Tooltip } from '../../ComponentsLibrary/Tooltip';
import { Confirm } from '../../ComponentsLibrary/Confirm';
import Dialog from '@material-ui/core/Dialog';
interface props {
  txnID: number;
  iconButton?: boolean;
}

interface state {
  list: TransactionActivity[];
  actorMap: Map<number, string>;
  isOpen: boolean;
  error: string | null;
}

export class TxnLog extends React.PureComponent<props, state> {
  LogClient: TransactionActivityClient;
  UserClient: UserClient;

  constructor(props: props) {
    super(props);

    this.state = {
      list: [],
      isOpen: false,
      actorMap: new Map<number, string>(),
      error: null,
    };

    this.LogClient = new TransactionActivityClient(ENDPOINT);
    this.UserClient = new UserClient(ENDPOINT);

    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.handleSetError = this.handleSetError.bind(this);
    this.addLog = this.addLog.bind(this);
  }

  toggleVisibility() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  async addLog(log: TransactionActivity) {
    console.log({ log });
    const user = new User();
    user.setId(log.getUserId());
    let res: User | null = null;
    try {
      res = await this.UserClient.Get(user);
    } catch (err) {
      console.error(`An error occurred while getting a user: ${err}`);
    }

    if (!res) {
      console.error(
        'No results gotten from the user client service. Returning and setting error.',
      );
      this.setState({
        error: `Error: No results gotten from the User Client Service for user ${user.getId()}. Please report this to the web tech team.`,
      });
      return;
    }

    this.setState(prevState => {
      const map = new Map(prevState.actorMap);
      map.set(
        log.getId(),
        `${res!.getFirstname()} ${res!.getLastname()} ${res!.getId()}`,
      );
      return {
        list: prevState.list.concat(log),
        actorMap: map,
      };
    });
  }

  handleSetError(newError: string | null) {
    this.setState({ error: newError });
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
    const button = this.props.iconButton ? (
      <Tooltip content="View activity log">
        <IconButton size="small" onClick={this.toggleVisibility}>
          <ListIcon />
        </IconButton>
      </Tooltip>
    ) : (
      <Button
        variant="outlined"
        size="large"
        fullWidth
        style={{ height: 44, marginBottom: 10 }}
        onClick={this.toggleVisibility}
      >
        View Activity Log
      </Button>
    );
    return (
      <>
        {this.state.error && (
          <Confirm
            key={this.state.error}
            open={this.state.error != null}
            onClose={() => this.handleSetError(null)}
            onConfirm={() => this.handleSetError(null)}
          >
            {this.state.error}
          </Confirm>
        )}
        {button}
        <Dialog
          open={this.state.isOpen}
          onClose={this.toggleVisibility}
          style={{
            position: 'fixed',
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper style={{ width: '100%', overflowX: 'scroll' }}>
            <IconButton onClick={this.toggleVisibility}>
              <CloseIcon />
            </IconButton>
            <Table aria-label="transaction activity log table">
              <TableHead>
                <TableRow>
                  <TableCell>Action Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Reason</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.list
                  .filter(
                    activity =>
                      !activity.getDescription().includes('[old.') ||
                      !activity.getDescription().includes('[new.'),
                  )
                  .map(activity => (
                    <TableRow key={`activity_${activity.getId()}`}>
                      <TableCell>{activity.getTimestamp()}</TableCell>
                      <TableCell>{activity.getDescription()}</TableCell>
                      <TableCell>
                        {this.state.actorMap.get(activity.getId())}
                      </TableCell>
                      <TableCell>
                        {activity.getDescription().replace('rejected', '')}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Paper>
        </Dialog>
      </>
    );
  }
}
