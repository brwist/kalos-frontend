import { grpc } from '@improbable-eng/grpc-web';
import { ReadingService } from '../compiled-protos/reading_pb_service';
import { Reading, ReadingList } from '../compiled-protos/reading_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class ReadingClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: Reading) {
    return new Promise<Reading>((resolve, reject) => {
      const opts: UnaryRpcOptions<Reading, Reading> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ReadingService.Create, opts);
    });
  }

  public async Get(req: Reading) {
    return new Promise<Reading>((resolve, reject) => {
      const opts: UnaryRpcOptions<Reading, Reading> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ReadingService.Get, opts);
    });
  }

  public async List(req: Reading, cb: (arg: Reading) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<Reading, Reading> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: Reading) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(ReadingService.List, opts);
    });
  }

  public async Update(req: Reading) {
    return new Promise<Reading>((resolve, reject) => {
      const opts: UnaryRpcOptions<Reading, Reading> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ReadingService.Update, opts);
    });
  }

  public async Delete(req: Reading) {
    return new Promise<Reading>((resolve, reject) => {
      const opts: UnaryRpcOptions<Reading, Reading> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ReadingService.Delete, opts);
    });
  }

  public async BatchGet(req: Reading) {
    return new Promise<ReadingList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Reading, ReadingList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<ReadingList>) => {
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
      grpc.unary(ReadingService.BatchGet, opts);
    });
  }
}

export { Reading, ReadingList, ReadingClient };
