import { grpc } from '@improbable-eng/grpc-web';
import { FirstCallService } from '../compiled-protos/first_call_pb_service';
import { FirstCall, FirstCallList } from '../compiled-protos/first_call_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class FirstCallClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: FirstCall) {
    return new Promise<FirstCall>((resolve, reject) => {
      const opts: UnaryRpcOptions<FirstCall, FirstCall> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(FirstCallService.Create, opts);
    });
  }

  public async Get(req: FirstCall) {
    return new Promise<FirstCall>((resolve, reject) => {
      const opts: UnaryRpcOptions<FirstCall, FirstCall> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(FirstCallService.Get, opts);
    });
  }

  public async List(req: FirstCall, cb: (arg: FirstCall) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<FirstCall, FirstCall> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: FirstCall) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(FirstCallService.List, opts);
    });
  }

  public async Update(req: FirstCall) {
    return new Promise<FirstCall>((resolve, reject) => {
      const opts: UnaryRpcOptions<FirstCall, FirstCall> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(FirstCallService.Update, opts);
    });
  }

  public async Delete(req: FirstCall) {
    return new Promise<FirstCall>((resolve, reject) => {
      const opts: UnaryRpcOptions<FirstCall, FirstCall> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(FirstCallService.Delete, opts);
    });
  }

  public async BatchGet(req: FirstCall) {
    return new Promise<FirstCallList>((resolve, reject) => {
      const opts: UnaryRpcOptions<FirstCall, FirstCallList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<FirstCallList>) => {
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
      grpc.unary(FirstCallService.BatchGet, opts);
    });
  }
}

export { FirstCall, FirstCallList, FirstCallClient };
