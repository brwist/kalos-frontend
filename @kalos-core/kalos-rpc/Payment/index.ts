import { grpc } from '@improbable-eng/grpc-web';
import { PaymentService } from '../compiled-protos/payment_pb_service';
import { Payment, PaymentList } from '../compiled-protos/payment_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class PaymentClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: Payment) {
    return new Promise<Payment>((resolve, reject) => {
      const opts: UnaryRpcOptions<Payment, Payment> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PaymentService.Create, opts);
    });
  }

  public async Get(req: Payment) {
    return new Promise<Payment>((resolve, reject) => {
      const opts: UnaryRpcOptions<Payment, Payment> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PaymentService.Get, opts);
    });
  }

  public async List(req: Payment, cb: (arg: Payment) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<Payment, Payment> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: Payment) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(PaymentService.List, opts);
    });
  }

  public async Update(req: Payment) {
    return new Promise<Payment>((resolve, reject) => {
      const opts: UnaryRpcOptions<Payment, Payment> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PaymentService.Update, opts);
    });
  }

  public async Delete(req: Payment) {
    return new Promise<Payment>((resolve, reject) => {
      const opts: UnaryRpcOptions<Payment, Payment> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PaymentService.Delete, opts);
    });
  }

  public async BatchGet(req: Payment) {
    return new Promise<PaymentList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Payment, PaymentList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<PaymentList>) => {
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
      grpc.unary(PaymentService.BatchGet, opts);
    });
  }
}

export { Payment, PaymentList, PaymentClient };
