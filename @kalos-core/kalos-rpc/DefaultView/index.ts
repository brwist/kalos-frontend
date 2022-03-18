import { grpc } from '@improbable-eng/grpc-web';
import { DefaultViewService } from '../compiled-protos/default_view_pb_service';
import {
  DefaultView,
  DefaultViewList,
} from '../compiled-protos/default_view_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class DefaultViewClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: DefaultView) {
    return new Promise<DefaultView>((resolve, reject) => {
      const opts: UnaryRpcOptions<DefaultView, DefaultView> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(DefaultViewService.Create, opts);
    });
  }

  public async Get(req: DefaultView) {
    return new Promise<DefaultView>((resolve, reject) => {
      const opts: UnaryRpcOptions<DefaultView, DefaultView> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(DefaultViewService.Get, opts);
    });
  }

  public async List(req: DefaultView, cb: (arg: DefaultView) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<DefaultView, DefaultView> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: DefaultView) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(DefaultViewService.List, opts);
    });
  }

  public async Update(req: DefaultView) {
    return new Promise<DefaultView>((resolve, reject) => {
      const opts: UnaryRpcOptions<DefaultView, DefaultView> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(DefaultViewService.Update, opts);
    });
  }

  public async Delete(req: DefaultView) {
    return new Promise<DefaultView>((resolve, reject) => {
      const opts: UnaryRpcOptions<DefaultView, DefaultView> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(DefaultViewService.Delete, opts);
    });
  }

  public async BatchGet(req: DefaultView) {
    return new Promise<DefaultViewList>((resolve, reject) => {
      const opts: UnaryRpcOptions<DefaultView, DefaultViewList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<DefaultViewList>) => {
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
      grpc.unary(DefaultViewService.BatchGet, opts);
    });
  }
}

export { DefaultView, DefaultViewList, DefaultViewClient };
