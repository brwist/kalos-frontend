import { grpc } from '@improbable-eng/grpc-web';
import { QuotePartService } from '../compiled-protos/quote_part_pb_service';
import { QuotePart, QuotePartList } from '../compiled-protos/quote_part_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class QuotePartClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: QuotePart) {
    return new Promise<QuotePart>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuotePart, QuotePart> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuotePartService.Create, opts);
    });
  }

  public async Get(req: QuotePart) {
    return new Promise<QuotePart>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuotePart, QuotePart> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuotePartService.Get, opts);
    });
  }

  public async List(req: QuotePart, cb: (arg: QuotePart) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<QuotePart, QuotePart> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: QuotePart) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(QuotePartService.List, opts);
    });
  }

  public async Update(req: QuotePart) {
    return new Promise<QuotePart>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuotePart, QuotePart> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuotePartService.Update, opts);
    });
  }

  public async Delete(req: QuotePart) {
    return new Promise<QuotePart>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuotePart, QuotePart> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuotePartService.Delete, opts);
    });
  }

  public async BatchGet(req: QuotePart) {
    return new Promise<QuotePartList>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuotePart, QuotePartList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<QuotePartList>) => {
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
      grpc.unary(QuotePartService.BatchGet, opts);
    });
  }

  /**
   * Returns loaded QuoteParts
   * @returns QuotePart[]
   */
  public async loadQuoteParts() {
    const results: QuotePart[] = [];
    const req = new QuotePart();
    req.setPageNumber(0);
    const res = await this.BatchGet(req);
    const resultsList = res.getResultsList();
    const totalCount = res.getTotalCount();
    const len = resultsList.length;
    results.concat(resultsList);
    if (totalCount > len) {
      const batchesAmount = Math.ceil((totalCount - len) / len);
      const batchResults = await Promise.all(
        Array.from(Array(batchesAmount)).map(async (_, idx) => {
          req.setPageNumber(idx + 1);
          return (await this.BatchGet(req)).getResultsList();
        })
      );
      results.push(
        ...batchResults.reduce((aggr, item) => [...aggr, ...item], [])
      );
    }
    return results;
  }
}

export { QuotePart, QuotePartList, QuotePartClient };
