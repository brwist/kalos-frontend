import { grpc } from '@improbable-eng/grpc-web';
import { PendingBillingService } from '../compiled-protos/pending_billing_pb_service';
import {
  PendingBilling,
  PendingBillingList,
} from '../compiled-protos/pending_billing_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class PendingBillingClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Get(req: PendingBilling) {
    return new Promise<PendingBilling>((resolve, reject) => {
      const opts: UnaryRpcOptions<PendingBilling, PendingBilling> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PendingBillingService.Get, opts);
    });
  }

  public async List(req: PendingBilling, cb: (arg: PendingBilling) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<PendingBilling, PendingBilling> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: PendingBilling) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(PendingBillingService.List, opts);
    });
  }

  public async BatchGet(req: PendingBilling) {
    return new Promise<PendingBillingList>((resolve, reject) => {
      const opts: UnaryRpcOptions<PendingBilling, PendingBillingList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<PendingBillingList>) => {
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
      grpc.unary(PendingBillingService.BatchGet, opts);
    });
  }
}

export { PendingBilling, PendingBillingList, PendingBillingClient };
