import { grpc } from '@improbable-eng/grpc-web';
import { PendingInvoiceTransactionService } from '../compiled-protos/pending_invoice_transaction_pb_service';
import {
  PendingInvoiceTransaction,
  PendingInvoiceTransactionList,
} from '../compiled-protos/pending_invoice_transaction_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { BaseClient } from '../BaseClient';

class PendingInvoiceTransactionClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: PendingInvoiceTransaction) {
    return new Promise<PendingInvoiceTransaction>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        PendingInvoiceTransaction,
        PendingInvoiceTransaction
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PendingInvoiceTransactionService.Create, opts);
    });
  }

  public async Get(req: PendingInvoiceTransaction) {
    return new Promise<PendingInvoiceTransaction>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        PendingInvoiceTransaction,
        PendingInvoiceTransaction
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PendingInvoiceTransactionService.Get, opts);
    });
  }

  public async Update(req: PendingInvoiceTransaction) {
    return new Promise<PendingInvoiceTransaction>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        PendingInvoiceTransaction,
        PendingInvoiceTransaction
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PendingInvoiceTransactionService.Update, opts);
    });
  }

  public async Delete(req: PendingInvoiceTransaction) {
    return new Promise<PendingInvoiceTransaction>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        PendingInvoiceTransaction,
        PendingInvoiceTransaction
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PendingInvoiceTransactionService.Delete, opts);
    });
  }

  public async BatchGet(req: PendingInvoiceTransaction) {
    return new Promise<PendingInvoiceTransactionList>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        PendingInvoiceTransaction,
        PendingInvoiceTransactionList
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<PendingInvoiceTransactionList>) => {
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
      grpc.unary(PendingInvoiceTransactionService.BatchGet, opts);
    });
  }
}

export {
  PendingInvoiceTransaction,
  PendingInvoiceTransactionList,
  PendingInvoiceTransactionClient,
};
