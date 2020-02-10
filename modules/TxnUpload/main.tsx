import React from 'react';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import { TxnUploadRow } from './row';
import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import {
  RemoteIdentity,
  RemoteIdentityClient,
} from '@kalos-core/kalos-rpc/RemoteIdentity';

const CSV_CACHE_KEY = 'LOCAL_CSV_STORAGE';

interface props {
  userId: number;
}

interface state {
  txnList: Transaction.AsObject[];
  csvArr: string[][];
  page: number;
  rowsPerPage: number;
  account: string;
}

export class TxnUpload extends React.PureComponent<props, state> {
  UserClient: UserClient;
  IdentityClient: RemoteIdentityClient;
  FileInput: React.RefObject<HTMLInputElement>;
  constructor(props: props) {
    super(props);
    this.state = {
      txnList: [],
      csvArr: [],
      page: 0,
      rowsPerPage: 10,
      account: '',
    };
    const endpoint = 'https://core-dev.kalosflorida.com:8443';

    this.setPage = this.setPage.bind(this);
    this.setRowsPerPage = this.setRowsPerPage.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.FileInput = React.createRef<HTMLInputElement>();

    this.UserClient = new UserClient(0, endpoint);
    this.IdentityClient = new RemoteIdentityClient(0, endpoint);
    this.makeGetTxnUser = this.makeGetTxnUser.bind(this);
    this.restoreFromCache = this.restoreFromCache.bind(this);
    this.cacheCSV = this.cacheCSV.bind(this);
    this.removeTxnLine = this.removeTxnLine.bind(this);
  }

  makeGetTxnUser(cardUsed: string) {
    return async () => {
      const req = new RemoteIdentity();
      req.setIdentityString(cardUsed);
      req.setService('credit_card');
      const res = await this.IdentityClient.BatchGet(req);
      const list = res.getResultsList();
      if (list.length === 1) {
        return list[0].getUserId();
      } else {
        return await this.recursiveGetUser(list.map(u => u.getUserId()));
      }
    };
  }

  async recursiveGetUser(idArr: number[], index = 0): Promise<number> {
    const idReq = new RemoteIdentity();
    idReq.setUserId(idArr[index]);
    idReq.setIdentityString(this.state.account);
    idReq.setService('credit_account');
    try {
      const res = await this.IdentityClient.Get(idReq);
      return res.userId;
    } catch (err) {
      index = index + 1;
      if (index <= idArr.length - 1) {
        return await this.recursiveGetUser(idArr, index);
      } else {
        return 0;
      }
    }
  }

  async handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.files) {
      const fr = new FileReader();
      fr.onload = () => {
        const arr = fr.result ? (fr.result as string).split('\n') : [];
        this.setState(
          {
            csvArr: arr.map(s => s.split(',')),
          },
          async () => {
            localStorage.setItem(CSV_CACHE_KEY, fr.result as string);
            await this.guessAccountNumber();
          },
        );
      };
      fr.readAsBinaryString(e.currentTarget.files[0]);
    }
  }

  restoreFromCache() {
    const cachedCSV = localStorage.getItem(CSV_CACHE_KEY);
    if (cachedCSV) {
      this.setState({
        csvArr: cachedCSV.split('\n').map(s => s.split(',')),
      });
    }
  }

  cacheCSV() {
    const CSV = this.state.csvArr.map(arr => arr.join(',')).join('\n');
    localStorage.setItem(CSV_CACHE_KEY, CSV);
  }

  removeTxnLine(sourceArr: string) {
    const newCSV = this.state.csvArr.filter(arr => {
      const arrStr = arr.join(',');
      if (arrStr === sourceArr) {
        return false;
      } else return true;
    });
    this.setState(
      {
        csvArr: newCSV,
      },
      this.cacheCSV,
    );
  }

  async guessAccountNumber(index = 1): Promise<void> {
    const currentRow = this.state.csvArr[index];
    const req = new RemoteIdentity();
    req.setIdentityString(currentRow[2]);
    req.setService('credit_card');
    const res = await this.IdentityClient.BatchGet(req);
    const list = res.getResultsList();
    if (list.length === 1) {
      const idReq = new RemoteIdentity();
      idReq.setUserId(list[0].getUserId());
      idReq.setService('credit_account');
      const account = await this.IdentityClient.Get(idReq);
      this.setState({ account: account.identityString });
    } else {
      index = index + 1;
      return await this.guessAccountNumber(index);
    }
  }

  setPage(event: unknown, newPage: number) {
    this.setState({
      page: newPage,
    });
  }

  setRowsPerPage(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      rowsPerPage: +e.target.value,
      page: 0,
    });
  }

  async componentDidMount() {
    await this.UserClient.GetToken('test', 'test');
    this.restoreFromCache();
  }

  render() {
    const { page, rowsPerPage } = this.state;
    return (
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="center"
        style={{ width: '100%' }}
      >
        <Paper>
          <Input ref={this.FileInput} type="file" onChange={this.handleFile} />
          {this.state.csvArr.length > 0 && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  {this.state.csvArr[0].map(s => {
                    if (s === 'Category') {
                      return (
                        <React.Fragment key={s}>
                          <TableCell>{s}</TableCell>
                          <TableCell></TableCell>
                        </React.Fragment>
                      );
                    } else return <TableCell key={s}>{s}</TableCell>;
                  })}
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.csvArr
                  .slice(1)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(arr => (
                    <TxnUploadRow
                      source={arr}
                      key={arr.join(',')}
                      getUser={this.makeGetTxnUser(arr[2])}
                      onUpload={this.removeTxnLine}
                    />
                  ))}
              </TableBody>
            </Table>
          )}
        </Paper>
        {this.state.csvArr.length !== 0 && (
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={this.state.csvArr.length - 1}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            onChangePage={this.setPage}
            onChangeRowsPerPage={this.setRowsPerPage}
          />
        )}
      </Grid>
    );
  }
}
