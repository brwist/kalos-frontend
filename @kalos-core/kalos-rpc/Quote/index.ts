import { grpc } from '@improbable-eng/grpc-web';
import { QuoteService } from '../compiled-protos/quote_pb_service';
import { Quote, QuoteList } from '../compiled-protos/quote_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class QuoteClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: Quote) {
    return new Promise<Quote>((resolve, reject) => {
      const opts: UnaryRpcOptions<Quote, Quote> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuoteService.Create, opts);
    });
  }

  public async Get(req: Quote) {
    return new Promise<Quote>((resolve, reject) => {
      const opts: UnaryRpcOptions<Quote, Quote> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuoteService.Get, opts);
    });
  }

  public async List(req: Quote, cb: (arg: Quote) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<Quote, Quote> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: Quote) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(QuoteService.List, opts);
    });
  }

  public async Update(req: Quote) {
    return new Promise<Quote>((resolve, reject) => {
      const opts: UnaryRpcOptions<Quote, Quote> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuoteService.Update, opts);
    });
  }

  public async Delete(req: Quote) {
    return new Promise<Quote>((resolve, reject) => {
      const opts: UnaryRpcOptions<Quote, Quote> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuoteService.Delete, opts);
    });
  }

  public async BatchGet(req: Quote) {
    return new Promise<QuoteList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Quote, QuoteList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<QuoteList>) => {
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
      grpc.unary(QuoteService.BatchGet, opts);
    });
  }
}

export { Quote, QuoteList, QuoteClient };
