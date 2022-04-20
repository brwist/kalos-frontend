import { grpc } from '@improbable-eng/grpc-web';
import { SystemReadingsTypeService } from '../compiled-protos/system_readings_type_pb_service';
import {
  SystemReadingsType,
  SystemReadingsTypeList,
} from '../compiled-protos/system_readings_type_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class SystemReadingsTypeClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: SystemReadingsType) {
    return new Promise<SystemReadingsType>((resolve, reject) => {
      const opts: UnaryRpcOptions<SystemReadingsType, SystemReadingsType> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SystemReadingsTypeService.Create, opts);
    });
  }

  public async Get(req: SystemReadingsType) {
    return new Promise<SystemReadingsType>((resolve, reject) => {
      const opts: UnaryRpcOptions<SystemReadingsType, SystemReadingsType> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SystemReadingsTypeService.Get, opts);
    });
  }

  public async List(
    req: SystemReadingsType,
    cb: (arg: SystemReadingsType) => void
  ) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<SystemReadingsType, SystemReadingsType> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: SystemReadingsType) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(SystemReadingsTypeService.List, opts);
    });
  }

  public async Update(req: SystemReadingsType) {
    return new Promise<SystemReadingsType>((resolve, reject) => {
      const opts: UnaryRpcOptions<SystemReadingsType, SystemReadingsType> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SystemReadingsTypeService.Update, opts);
    });
  }

  public async Delete(req: SystemReadingsType) {
    return new Promise<SystemReadingsType>((resolve, reject) => {
      const opts: UnaryRpcOptions<SystemReadingsType, SystemReadingsType> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SystemReadingsTypeService.Delete, opts);
    });
  }

  public async BatchGet(req: SystemReadingsType) {
    return new Promise<SystemReadingsTypeList>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        SystemReadingsType,
        SystemReadingsTypeList
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<SystemReadingsTypeList>) => {
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
      grpc.unary(SystemReadingsTypeService.BatchGet, opts);
    });
  }
}

export { SystemReadingsType, SystemReadingsTypeList, SystemReadingsTypeClient };
