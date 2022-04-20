import { grpc } from '@improbable-eng/grpc-web';
import { StockVendorService } from '../compiled-protos/stock_vendor_pb_service';
import {
  StockVendor,
  StockVendorList,
} from '../compiled-protos/stock_vendor_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class StockVendorClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: StockVendor) {
    return new Promise<StockVendor>((resolve, reject) => {
      const opts: UnaryRpcOptions<StockVendor, StockVendor> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(StockVendorService.Create, opts);
    });
  }

  public async Get(req: StockVendor) {
    return new Promise<StockVendor>((resolve, reject) => {
      const opts: UnaryRpcOptions<StockVendor, StockVendor> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(StockVendorService.Get, opts);
    });
  }

  public async List(req: StockVendor, cb: (arg: StockVendor) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<StockVendor, StockVendor> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: StockVendor) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(StockVendorService.List, opts);
    });
  }

  public async Update(req: StockVendor) {
    return new Promise<StockVendor>((resolve, reject) => {
      const opts: UnaryRpcOptions<StockVendor, StockVendor> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(StockVendorService.Update, opts);
    });
  }

  public async Delete(req: StockVendor) {
    return new Promise<StockVendor>((resolve, reject) => {
      const opts: UnaryRpcOptions<StockVendor, StockVendor> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(StockVendorService.Delete, opts);
    });
  }

  public async BatchGet(req: StockVendor) {
    return new Promise<StockVendorList>((resolve, reject) => {
      const opts: UnaryRpcOptions<StockVendor, StockVendorList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<StockVendorList>) => {
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
      grpc.unary(StockVendorService.BatchGet, opts);
    });
  }
}

export { StockVendor, StockVendorList, StockVendorClient };
