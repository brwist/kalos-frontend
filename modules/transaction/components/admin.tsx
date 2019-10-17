import * as React from 'react';
import {
  Transaction as Txn,
  TransactionClient,
  TxnArray,
  txnToArray,
} from '@kalos-core/kalos-rpc/Transaction';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import {
  Utils,
  IMenuContext,
  CopyCellsMenuItem,
  Table,
  SelectionModes,
} from '@blueprintjs/table';
import { Button, Menu } from '@blueprintjs/core';
import {
  NumberSortableColumn,
  TextSortableColumn,
  AbstractSortableColumn,
} from './columns';

interface props {
  userId: number;
}

interface state {
  transactions: Txn.AsObject[];
  txnMatrix: TxnArray[];
  page: number;
  isLoading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  columns: AbstractSortableColumn[];
  columnNames: string[];
  sortedIndexMap: number[];
  sortedColumn: number;
  sortDir: string;
}

export class TransactionAdminView extends React.PureComponent<props, state> {
  static dataKey = (rowIndex: number, columnIndex: number) => {
    return `${rowIndex}-${columnIndex}`;
  };

  TxnClient: TransactionClient;
  UserClient: UserClient;

  constructor(props: props) {
    super(props);
    this.state = {
      transactions: [],
      txnMatrix: [],
      page: 0,
      isLoading: false,
      isAdmin: false,
      isManager: false,
      columns: [
        new NumberSortableColumn('Id', 0, false),
        new NumberSortableColumn('Job Id', 1, true),
        new TextSortableColumn('Department', 2, false),
        new TextSortableColumn('Vendor', 3, true),
        new TextSortableColumn('Cost Center', 4, false),
        new TextSortableColumn('Description', 5, false),
        new NumberSortableColumn('Amount', 6, true),
        new TextSortableColumn('Timestamp', 7, true),
        new TextSortableColumn('Owner Name', 8, true),
        new TextSortableColumn('Notes', 9, true),
      ],
      columnNames: [
        'Id',
        'Job Id',
        'Department Id',
        'Vendor',
        'Cost Center Id',
        'Description',
        'Amount',
        'Timestamp',
        'Owner Name',
        'Notes',
      ],
      sortedIndexMap: [],
      sortedColumn: 0,
      sortDir: 'asc',
    };
    this.TxnClient = new TransactionClient();
    this.UserClient = new UserClient();

    this.fetchTxnMatrix = this.fetchTxnMatrix.bind(this);
    this.renderBodyContextMenu = this.renderBodyContextMenu.bind(this);
    this.sortColumn = this.sortColumn.bind(this);
    this.copyCell = this.copyCell.bind(this);
    this.getCellData = this.getCellData.bind(this);
    this.getUserData = this.getUserData.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.updateRow = this.updateRow.bind(this);
    this.setCellValue = this.setCellValue.bind(this);
    this.getSortFunc = this.getSortFunc.bind(this);
    this.sortAndSet = this.sortAndSet.bind(this);
  }

  changePage(changeAmount: number) {
    return () => {
      if (!this.state.isLoading) {
        this.setState(
          prevState => ({ page: prevState.page + changeAmount }),
          this.fetchTxnMatrix,
        );
      } else {
        console.log('page change request while loading ignored');
      }
    };
  }

  prevPage = this.changePage(-1);

  nextPage = this.changePage(1);

  getSortFunc(): (a: any, b: any) => any {
    try {
      const colType = typeof this.state.txnMatrix[0][this.state.sortedColumn];
      if (colType === 'string') {
        if (this.state.sortDir === 'asc') {
          return stringSortAsc;
        } else {
          return stringSortDesc;
        }
      } else if (colType === 'number') {
        if (this.state.sortDir === 'asc') {
          return numberSortAsc;
        } else {
          return numberSortDesc;
        }
      }
      throw 'no match';
    } catch (err) {
      console.log(err);
      return numberSortAsc;
    }
  }

  fetchTxnMatrix() {
    return new Promise<boolean>(resolve => {
      if (!this.state.isLoading) {
        this.setState(
          () => ({ transactions: [], isLoading: true }),
          async () => {
            const reqObj = new Txn();
            console.log(this.state.page);
            reqObj.setPageNumber(this.state.page + 1);
            const res = await this.TxnClient.BatchGet(reqObj);
            const txns = res.getResultsList();
            console.log(txns);
            const matrix = txns.map(txnToArray);
            const sortFunc = this.getSortFunc();
            this.sortAndSet(sortFunc, matrix);
            resolve(true);
          },
        );
      }
    });
  }

  async getUserData() {
    const user = new User();
    user.setId(this.props.userId);
    const userData = await this.UserClient.Get(user);
    this.setState({ isAdmin: userData.isSu === 1 });
  }

  async updateRow(rowIndex: number, columnIndex: number) {
    const txnRow = this.state.txnMatrix[rowIndex];
    let reqTxn = new Txn();
    const colName = this.state.columnNames[columnIndex];
    reqTxn.setId(txnRow[0]);

    if (colName === 'Owner Name') {
      const userData = new User();
      const name = (txnRow[columnIndex] as string).split(' ');
      userData.setFirstname(name[0]);
      userData.setLastname(name[1]);
      try {
        const user = await this.UserClient.Get(userData);
        if (user.id) {
          reqTxn.setOwnerId(user.id);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      reqTxn = updateReqObj(reqTxn, colName, txnRow[columnIndex]);
      console.log(reqTxn.toObject());
    }
    console.log(reqTxn.toObject());
    await this.TxnClient.Update(reqTxn);
    await this.fetchTxnMatrix();
    return true;
  }

  setCellValue(rowIndex: number, columnIndex: number) {
    return (value: string) => {
      const sortedRowIndex = this.state.sortedIndexMap[rowIndex];
      if (sortedRowIndex != null) {
        rowIndex = sortedRowIndex;
      }
      const matrix = this.state.txnMatrix.slice();
      const row = matrix[rowIndex].slice() as TxnArray;
      if (typeof row[columnIndex] === 'number') {
        row[columnIndex] = parseInt(value);
      } else {
        row[columnIndex] = value;
      }
      matrix[rowIndex] = row;
      this.setState(
        () => ({
          txnMatrix: matrix,
        }),
        () => this.updateRow(rowIndex, columnIndex),
      );
    };
  }

  copyCell(row: number, col: number) {
    return `${this.state.txnMatrix[row][col]},`;
  }

  getCellData(rowIndex: number, columnIndex: number) {
    const sortedRowIndex = this.state.sortedIndexMap[rowIndex];
    if (sortedRowIndex != null) {
      rowIndex = sortedRowIndex;
    }
    let value = this.state.txnMatrix[rowIndex][columnIndex];
    if (this.state.columnNames[columnIndex] === 'Amount') {
      value = `$${value}`;
      if (!value.includes('.')) {
        value = `${value}.00`;
      }
    } /*else if (this.state.columnNames[columnIndex] === 'Owner Name') {
      value = 'XXXXXXXXX';
    }*/
    return value;
  }

  testFunc(context: IMenuContext) {
    console.log(context);
    console.log(context.getTarget());
  }

  renderBodyContextMenu(context: IMenuContext) {
    return (
      <Menu>
        <CopyCellsMenuItem
          context={context}
          getCellData={this.getCellData}
          text="Copy"
        />
      </Menu>
    );
  }

  sortColumn(
    columnIndex: number,
    comparator: (a: any, b: any) => number,
    dir: string,
  ) {
    const { txnMatrix } = this.state;
    const sortedIndexMap = Utils.times(txnMatrix.length, i => i);
    sortedIndexMap.sort((a: number, b: number) => {
      return comparator(txnMatrix[a][columnIndex], txnMatrix[b][columnIndex]);
    });
    this.setState({ sortedIndexMap, sortedColumn: columnIndex, sortDir: dir });
  }

  sortAndSet(comparator: (a: any, b: any) => number, txnMatrix: TxnArray[]) {
    const sortedIndexMap = Utils.times(txnMatrix.length, i => i);
    sortedIndexMap.sort((a: number, b: number) => {
      return comparator(
        txnMatrix[a][this.state.sortedColumn],
        txnMatrix[b][this.state.sortedColumn],
      );
    });
    this.setState({ sortedIndexMap, txnMatrix, isLoading: false });
  }

  async componentDidMount() {
    await this.getUserData();
    await this.fetchTxnMatrix();
  }

  render() {
    const columns = this.state.columns.map(col =>
      col.getColumn(this.getCellData, this.sortColumn, this.setCellValue),
    );
    return (
      <div>
        <Button
          alignText="right"
          onClick={this.prevPage}
          disabled={this.state.page === 0}
        >
          Prev
        </Button>
        <span>Page {this.state.page + 1}</span>
        <Button alignText="left" onClick={this.nextPage}>
          Next
        </Button>
        <Table
          numRows={this.state.txnMatrix.length}
          getCellClipboardData={this.copyCell}
          bodyContextMenuRenderer={this.renderBodyContextMenu}
          selectionModes={SelectionModes.COLUMNS_AND_CELLS}
          enableColumnInteractionBar
        >
          {columns}
        </Table>
      </div>
    );
  }
}

function stringSortAsc(a: any, b: any) {
  return a.toString().localeCompare(b);
}

function stringSortDesc(a: any, b: any) {
  return b.toString().localeCompare(a);
}

function numberSortAsc(a: any, b: any) {
  return a - b;
}

function numberSortDesc(a: any, b: any) {
  return b - a;
}

function updateReqObj(reqObj: Txn, columnName: string, value: any): Txn {
  const propName = columnName.split(' ').join('');
  const methodName = `set${propName}`;
  console.log(methodName, reqObj.hasOwnProperty('setVendor'));
  //@ts-ignore
  reqObj[methodName](value);
  reqObj.setFieldMaskList([propName]);
  return reqObj;
}
