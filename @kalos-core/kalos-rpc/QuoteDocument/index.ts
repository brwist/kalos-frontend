import { grpc } from '@improbable-eng/grpc-web';
import { QuoteDocumentService } from '../compiled-protos/quote_document_pb_service';
import {
  QuoteDocument,
  QuoteDocumentList,
} from '../compiled-protos/quote_document_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class QuoteDocumentClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: QuoteDocument) {
    return new Promise<QuoteDocument>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuoteDocument, QuoteDocument> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuoteDocumentService.Create, opts);
    });
  }

  public async Get(req: QuoteDocument) {
    return new Promise<QuoteDocument>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuoteDocument, QuoteDocument> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuoteDocumentService.Get, opts);
    });
  }

  public async List(req: QuoteDocument, cb: (arg: QuoteDocument) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<QuoteDocument, QuoteDocument> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: QuoteDocument) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(QuoteDocumentService.List, opts);
    });
  }

  public async Update(req: QuoteDocument) {
    return new Promise<QuoteDocument>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuoteDocument, QuoteDocument> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuoteDocumentService.Update, opts);
    });
  }

  public async Delete(req: QuoteDocument) {
    return new Promise<QuoteDocument>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuoteDocument, QuoteDocument> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(QuoteDocumentService.Delete, opts);
    });
  }

  public async BatchGet(req: QuoteDocument) {
    return new Promise<QuoteDocumentList>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuoteDocument, QuoteDocumentList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<QuoteDocumentList>) => {
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
      grpc.unary(QuoteDocumentService.BatchGet, opts);
    });
  }
}

export { QuoteDocument, QuoteDocumentList, QuoteDocumentClient };
