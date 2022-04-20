import { grpc } from '@improbable-eng/grpc-web';
import { VendorOrderService } from '../compiled-protos/vendor_order_pb_service';
import {
  VendorOrder,
  VendorOrderList,
} from '../compiled-protos/vendor_order_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class VendorOrderClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: VendorOrder) {
    return new Promise<VendorOrder>((resolve, reject) => {
      const opts: UnaryRpcOptions<VendorOrder, VendorOrder> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(VendorOrderService.Create, opts);
    });
  }

  public async Get(req: VendorOrder) {
    return new Promise<VendorOrder>((resolve, reject) => {
      const opts: UnaryRpcOptions<VendorOrder, VendorOrder> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(VendorOrderService.Get, opts);
    });
  }

  public async List(req: VendorOrder, cb: (arg: VendorOrder) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<VendorOrder, VendorOrder> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: VendorOrder) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(VendorOrderService.List, opts);
    });
  }

  public async Update(req: VendorOrder) {
    return new Promise<VendorOrder>((resolve, reject) => {
      const opts: UnaryRpcOptions<VendorOrder, VendorOrder> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(VendorOrderService.Update, opts);
    });
  }

  public async Delete(req: VendorOrder) {
    return new Promise<VendorOrder>((resolve, reject) => {
      const opts: UnaryRpcOptions<VendorOrder, VendorOrder> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(VendorOrderService.Delete, opts);
    });
  }

  public async BatchGet(req: VendorOrder) {
    return new Promise<VendorOrderList>((resolve, reject) => {
      const opts: UnaryRpcOptions<VendorOrder, VendorOrderList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<VendorOrderList>) => {
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
      grpc.unary(VendorOrderService.BatchGet, opts);
    });
  }
}

export { VendorOrder, VendorOrderList, VendorOrderClient };
