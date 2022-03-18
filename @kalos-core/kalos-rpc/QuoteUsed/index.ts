import { grpc } from '@improbable-eng/grpc-web';
import { QuoteUsedService } from '../compiled-protos/quote_used_pb_service';
import { QuoteUsed, QuoteUsedList } from '../compiled-protos/quote_used_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class QuoteUsedClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: QuoteUsed) {
    return new Promise<QuoteUsed>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuoteUsed, QuoteUsed> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuoteUsedService.Create, opts);
    });
  }

  public async Get(req: QuoteUsed) {
    return new Promise<QuoteUsed>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuoteUsed, QuoteUsed> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuoteUsedService.Get, opts);
    });
  }

  public async List(req: QuoteUsed, cb: (arg: QuoteUsed) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<QuoteUsed, QuoteUsed> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: QuoteUsed) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(QuoteUsedService.List, opts);
    });
  }

  public async Update(req: QuoteUsed) {
    return new Promise<QuoteUsed>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuoteUsed, QuoteUsed> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuoteUsedService.Update, opts);
    });
  }

  public async Delete(req: QuoteUsed) {
    return new Promise<QuoteUsed>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuoteUsed, QuoteUsed> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuoteUsedService.Delete, opts);
    });
  }

  public async BatchGet(req: QuoteUsed) {
    return new Promise<QuoteUsedList>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuoteUsed, QuoteUsedList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<QuoteUsedList>) => {
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
      grpc.unary(QuoteUsedService.BatchGet, opts);
    });
  }
}

export { QuoteUsed, QuoteUsedList, QuoteUsedClient };
