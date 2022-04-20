import { grpc } from '@improbable-eng/grpc-web';
import { InvoiceService } from '../compiled-protos/invoice_pb_service';
import { Invoice, InvoiceList } from '../compiled-protos/invoice_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class InvoiceClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: Invoice) {
    return new Promise<Invoice>((resolve, reject) => {
      const opts: UnaryRpcOptions<Invoice, Invoice> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(InvoiceService.Create, opts);
    });
  }

  public async Get(req: Invoice) {
    return new Promise<Invoice>((resolve, reject) => {
      const opts: UnaryRpcOptions<Invoice, Invoice> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(InvoiceService.Get, opts);
    });
  }

  public async List(req: Invoice, cb: (arg: Invoice) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<Invoice, Invoice> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: Invoice) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(InvoiceService.List, opts);
    });
  }

  public async Update(req: Invoice) {
    return new Promise<Invoice>((resolve, reject) => {
      const opts: UnaryRpcOptions<Invoice, Invoice> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(InvoiceService.Update, opts);
    });
  }

  public async Delete(req: Invoice) {
    return new Promise<Invoice>((resolve, reject) => {
      const opts: UnaryRpcOptions<Invoice, Invoice> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(InvoiceService.Delete, opts);
    });
  }

  public async BatchGet(req: Invoice) {
    return new Promise<InvoiceList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Invoice, InvoiceList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<InvoiceList>) => {
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
      grpc.unary(InvoiceService.BatchGet, opts);
    });
  }
}

export { Invoice, InvoiceList, InvoiceClient };
