import { grpc } from '@improbable-eng/grpc-web';
import { ActivityLogService } from '../compiled-protos/activity_log_pb_service';
import {
  ActivityLog,
  ActivityLogList,
} from '../compiled-protos/activity_log_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class ActivityLogClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: ActivityLog) {
    return new Promise<ActivityLog>((resolve, reject) => {
      const opts: UnaryRpcOptions<ActivityLog, ActivityLog> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ActivityLogService.Create, opts);
    });
  }

  public async Get(req: ActivityLog) {
    return new Promise<ActivityLog>((resolve, reject) => {
      const opts: UnaryRpcOptions<ActivityLog, ActivityLog> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ActivityLogService.Get, opts);
    });
  }

  public async List(req: ActivityLog, cb: (arg: ActivityLog) => void) {
    return new Promise<grpc.Code>(resolve => {
      const opts: InvokeRpcOptions<ActivityLog, ActivityLog> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: ActivityLog) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(ActivityLogService.List, opts);
    });
  }

  public async Update(req: ActivityLog) {
    return new Promise<ActivityLog>((resolve, reject) => {
      const opts: UnaryRpcOptions<ActivityLog, ActivityLog> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ActivityLogService.Update, opts);
    });
  }

  public async Delete(req: ActivityLog) {
    return new Promise<ActivityLog>((resolve, reject) => {
      const opts: UnaryRpcOptions<ActivityLog, ActivityLog> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ActivityLogService.Delete, opts);
    });
  }

  public async BatchGet(req: ActivityLog) {
    return new Promise<ActivityLogList>((resolve, reject) => {
      const opts: UnaryRpcOptions<ActivityLog, ActivityLogList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<ActivityLogList>) => {
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
      grpc.unary(ActivityLogService.BatchGet, opts);
    });
  }

  public async BatchGetEventLogs(req: ActivityLog) {
    return new Promise<ActivityLogList>((resolve, reject) => {
      const opts: UnaryRpcOptions<ActivityLog, ActivityLogList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<ActivityLogList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            if (
              result.statusMessage.toLowerCase() ===
              'response closed without headers'
            ) {
              return this.BatchGetEventLogs(req);
            } else {
              reject(new Error(result.statusMessage));
            }
          }
        },
      };
      grpc.unary(ActivityLogService.BatchGetEventLogs, opts);
    });
  }
}

export { ActivityLog, ActivityLogList, ActivityLogClient };
