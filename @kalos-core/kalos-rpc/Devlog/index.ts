import { grpc } from '@improbable-eng/grpc-web';
import { DevlogService } from '../compiled-protos/devlog_pb_service';
import { Devlog, DevlogList } from '../compiled-protos/devlog_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class DevlogClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: Devlog) {
    return new Promise<Devlog>((resolve, reject) => {
      const opts: UnaryRpcOptions<Devlog, Devlog> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(DevlogService.Create, opts);
    });
  }

  public async Get(req: Devlog) {
    return new Promise<Devlog>((resolve, reject) => {
      const opts: UnaryRpcOptions<Devlog, Devlog> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(DevlogService.Get, opts);
    });
  }

  public async Update(req: Devlog) {
    return new Promise<Devlog>((resolve, reject) => {
      const opts: UnaryRpcOptions<Devlog, Devlog> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(DevlogService.Update, opts);
    });
  }

  public async Delete(req: Devlog) {
    return new Promise<Devlog>((resolve, reject) => {
      const opts: UnaryRpcOptions<Devlog, Devlog> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(DevlogService.Delete, opts);
    });
  }

  public async BatchGet(req: Devlog) {
    return new Promise<DevlogList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Devlog, DevlogList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<DevlogList>) => {
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
      grpc.unary(DevlogService.BatchGet, opts);
    });
  }
}

export { Devlog, DevlogList, DevlogClient };
