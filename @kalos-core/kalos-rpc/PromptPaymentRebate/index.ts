import { grpc } from '@improbable-eng/grpc-web';
import { PromptPaymentRebateService } from '../compiled-protos/prompt_payment_rebate_pb_service';
import {
  PromptPaymentRebate,
  PromptPaymentRebateList,
} from '../compiled-protos/prompt_payment_rebate_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class PromptPaymentRebateClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: PromptPaymentRebate) {
    return new Promise<PromptPaymentRebate>((resolve, reject) => {
      const opts: UnaryRpcOptions<PromptPaymentRebate, PromptPaymentRebate> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PromptPaymentRebateService.Create, opts);
    });
  }

  public async Get(req: PromptPaymentRebate) {
    return new Promise<PromptPaymentRebate>((resolve, reject) => {
      const opts: UnaryRpcOptions<PromptPaymentRebate, PromptPaymentRebate> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PromptPaymentRebateService.Get, opts);
    });
  }

  public async List(
    req: PromptPaymentRebate,
    cb: (arg: PromptPaymentRebate) => void
  ) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<PromptPaymentRebate, PromptPaymentRebate> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: PromptPaymentRebate) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(PromptPaymentRebateService.List, opts);
    });
  }

  public async Update(req: PromptPaymentRebate) {
    return new Promise<PromptPaymentRebate>((resolve, reject) => {
      const opts: UnaryRpcOptions<PromptPaymentRebate, PromptPaymentRebate> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PromptPaymentRebateService.Update, opts);
    });
  }

  public async Delete(req: PromptPaymentRebate) {
    return new Promise<PromptPaymentRebate>((resolve, reject) => {
      const opts: UnaryRpcOptions<PromptPaymentRebate, PromptPaymentRebate> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PromptPaymentRebateService.Delete, opts);
    });
  }

  public async BatchGet(req: PromptPaymentRebate) {
    return new Promise<PromptPaymentRebateList>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        PromptPaymentRebate,
        PromptPaymentRebateList
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<PromptPaymentRebateList>) => {
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
      grpc.unary(PromptPaymentRebateService.BatchGet, opts);
    });
  }
}

export {
  PromptPaymentRebate,
  PromptPaymentRebateList,
  PromptPaymentRebateClient,
};
