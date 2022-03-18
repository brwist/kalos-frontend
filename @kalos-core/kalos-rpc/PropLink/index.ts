import { grpc } from '@improbable-eng/grpc-web';
import { PropLinkService } from '../compiled-protos/prop_link_pb_service';
import { PropLink, PropLinkList } from '../compiled-protos/prop_link_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class PropLinkClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: PropLink) {
    return new Promise<PropLink>((resolve, reject) => {
      const opts: UnaryRpcOptions<PropLink, PropLink> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PropLinkService.Create, opts);
    });
  }

  public async Get(req: PropLink) {
    return new Promise<PropLink>((resolve, reject) => {
      const opts: UnaryRpcOptions<PropLink, PropLink> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PropLinkService.Get, opts);
    });
  }

  public async List(req: PropLink, cb: (arg: PropLink) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<PropLink, PropLink> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: PropLink) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(PropLinkService.List, opts);
    });
  }

  public async Update(req: PropLink) {
    return new Promise<PropLink>((resolve, reject) => {
      const opts: UnaryRpcOptions<PropLink, PropLink> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PropLinkService.Update, opts);
    });
  }

  public async Delete(req: PropLink) {
    return new Promise<PropLink>((resolve, reject) => {
      const opts: UnaryRpcOptions<PropLink, PropLink> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PropLinkService.Delete, opts);
    });
  }

  public async BatchGet(req: PropLink) {
    return new Promise<PropLinkList>((resolve, reject) => {
      const opts: UnaryRpcOptions<PropLink, PropLinkList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<PropLinkList>) => {
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
      grpc.unary(PropLinkService.BatchGet, opts);
    });
  }
}

export { PropLink, PropLinkList, PropLinkClient };
