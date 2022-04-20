import { grpc } from '@improbable-eng/grpc-web';
import { TimesheetDepartmentService } from '../compiled-protos/timesheet_department_pb_service';
import { IntArray } from '../compiled-protos/common_pb';
import {
  TimesheetDepartment,
  TimesheetDepartmentList,
} from '../compiled-protos/timesheet_department_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class TimesheetDepartmentClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: TimesheetDepartment) {
    return new Promise<TimesheetDepartment>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimesheetDepartment, TimesheetDepartment> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TimesheetDepartmentService.Create, opts);
    });
  }

  public async Get(req: TimesheetDepartment) {
    return new Promise<TimesheetDepartment>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimesheetDepartment, TimesheetDepartment> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TimesheetDepartmentService.Get, opts);
    });
  }

  public async List(
    req: TimesheetDepartment,
    cb: (arg: TimesheetDepartment) => void
  ) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<TimesheetDepartment, TimesheetDepartment> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: TimesheetDepartment) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(TimesheetDepartmentService.List, opts);
    });
  }

  public async Update(req: TimesheetDepartment) {
    return new Promise<TimesheetDepartment>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimesheetDepartment, TimesheetDepartment> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TimesheetDepartmentService.Update, opts);
    });
  }

  public async Delete(req: TimesheetDepartment) {
    return new Promise<TimesheetDepartment>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimesheetDepartment, TimesheetDepartment> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TimesheetDepartmentService.Delete, opts);
    });
  }

  public async BatchGet(req: TimesheetDepartment) {
    return new Promise<TimesheetDepartmentList>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        TimesheetDepartment,
        TimesheetDepartmentList
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TimesheetDepartmentList>) => {
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
      grpc.unary(TimesheetDepartmentService.BatchGet, opts);
    });
  }

  public async isManagerCheck(userID: number) {
    try {
      const req = new TimesheetDepartment();
      req.setManagerId(userID);
      await this.Get(req);
      return true;
    } catch (err) {
      return false;
    }
  }

  public async getDepartmentByManagerID(ID: number) {
    const req = new TimesheetDepartment();
    req.setManagerId(ID);
    return await this.Get(req);
  }

  public async loadTimeSheetDepartments() {
    const results: TimesheetDepartment[] = [];
    const req = new TimesheetDepartment();
    req.setPageNumber(0);
    req.setIsActive(1);
    const res = await this.BatchGet(req);
    const len = res.getResultsList().length;
    const totalCount = res.getTotalCount();

    results.concat(res.getResultsList());
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

  public async BatchGetDepartmentsByIds(req: number[]) {
    let arr = new IntArray();
    arr.setIdsList(req);
    return new Promise<TimesheetDepartmentList>((resolve, reject) => {
      const opts: UnaryRpcOptions<IntArray, TimesheetDepartmentList> = {
        request: arr,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TimesheetDepartmentList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            if (
              result.statusMessage.toLowerCase() ===
              'response closed without headers'
            ) {
              return this.BatchGetDepartmentsByIds(req);
            } else {
              reject(new Error(result.statusMessage));
            }
          }
        },
      };
      grpc.unary(TimesheetDepartmentService.BatchGetDepartmentsByIds, opts);
    });
  }
  public getDepartmentName = (d: TimesheetDepartment): string =>
    d ? `${d.getValue()} - ${d.getDescription()}` : '';
}

export {
  TimesheetDepartment,
  TimesheetDepartmentList,
  TimesheetDepartmentClient,
};
