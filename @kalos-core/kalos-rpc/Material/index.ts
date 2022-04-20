import { grpc } from '@improbable-eng/grpc-web';
import { MaterialService } from '../compiled-protos/material_pb_service';
import { Material, MaterialList } from '../compiled-protos/material_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class MaterialClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: Material) {
    return new Promise<Material>((resolve, reject) => {
      const opts: UnaryRpcOptions<Material, Material> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(MaterialService.Create, opts);
    });
  }

  public async Get(req: Material) {
    return new Promise<Material>((resolve, reject) => {
      const opts: UnaryRpcOptions<Material, Material> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(MaterialService.Get, opts);
    });
  }

  public async List(req: Material, cb: (arg: Material) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<Material, Material> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: Material) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(MaterialService.List, opts);
    });
  }

  public async Update(req: Material) {
    return new Promise<Material>((resolve, reject) => {
      const opts: UnaryRpcOptions<Material, Material> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(MaterialService.Update, opts);
    });
  }

  public async Delete(req: Material) {
    return new Promise<Material>((resolve, reject) => {
      const opts: UnaryRpcOptions<Material, Material> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(MaterialService.Delete, opts);
    });
  }

  public async BatchGet(req: Material) {
    return new Promise<MaterialList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Material, MaterialList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<MaterialList>) => {
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
      grpc.unary(MaterialService.BatchGet, opts);
    });
  }
}

export { Material, MaterialList, MaterialClient };
