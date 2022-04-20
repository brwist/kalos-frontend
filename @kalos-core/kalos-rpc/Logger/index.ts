import { grpc } from '@improbable-eng/grpc-web';
import { LoggerService } from '../compiled-protos/logger_pb_service';
import { Logger, LoggerList } from '../compiled-protos/logger_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class LoggerClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: Logger) {
    return new Promise<Logger>((resolve, reject) => {
      const opts: UnaryRpcOptions<Logger, Logger> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(LoggerService.Create, opts);
    });
  }

  public async Get(req: Logger) {
    return new Promise<Logger>((resolve, reject) => {
      const opts: UnaryRpcOptions<Logger, Logger> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(LoggerService.Get, opts);
    });
  }

  public async List(req: Logger, cb: (arg: Logger) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<Logger, Logger> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: Logger) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(LoggerService.List, opts);
    });
  }

  public async Update(req: Logger) {
    return new Promise<Logger>((resolve, reject) => {
      const opts: UnaryRpcOptions<Logger, Logger> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(LoggerService.Update, opts);
    });
  }

  public async Delete(req: Logger) {
    return new Promise<Logger>((resolve, reject) => {
      const opts: UnaryRpcOptions<Logger, Logger> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(LoggerService.Delete, opts);
    });
  }

  public async BatchGet(req: Logger) {
    return new Promise<LoggerList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Logger, LoggerList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<LoggerList>) => {
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
      grpc.unary(LoggerService.BatchGet, opts);
    });
  }
}

export { Logger, LoggerList, LoggerClient };
