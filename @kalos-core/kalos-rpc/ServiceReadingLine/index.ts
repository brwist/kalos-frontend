import { grpc } from '@improbable-eng/grpc-web';
import { ServiceReadingLineService } from '../compiled-protos/service_reading_line_pb_service';
import {
  ServiceReadingLine,
  ServiceReadingLineList,
} from '../compiled-protos/service_reading_line_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class ServiceReadingLineClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: ServiceReadingLine) {
    return new Promise<ServiceReadingLine>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceReadingLine, ServiceReadingLine> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServiceReadingLineService.Create, opts);
    });
  }

  public async Get(req: ServiceReadingLine) {
    return new Promise<ServiceReadingLine>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceReadingLine, ServiceReadingLine> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServiceReadingLineService.Get, opts);
    });
  }

  public async List(
    req: ServiceReadingLine,
    cb: (arg: ServiceReadingLine) => void
  ) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<ServiceReadingLine, ServiceReadingLine> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: ServiceReadingLine) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(ServiceReadingLineService.List, opts);
    });
  }

  public async Update(req: ServiceReadingLine) {
    return new Promise<ServiceReadingLine>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceReadingLine, ServiceReadingLine> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServiceReadingLineService.Update, opts);
    });
  }

  public async Delete(req: ServiceReadingLine) {
    return new Promise<ServiceReadingLine>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceReadingLine, ServiceReadingLine> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServiceReadingLineService.Delete, opts);
    });
  }

  public async BatchGet(req: ServiceReadingLine) {
    return new Promise<ServiceReadingLineList>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        ServiceReadingLine,
        ServiceReadingLineList
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<ServiceReadingLineList>) => {
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
      grpc.unary(ServiceReadingLineService.BatchGet, opts);
    });
  }
}

export { ServiceReadingLine, ServiceReadingLineList, ServiceReadingLineClient };
