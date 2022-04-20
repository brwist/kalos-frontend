import { grpc } from '@improbable-eng/grpc-web';
import { PromptPaymentOverrideService } from '../compiled-protos/prompt_payment_override_pb_service';
import {
  PromptPaymentOverride,
  PromptPaymentOverrideList,
} from '../compiled-protos/prompt_payment_override_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class PromptPaymentOverrideClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: PromptPaymentOverride) {
    return new Promise<PromptPaymentOverride>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        PromptPaymentOverride,
        PromptPaymentOverride
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PromptPaymentOverrideService.Create, opts);
    });
  }

  public async Get(req: PromptPaymentOverride) {
    return new Promise<PromptPaymentOverride>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        PromptPaymentOverride,
        PromptPaymentOverride
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PromptPaymentOverrideService.Get, opts);
    });
  }

  public async List(
    req: PromptPaymentOverride,
    cb: (arg: PromptPaymentOverride) => void
  ) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<
        PromptPaymentOverride,
        PromptPaymentOverride
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: PromptPaymentOverride) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(PromptPaymentOverrideService.List, opts);
    });
  }

  public async Update(req: PromptPaymentOverride) {
    return new Promise<PromptPaymentOverride>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        PromptPaymentOverride,
        PromptPaymentOverride
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PromptPaymentOverrideService.Update, opts);
    });
  }

  public async Delete(req: PromptPaymentOverride) {
    return new Promise<PromptPaymentOverride>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        PromptPaymentOverride,
        PromptPaymentOverride
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PromptPaymentOverrideService.Delete, opts);
    });
  }

  public async BatchGet(req: PromptPaymentOverride) {
    return new Promise<PromptPaymentOverrideList>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        PromptPaymentOverride,
        PromptPaymentOverrideList
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<PromptPaymentOverrideList>) => {
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
      grpc.unary(PromptPaymentOverrideService.BatchGet, opts);
    });
  }
}

export {
  PromptPaymentOverride,
  PromptPaymentOverrideList,
  PromptPaymentOverrideClient,
};
