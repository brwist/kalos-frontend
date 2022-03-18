import { grpc } from '@improbable-eng/grpc-web';
import { RemoteIdentityService } from '../compiled-protos/remote_identity_pb_service';
import {
  RemoteIdentity,
  RemoteIdentityList,
} from '../compiled-protos/remote_identity_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class RemoteIdentityClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: RemoteIdentity) {
    return new Promise<RemoteIdentity>((resolve, reject) => {
      const opts: UnaryRpcOptions<RemoteIdentity, RemoteIdentity> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(RemoteIdentityService.Create, opts);
    });
  }

  public async Get(req: RemoteIdentity) {
    return new Promise<RemoteIdentity>((resolve, reject) => {
      const opts: UnaryRpcOptions<RemoteIdentity, RemoteIdentity> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(RemoteIdentityService.Get, opts);
    });
  }

  public async List(req: RemoteIdentity, cb: (arg: RemoteIdentity) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<RemoteIdentity, RemoteIdentity> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: RemoteIdentity) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(RemoteIdentityService.List, opts);
    });
  }

  public async Update(req: RemoteIdentity) {
    return new Promise<RemoteIdentity>((resolve, reject) => {
      const opts: UnaryRpcOptions<RemoteIdentity, RemoteIdentity> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(RemoteIdentityService.Update, opts);
    });
  }

  public async Delete(req: RemoteIdentity) {
    return new Promise<RemoteIdentity>((resolve, reject) => {
      const opts: UnaryRpcOptions<RemoteIdentity, RemoteIdentity> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(RemoteIdentityService.Delete, opts);
    });
  }

  public async BatchGet(req: RemoteIdentity) {
    return new Promise<RemoteIdentityList>((resolve, reject) => {
      const opts: UnaryRpcOptions<RemoteIdentity, RemoteIdentityList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<RemoteIdentityList>) => {
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
      grpc.unary(RemoteIdentityService.BatchGet, opts);
    });
  }
}

export { RemoteIdentity, RemoteIdentityList, RemoteIdentityClient };
