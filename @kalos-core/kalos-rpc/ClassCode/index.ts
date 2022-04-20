import { grpc } from '@improbable-eng/grpc-web';
import { TimesheetClassCodeService } from '../compiled-protos/timesheet_classcode_pb_service';
import {
  TimesheetClassCode,
  TimesheetClassCodeList,
} from '../compiled-protos/timesheet_classcode_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class TimesheetClassCodeClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: TimesheetClassCode) {
    return new Promise<TimesheetClassCode>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimesheetClassCode, TimesheetClassCode> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TimesheetClassCodeService.Create, opts);
    });
  }

  public async Get(req: TimesheetClassCode) {
    return new Promise<TimesheetClassCode>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimesheetClassCode, TimesheetClassCode> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TimesheetClassCodeService.Get, opts);
    });
  }

  public async List(
    req: TimesheetClassCode,
    cb: (arg: TimesheetClassCode) => void
  ) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<TimesheetClassCode, TimesheetClassCode> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: TimesheetClassCode) => {
          if (msg) {
            cb(msg);
          } else {
            reject();
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(TimesheetClassCodeService.List, opts);
    });
  }

  public async Update(req: TimesheetClassCode) {
    return new Promise<TimesheetClassCode>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimesheetClassCode, TimesheetClassCode> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TimesheetClassCodeService.Update, opts);
    });
  }

  public async Delete(req: TimesheetClassCode) {
    return new Promise<TimesheetClassCode>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimesheetClassCode, TimesheetClassCode> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TimesheetClassCodeService.Delete, opts);
    });
  }

  public async BatchGet(req: TimesheetClassCode) {
    return new Promise<TimesheetClassCodeList>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        TimesheetClassCode,
        TimesheetClassCodeList
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TimesheetClassCodeList>) => {
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
      grpc.unary(TimesheetClassCodeService.BatchGet, opts);
    });
  }
}

export {
  TimesheetClassCode as ClassCode,
  TimesheetClassCodeList as ClassCodeList,
  TimesheetClassCodeClient as ClassCodeClient,
};
