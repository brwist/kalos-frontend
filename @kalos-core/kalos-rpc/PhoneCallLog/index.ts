import { grpc } from '@improbable-eng/grpc-web';
import { PhoneCallLogService } from '../compiled-protos/phone_call_log_pb_service';
import {
  PhoneCallLog,
  PhoneCallLogList,
} from '../compiled-protos/phone_call_log_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class PhoneCallLogClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: PhoneCallLog) {
    return new Promise<PhoneCallLog>((resolve, reject) => {
      const opts: UnaryRpcOptions<PhoneCallLog, PhoneCallLog> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PhoneCallLogService.Create, opts);
    });
  }

  public async Get(req: PhoneCallLog) {
    return new Promise<PhoneCallLog>((resolve, reject) => {
      const opts: UnaryRpcOptions<PhoneCallLog, PhoneCallLog> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PhoneCallLogService.Get, opts);
    });
  }

  public async List(req: PhoneCallLog, cb: (arg: PhoneCallLog) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<PhoneCallLog, PhoneCallLog> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: PhoneCallLog) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(PhoneCallLogService.List, opts);
    });
  }

  public async Update(req: PhoneCallLog) {
    return new Promise<PhoneCallLog>((resolve, reject) => {
      const opts: UnaryRpcOptions<PhoneCallLog, PhoneCallLog> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PhoneCallLogService.Update, opts);
    });
  }

  public async Delete(req: PhoneCallLog) {
    return new Promise<PhoneCallLog>((resolve, reject) => {
      const opts: UnaryRpcOptions<PhoneCallLog, PhoneCallLog> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PhoneCallLogService.Delete, opts);
    });
  }

  public async BatchGet(req: PhoneCallLog) {
    return new Promise<PhoneCallLogList>((resolve, reject) => {
      const opts: UnaryRpcOptions<PhoneCallLog, PhoneCallLogList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<PhoneCallLogList>) => {
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
      grpc.unary(PhoneCallLogService.BatchGet, opts);
    });
  }
}

export { PhoneCallLog, PhoneCallLogList, PhoneCallLogClient };
