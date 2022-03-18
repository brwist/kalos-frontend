import { grpc } from '@improbable-eng/grpc-web';
import { StoredQuoteService } from '../compiled-protos/stored_quote_pb_service';
import {
  StoredQuote,
  StoredQuoteList,
} from '../compiled-protos/stored_quote_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class StoredQuoteClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: StoredQuote) {
    return new Promise<StoredQuote>((resolve, reject) => {
      const opts: UnaryRpcOptions<StoredQuote, StoredQuote> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(StoredQuoteService.Create, opts);
    });
  }

  public async Get(req: StoredQuote) {
    return new Promise<StoredQuote>((resolve, reject) => {
      const opts: UnaryRpcOptions<StoredQuote, StoredQuote> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(StoredQuoteService.Get, opts);
    });
  }

  public async List(req: StoredQuote, cb: (arg: StoredQuote) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<StoredQuote, StoredQuote> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: StoredQuote) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(StoredQuoteService.List, opts);
    });
  }

  public async Update(req: StoredQuote) {
    return new Promise<StoredQuote>((resolve, reject) => {
      const opts: UnaryRpcOptions<StoredQuote, StoredQuote> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(StoredQuoteService.Update, opts);
    });
  }

  public async Delete(req: StoredQuote) {
    return new Promise<StoredQuote>((resolve, reject) => {
      const opts: UnaryRpcOptions<StoredQuote, StoredQuote> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(StoredQuoteService.Delete, opts);
    });
  }

  public async BatchGet(req: StoredQuote) {
    return new Promise<StoredQuoteList>((resolve, reject) => {
      const opts: UnaryRpcOptions<StoredQuote, StoredQuoteList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<StoredQuoteList>) => {
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
      grpc.unary(StoredQuoteService.BatchGet, opts);
    });
  }

  /**
   * Returns loaded StoredQuotes
   * @returns StoredQuote[]
   */
  public async loadStoredQuotes() {
    const results: StoredQuote[] = [];
    const req = new StoredQuote();
    for (let page = 0; ; page += 1) {
      req.setPageNumber(page);
      const res = await this.BatchGet(req);
      const resultsList = res.getResultsList();
      const totalCount = res.getTotalCount();
      results.push(...resultsList);
      if (results.length === totalCount) break;
    }
    return results.sort((a, b) => {
      const A = a
        .getDescription()
        .toLocaleLowerCase()
        .trim();
      const B = b
        .getDescription()
        .toLocaleLowerCase()
        .trim();
      if (A > B) return 1;
      if (A < B) return -1;
      return 0;
    });
  }
}

export { StoredQuote, StoredQuoteList, StoredQuoteClient };
