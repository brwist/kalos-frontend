import { grpc } from '@improbable-eng/grpc-web';
import { TransactionService } from '../compiled-protos/transaction_pb_service';
import {
  Transaction,
  TransactionList,
  RecordPageReq,
} from '../compiled-protos/transaction_pb';
import { TransactionAccountService } from '../compiled-protos/transaction_account_pb_service';
import {
  TransactionAccount,
  TransactionAccountList,
} from '../compiled-protos/transaction_account_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class TransactionClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: Transaction) {
    return new Promise<Transaction>((resolve, reject) => {
      const opts: UnaryRpcOptions<Transaction, Transaction> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TransactionService.Create, opts);
    });
  }

  public async Get(req: Transaction) {
    return new Promise<Transaction>((resolve, reject) => {
      const opts: UnaryRpcOptions<Transaction, Transaction> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TransactionService.Get, opts);
    });
  }

  public async List(req: Transaction, cb: (arg: Transaction) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<Transaction, Transaction> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: Transaction) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(TransactionService.List, opts);
    });
  }

  public async Update(req: Transaction) {
    return new Promise<Transaction>((resolve, reject) => {
      const opts: UnaryRpcOptions<Transaction, Transaction> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TransactionService.Update, opts);
    });
  }

  public async Delete(req: Transaction) {
    return new Promise<Transaction>((resolve, reject) => {
      const opts: UnaryRpcOptions<Transaction, Transaction> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TransactionService.Delete, opts);
    });
  }

  public async BatchGet(req: Transaction) {
    return new Promise<TransactionList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Transaction, TransactionList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TransactionList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            if (
              result.statusMessage.toLowerCase() ===
              'response closed without headers'
            ) {
              return this.BatchGet(req);
            } else {
              reject(new Error(result.statusMessage));
            }
          }
        },
      };
      grpc.unary(TransactionService.BatchGet, opts);
    });
  }

  public async RecordPage(req: RecordPageReq) {
    return new Promise<TransactionList>((resolve, reject) => {
      const opts: UnaryRpcOptions<RecordPageReq, TransactionList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TransactionList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(TransactionService.RecordPage, opts);
    });
  }

  public async Search(req: Transaction) {
    return new Promise<TransactionList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Transaction, TransactionList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TransactionList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(TransactionService.Search, opts);
    });
  }

  public async CreateTransactionAccount(req: TransactionAccount) {
    return new Promise<TransactionAccount>((resolve, reject) => {
      const opts: UnaryRpcOptions<TransactionAccount, TransactionAccount> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TransactionAccountService.Create, opts);
    });
  }

  public async UpdateTransactionAccount(req: TransactionAccount) {
    return new Promise<TransactionAccount>((resolve, reject) => {
      const opts: UnaryRpcOptions<TransactionAccount, TransactionAccount> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TransactionAccountService.Update, opts);
    });
  }

  public async DeleteTransactionAccount(req: TransactionAccount) {
    return new Promise<TransactionAccount>((resolve, reject) => {
      const opts: UnaryRpcOptions<TransactionAccount, TransactionAccount> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TransactionAccountService.Delete, opts);
    });
  }

  public async BatchGetTransactionAccount(req: TransactionAccount) {
    return new Promise<TransactionAccountList>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        TransactionAccount,
        TransactionAccountList
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TransactionAccountList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(TransactionAccountService.BatchGet, opts);
    });
  }

  /**
   *
   * @param userID a valid employee userID
   * @returns An array containing all rejected receipts corresponding to userID
   */
  public async getRejectedTxnByUserID(userID: number): Promise<Transaction[]> {
    const req = new Transaction();
    req.setStatusId(4);
    req.setOwnerId(userID);
    const result = await this.BatchGet(req);
    return result.getResultsList();
  }
  /**
   *
   * @param userID A valid employee userID
   * @returns An array containing a boolean value and human readable string message
   * @example [false, "All transactions are resolved"]
   */
  public async timesheetCheck(userID: number): Promise<[boolean, string]> {
    const onTimeout = checkTimeout();
    try {
      if (!onTimeout) {
        const txn = new Transaction();
        txn.setOwnerId(userID);
        txn.setStatusId(1);
        txn.setIsActive(1);
        const newTxn = await this.Get(txn);
        if (newTxn.getId() !== 0) {
          return [
            true,
            'Receipts need review before timesheet can be completed',
          ];
        }
        txn.setStatusId(4);
        const disputeTxn = await this.Get(txn);
        if (disputeTxn.getId() !== 0) {
          return [
            true,
            'Receipts need review before timesheet can be completed',
          ];
        }

        return [false, 'All transactions are resolved'];
      } else {
        return [false, 'User is on 24 hour timeout'];
      }
    } catch (err) {
      return [false, 'No transactions need review'];
    }
  }

  public setTimeout(): void {
    const onTimeout = checkTimeout();
    if (!onTimeout) {
      localStorage.setItem('TIMESHEET_TIMEOUT', `${new Date().valueOf()}`);
    }
  }

  public loadTransactionsByEventId = async (
    eventId: number,
    withoutLimit = false,
    page = 0
  ) => {
    const req = new Transaction();
    req.setJobId(eventId);
    req.setIsActive(1);
    req.setPageNumber(page);
    req.setWithoutLimit(withoutLimit);
    const data = await this.BatchGet(req);
    return data.getResultsList();
  };
}

function txnToArray(txn: Transaction): TxnArray {
  const department = txn.getDepartment();
  let deptName = 'N/A';
  if (department) {
    deptName = department.getDescription();
  }

  const costCenter = txn.getCostCenter();
  let accountName = 'N/A';
  if (costCenter) {
    accountName = costCenter.getDescription();
  }

  return [
    txn.getId(),
    txn.getJobId(),
    deptName,
    txn.getVendor(),
    accountName,
    txn.getDescription(),
    txn.getAmount(),
    txn.getTimestamp(),
    txn.getOwnerName(),
    txn.getNotes(),
  ];
}

type TxnArray = [
  number,
  number,
  string,
  string,
  string,
  string,
  number,
  string,
  string,
  string
];

export {
  Transaction,
  TransactionList,
  TransactionClient,
  TxnArray,
  txnToArray,
};

function checkTimeout(): Boolean {
  const lastTimeout = localStorage.getItem('TIMESHEET_TIMEOUT');
  if (lastTimeout) {
    const lastVal = parseInt(lastTimeout);
    const currVal = new Date().valueOf();
    if (currVal - lastVal > 86400000) {
      return false;
    } else {
      return true;
    }
  }
  return false;
}
