import { grpc } from '@improbable-eng/grpc-web';
import { TransactionActivityService } from '../compiled-protos/transaction_activity_pb_service';
import {
  MergeTransactionIds,
  TransactionActivity,
  TransactionActivityList,
} from '../compiled-protos/transaction_activity_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';
import { Empty } from '../compiled-protos/common_pb';

class TransactionActivityClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: TransactionActivity) {
    return new Promise<TransactionActivity>((resolve, reject) => {
      const opts: UnaryRpcOptions<TransactionActivity, TransactionActivity> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TransactionActivityService.Create, opts);
    });
  }

  public async Get(req: TransactionActivity) {
    return new Promise<TransactionActivity>((resolve, reject) => {
      const opts: UnaryRpcOptions<TransactionActivity, TransactionActivity> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TransactionActivityService.Get, opts);
    });
  }

  public async List(
    req: TransactionActivity,
    cb: (arg: TransactionActivity) => void
  ) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<TransactionActivity, TransactionActivity> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: TransactionActivity) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(TransactionActivityService.List, opts);
    });
  }

  public async Update(req: TransactionActivity) {
    return new Promise<TransactionActivity>((resolve, reject) => {
      const opts: UnaryRpcOptions<TransactionActivity, TransactionActivity> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TransactionActivityService.Update, opts);
    });
  }
  public async MergeTransactionLogs(req: MergeTransactionIds) {
    return new Promise<Empty>((resolve, reject) => {
      const opts: UnaryRpcOptions<MergeTransactionIds, Empty> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TransactionActivityService.MergeTransactionActivityLogs, opts);
    });
  }
  public async Delete(req: TransactionActivity) {
    return new Promise<TransactionActivity>((resolve, reject) => {
      const opts: UnaryRpcOptions<TransactionActivity, TransactionActivity> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TransactionActivityService.Delete, opts);
    });
  }

  public async BatchGet(req: TransactionActivity) {
    return new Promise<TransactionActivityList>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        TransactionActivity,
        TransactionActivityList
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TransactionActivityList>) => {
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
      grpc.unary(TransactionActivityService.BatchGet, opts);
    });
  }
}

export {
  TransactionActivity,
  TransactionActivityList,
  TransactionActivityClient,
};
