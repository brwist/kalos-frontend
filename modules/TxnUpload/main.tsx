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

interface props {
  userId: number;
}

interface state {
  txnList: Transaction.AsObject[];
  csvArr: string[][];
  page: number;
  rowsPerPage: number;
}

export class TxnUpload extends React.PureComponent<props, state> {
  UserClient: UserClient;
  FileInput: React.RefObject<HTMLInputElement>;
  constructor(props: props) {
    super(props);
    this.state = {
      txnList: [],
      csvArr: [],
      page: 0,
      rowsPerPage: 10,
    };
    const endpoint = 'https://core-dev.kalosflorida.com:8443';

    this.setPage = this.setPage.bind(this);
    this.setRowsPerPage = this.setRowsPerPage.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.FileInput = React.createRef<HTMLInputElement>();
    this.UserClient = new UserClient(endpoint);
  }

  async handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.files) {
      const fr = new FileReader();
      fr.onload = () => {
        const arr = fr.result ? (fr.result as string).split('\n') : [];
        this.setState({
          csvArr: arr.map(s => s.split(',')),
        });
      };
      fr.readAsBinaryString(e.currentTarget.files[0]);
    }
  }

  async componentDidMount() {
    await this.UserClient.GetToken('test', 'test');
  }

  setPage(event: unknown, newPage: number) {
    this.setState({
      page: newPage,
    });
  }

  setRowsPerPage(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      rowsPerPage: +e.currentTarget.value,
      page: 0,
    });
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
                    <TxnUploadRow source={arr} key={arr.join(',')} />
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

function lineToTransaction(txnStr: string) {}
