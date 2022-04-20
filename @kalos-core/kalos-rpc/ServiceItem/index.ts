import { grpc } from '@improbable-eng/grpc-web';
import { ServiceItemService } from '../compiled-protos/service_item_pb_service';
import {
  ServiceItem,
  ServiceItemList,
} from '../compiled-protos/service_item_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class ServiceItemClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: ServiceItem) {
    return new Promise<ServiceItem>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceItem, ServiceItem> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServiceItemService.Create, opts);
    });
  }

  public async Get(req: ServiceItem) {
    return new Promise<ServiceItem>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceItem, ServiceItem> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServiceItemService.Get, opts);
    });
  }

  public async List(req: ServiceItem, cb: (arg: ServiceItem) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<ServiceItem, ServiceItem> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: ServiceItem) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(ServiceItemService.List, opts);
    });
  }

  public async Update(req: ServiceItem) {
    return new Promise<ServiceItem>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceItem, ServiceItem> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServiceItemService.Update, opts);
    });
  }

  public async Delete(req: ServiceItem) {
    return new Promise<ServiceItem>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceItem, ServiceItem> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServiceItemService.Delete, opts);
    });
  }

  public async BatchGet(req: ServiceItem) {
    return new Promise<ServiceItemList>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceItem, ServiceItemList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<ServiceItemList>) => {
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
      grpc.unary(ServiceItemService.BatchGet, opts);
    });
  }
}

export { ServiceItem, ServiceItemList, ServiceItemClient };
