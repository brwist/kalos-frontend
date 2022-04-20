import { grpc } from '@improbable-eng/grpc-web';
import { SiLinkService } from '../compiled-protos/si_link_pb_service';
import { SiLink, SiLinkList } from '../compiled-protos/si_link_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class SiLinkClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: SiLink) {
    return new Promise<SiLink>((resolve, reject) => {
      const opts: UnaryRpcOptions<SiLink, SiLink> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SiLinkService.Create, opts);
    });
  }

  public async Get(req: SiLink) {
    return new Promise<SiLink>((resolve, reject) => {
      const opts: UnaryRpcOptions<SiLink, SiLink> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SiLinkService.Get, opts);
    });
  }

  public async List(req: SiLink, cb: (arg: SiLink) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<SiLink, SiLink> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: SiLink) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(SiLinkService.List, opts);
    });
  }

  public async Update(req: SiLink) {
    return new Promise<SiLink>((resolve, reject) => {
      const opts: UnaryRpcOptions<SiLink, SiLink> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SiLinkService.Update, opts);
    });
  }

  public async Delete(req: SiLink) {
    return new Promise<SiLink>((resolve, reject) => {
      const opts: UnaryRpcOptions<SiLink, SiLink> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SiLinkService.Delete, opts);
    });
  }

  public async BatchGet(req: SiLink) {
    return new Promise<SiLinkList>((resolve, reject) => {
      const opts: UnaryRpcOptions<SiLink, SiLinkList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<SiLinkList>) => {
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
      grpc.unary(SiLinkService.BatchGet, opts);
    });
  }
}

export { SiLink, SiLinkList, SiLinkClient };
