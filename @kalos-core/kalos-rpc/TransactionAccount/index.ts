import { grpc } from '@improbable-eng/grpc-web';
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

class TransactionAccountClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: TransactionAccount) {
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

  public async Get(req: TransactionAccount) {
    return new Promise<TransactionAccount>((resolve, reject) => {
      const opts: UnaryRpcOptions<TransactionAccount, TransactionAccount> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TransactionAccountService.Get, opts);
    });
  }

  public async List(
    req: TransactionAccount,
    cb: (arg: TransactionAccount) => void
  ) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<TransactionAccount, TransactionAccount> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: TransactionAccount) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(TransactionAccountService.List, opts);
    });
  }

  public async Update(req: TransactionAccount) {
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

  public async Delete(req: TransactionAccount) {
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

  public async BatchGet(req: TransactionAccount) {
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
      grpc.unary(TransactionAccountService.BatchGet, opts);
    });
  }
}

export { TransactionAccount, TransactionAccountList, TransactionAccountClient };
