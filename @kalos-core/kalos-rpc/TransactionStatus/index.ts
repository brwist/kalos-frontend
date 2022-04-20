import { grpc } from '@improbable-eng/grpc-web';
import { TransactionStatusService } from '../compiled-protos/transaction_status_pb_service';
import {
  TransactionStatus,
  TransactionStatusList,
} from '../compiled-protos/transaction_status_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';
import { S3Client } from '../S3File';

class TransactionStatusClient extends BaseClient {
  S3: S3Client;
  constructor(host?: string, userID?: number) {
    super(host, userID);
    this.S3 = new S3Client(host, userID);
  }

  public async Get(req: TransactionStatus) {
    return new Promise<TransactionStatus>((resolve, reject) => {
      const opts: UnaryRpcOptions<TransactionStatus, TransactionStatus> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TransactionStatusService.Get, opts);
    });
  }

  public async List(
    req: TransactionStatus,
    cb: (arg: TransactionStatus) => void
  ) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<TransactionStatus, TransactionStatus> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: TransactionStatus) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(TransactionStatusService.List, opts);
    });
  }

  public async BatchGet(req: TransactionStatus) {
    return new Promise<TransactionStatusList>((resolve, reject) => {
      const opts: UnaryRpcOptions<TransactionStatus, TransactionStatusList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TransactionStatusList>) => {
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
      grpc.unary(TransactionStatusService.BatchGet, opts);
    });
  }
}

export { TransactionStatus, TransactionStatusList, TransactionStatusClient };
