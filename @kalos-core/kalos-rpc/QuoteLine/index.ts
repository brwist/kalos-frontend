import { grpc } from '@improbable-eng/grpc-web';
import { QuoteLineService } from '../compiled-protos/quote_line_pb_service';
import { QuoteLine, QuoteLineList } from '../compiled-protos/quote_line_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class QuoteLineClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: QuoteLine) {
    return new Promise<QuoteLine>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuoteLine, QuoteLine> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuoteLineService.Create, opts);
    });
  }

  public async Get(req: QuoteLine) {
    return new Promise<QuoteLine>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuoteLine, QuoteLine> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuoteLineService.Get, opts);
    });
  }

  public async List(req: QuoteLine, cb: (arg: QuoteLine) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<QuoteLine, QuoteLine> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: QuoteLine) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(QuoteLineService.List, opts);
    });
  }

  public async Update(req: QuoteLine) {
    return new Promise<QuoteLine>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuoteLine, QuoteLine> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuoteLineService.Update, opts);
    });
  }

  public async Delete(req: QuoteLine) {
    return new Promise<QuoteLine>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuoteLine, QuoteLine> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuoteLineService.Delete, opts);
    });
  }

  public async BatchGet(req: QuoteLine) {
    return new Promise<QuoteLineList>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuoteLine, QuoteLineList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<QuoteLineList>) => {
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
      grpc.unary(QuoteLineService.BatchGet, opts);
    });
  }

  /**
   * Returns loaded QuoteLines
   * @returns QuoteLine[]
   */
  public async loadQuoteLines() {
    const results: QuoteLine[] = [];
    const req = new QuoteLine();
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
          return await (await this.BatchGet(req)).getResultsList();
        })
      );
      results.push(
        ...batchResults.reduce((aggr, item) => [...aggr, ...item], [])
      );
    }
    return results;
  }
}

export { QuoteLine, QuoteLineList, QuoteLineClient };
