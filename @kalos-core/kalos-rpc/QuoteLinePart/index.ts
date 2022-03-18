import { grpc } from '@improbable-eng/grpc-web';
import { QuoteLinePartService } from '../compiled-protos/quote_line_part_pb_service';
import {
  QuoteLinePart,
  QuoteLinePartList,
} from '../compiled-protos/quote_line_part_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class QuoteLinePartClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: QuoteLinePart) {
    return new Promise<QuoteLinePart>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuoteLinePart, QuoteLinePart> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuoteLinePartService.Create, opts);
    });
  }

  public async Get(req: QuoteLinePart) {
    return new Promise<QuoteLinePart>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuoteLinePart, QuoteLinePart> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuoteLinePartService.Get, opts);
    });
  }

  public async List(req: QuoteLinePart, cb: (arg: QuoteLinePart) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<QuoteLinePart, QuoteLinePart> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: QuoteLinePart) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(QuoteLinePartService.List, opts);
    });
  }

  public async Update(req: QuoteLinePart) {
    return new Promise<QuoteLinePart>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuoteLinePart, QuoteLinePart> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuoteLinePartService.Update, opts);
    });
  }

  public async Delete(req: QuoteLinePart) {
    return new Promise<QuoteLinePart>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuoteLinePart, QuoteLinePart> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuoteLinePartService.Delete, opts);
    });
  }

  public async BatchGet(req: QuoteLinePart) {
    return new Promise<QuoteLinePartList>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuoteLinePart, QuoteLinePartList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<QuoteLinePartList>) => {
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
      grpc.unary(QuoteLinePartService.BatchGet, opts);
    });
  }

  /**
   * Returns loaded QuoteLineParts
   * @returns QuoteLinePart[]
   */
  public async loadQuoteLineParts() {
    const results: QuoteLinePart[] = [];
    const req = new QuoteLinePart();
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

export { QuoteLinePart, QuoteLinePartList, QuoteLinePartClient };
