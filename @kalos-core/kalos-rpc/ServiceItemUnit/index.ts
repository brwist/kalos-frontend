import { grpc } from '@improbable-eng/grpc-web';
import { ServiceItemUnitService } from '../compiled-protos/service_item_unit_pb_service';
import {
  ServiceItemUnit,
  ServiceItemUnitList,
} from '../compiled-protos/service_item_unit_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class ServiceItemUnitClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: ServiceItemUnit) {
    return new Promise<ServiceItemUnit>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceItemUnit, ServiceItemUnit> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServiceItemUnitService.Create, opts);
    });
  }

  public async Get(req: ServiceItemUnit) {
    return new Promise<ServiceItemUnit>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceItemUnit, ServiceItemUnit> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServiceItemUnitService.Get, opts);
    });
  }

  public async List(req: ServiceItemUnit, cb: (arg: ServiceItemUnit) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<ServiceItemUnit, ServiceItemUnit> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: ServiceItemUnit) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(ServiceItemUnitService.List, opts);
    });
  }

  public async Update(req: ServiceItemUnit) {
    return new Promise<ServiceItemUnit>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceItemUnit, ServiceItemUnit> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServiceItemUnitService.Update, opts);
    });
  }

  public async Delete(req: ServiceItemUnit) {
    return new Promise<ServiceItemUnit>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceItemUnit, ServiceItemUnit> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServiceItemUnitService.Delete, opts);
    });
  }

  public async BatchGet(req: ServiceItemUnit) {
    return new Promise<ServiceItemUnitList>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceItemUnit, ServiceItemUnitList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<ServiceItemUnitList>) => {
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
      grpc.unary(ServiceItemUnitService.BatchGet, opts);
    });
  }
}

export { ServiceItemUnit, ServiceItemUnitList, ServiceItemUnitClient };
