import { grpc } from '@improbable-eng/grpc-web';
import { ServiceItemMaterialService } from '../compiled-protos/service_item_material_pb_service';
import {
  ServiceItemMaterial,
  ServiceItemMaterialList,
} from '../compiled-protos/service_item_material_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class ServiceItemMaterialClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: ServiceItemMaterial) {
    return new Promise<ServiceItemMaterial>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceItemMaterial, ServiceItemMaterial> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServiceItemMaterialService.Create, opts);
    });
  }

  public async Get(req: ServiceItemMaterial) {
    return new Promise<ServiceItemMaterial>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceItemMaterial, ServiceItemMaterial> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServiceItemMaterialService.Get, opts);
    });
  }

  public async List(
    req: ServiceItemMaterial,
    cb: (arg: ServiceItemMaterial) => void
  ) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<ServiceItemMaterial, ServiceItemMaterial> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: ServiceItemMaterial) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(ServiceItemMaterialService.List, opts);
    });
  }

  public async Update(req: ServiceItemMaterial) {
    return new Promise<ServiceItemMaterial>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceItemMaterial, ServiceItemMaterial> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServiceItemMaterialService.Update, opts);
    });
  }

  public async Delete(req: ServiceItemMaterial) {
    return new Promise<ServiceItemMaterial>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceItemMaterial, ServiceItemMaterial> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServiceItemMaterialService.Delete, opts);
    });
  }

  public async BatchGet(req: ServiceItemMaterial) {
    return new Promise<ServiceItemMaterialList>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        ServiceItemMaterial,
        ServiceItemMaterialList
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<ServiceItemMaterialList>) => {
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
      grpc.unary(ServiceItemMaterialService.BatchGet, opts);
    });
  }
}

export {
  ServiceItemMaterial,
  ServiceItemMaterialList,
  ServiceItemMaterialClient,
};
