import { grpc } from '@improbable-eng/grpc-web';
import { TimesheetLineService } from '../compiled-protos/timesheet_line_pb_service';
import {
  TimesheetLine,
  TimesheetLineList,
  SubmitApproveReq,
  TimesheetReq,
  Timesheet,
  TimesheetDay,
} from '../compiled-protos/timesheet_line_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';
import {
  DateRange,
  Double,
  Empty,
  Int32,
  Int32List,
  String,
} from '../compiled-protos/common_pb';
import { NULL_TIME } from '../constants';

class TimesheetLineClient extends BaseClient {
  req: TimesheetLine;
  constructor(host?: string, userID?: number) {
    super(host, userID);
    this.req = new TimesheetLine();
  }

  public async Create(req: TimesheetLine) {
    return new Promise<TimesheetLine>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimesheetLine, TimesheetLine> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TimesheetLineService.Create, opts);
    });
  }

  public async Get(req: TimesheetLine) {
    return new Promise<TimesheetLine>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimesheetLine, TimesheetLine> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TimesheetLineService.Get, opts);
    });
  }

  public async List(req: TimesheetLine, cb: (arg: TimesheetLine) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<TimesheetLine, TimesheetLine> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: TimesheetLine) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(TimesheetLineService.List, opts);
    });
  }

  public async Update(req: TimesheetLine) {
    return new Promise<TimesheetLine>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimesheetLine, TimesheetLine> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TimesheetLineService.Update, opts);
    });
  }

  public async Delete(req: TimesheetLine) {
    return new Promise<TimesheetLine>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimesheetLine, TimesheetLine> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TimesheetLineService.Delete, opts);
    });
  }

  public async BatchGet(req: TimesheetLine) {
    return new Promise<TimesheetLineList>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimesheetLine, TimesheetLineList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TimesheetLineList>) => {
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
      grpc.unary(TimesheetLineService.BatchGet, opts);
    });
  }

  public async BatchGetManager(req: TimesheetLine) {
    return new Promise<TimesheetLineList>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimesheetLine, TimesheetLineList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TimesheetLineList>) => {
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
      grpc.unary(TimesheetLineService.BatchGetManager, opts);
    });
  }

  public async BatchGetPayroll(req: TimesheetLine) {
    return new Promise<TimesheetLineList>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimesheetLine, TimesheetLineList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TimesheetLineList>) => {
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
      grpc.unary(TimesheetLineService.BatchGetPayroll, opts);
    });
  }
  public async Approve(timesheetLineIDs: number[], adminApprovalID: number) {
    return new Promise<Empty>((resolve, reject) => {
      const req = new SubmitApproveReq();
      req.setIdsList(timesheetLineIDs);
      req.setUserId(adminApprovalID);
      const opts: UnaryRpcOptions<SubmitApproveReq, Empty> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<Empty>) => {
          if (result.status !== grpc.Code.OK) {
            reject(new Error(result.statusMessage));
          } else {
            resolve(new Empty());
          }
        },
      };
      grpc.unary(TimesheetLineService.Approve, opts);
    });
  }

  public async Submit(timesheetLineIDs: number[]) {
    return new Promise<Empty>((resolve, reject) => {
      const req = new SubmitApproveReq();
      req.setIdsList(timesheetLineIDs);
      const opts: UnaryRpcOptions<SubmitApproveReq, Empty> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<Empty>) => {
          if (result.status !== grpc.Code.OK) {
            reject(new Error(result.statusMessage));
          } else {
            resolve(new Empty());
          }
        },
      };
      grpc.unary(TimesheetLineService.Submit, opts);
    });
  }
  public async Process(timesheetLineIDs: number[], adminID: number) {
    return new Promise<Empty>((resolve, reject) => {
      const req = new SubmitApproveReq();
      req.setIdsList(timesheetLineIDs);
      req.setUserId(adminID);
      const opts: UnaryRpcOptions<SubmitApproveReq, Empty> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<Empty>) => {
          if (result.status !== grpc.Code.OK) {
            reject(new Error(result.statusMessage));
          } else {
            resolve(new Empty());
          }
        },
      };
      grpc.unary(TimesheetLineService.Process, opts);
    });
  }
  public async Reject(timesheetLineIDs: number[], adminID: number) {
    return new Promise<Empty>((resolve, reject) => {
      const req = new SubmitApproveReq();
      req.setIdsList(timesheetLineIDs);
      req.setUserId(adminID);
      const opts: UnaryRpcOptions<SubmitApproveReq, Empty> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<Empty>) => {
          if (result.status !== grpc.Code.OK) {
            reject(new Error(result.statusMessage));
          } else {
            resolve(new Empty());
          }
        },
      };
      grpc.unary(TimesheetLineService.Reject, opts);
    });
  }
  public async Deny(timesheetLineIDs: number[], adminID: number) {
    return new Promise<Empty>((resolve, reject) => {
      const req = new SubmitApproveReq();
      req.setIdsList(timesheetLineIDs);
      req.setUserId(adminID);
      const opts: UnaryRpcOptions<SubmitApproveReq, Empty> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<Empty>) => {
          if (result.status !== grpc.Code.OK) {
            reject(new Error(result.statusMessage));
          } else {
            resolve(new Empty());
          }
        },
      };
      grpc.unary(TimesheetLineService.Deny, opts);
    });
  }
  public async GetTimesheets(config: GetTimesheetConfig) {
    const req = new TimesheetLine();
    if (config.startDate && config.endDate) {
      req.setDateRangeList(['>=', config.startDate, '<=', config.endDate]);
    }
    if (config.departmentID) {
      req.setDepartmentCode(config.departmentID);
    }
    if (config.technicianUserID) {
      req.setTechnicianUserId(config.technicianUserID);
    }

    req.setPageNumber(config.page || 0);
    req.setOrderBy('time_started');
    req.setGroupBy('technician_user_id');
    req.setFieldMaskList(['AdminApprovalUserId']);
    req.setNotEqualsList(['UserApprovalDatetime']);
    req.setUserApprovalDatetime(NULL_TIME);
    req.setIsActive(1);

    return this.BatchGet(req);
  }

  public async GetIDsForPayroll(start: string, end: string) {
    const req = new DateRange();
    req.setStart(start);
    req.setEnd(end);
    return new Promise<number[]>((resolve, reject) => {
      const opts: UnaryRpcOptions<DateRange, Int32List> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<Int32List>) => {
          if (result.message) {
            resolve(result.message.getValuesList());
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(TimesheetLineService.GetIDsForPayroll, opts);
    });
  }
  public async getReferenceURL(eventID: number) {
    return new Promise<string>((resolve, reject) => {
      const req = new Int32();
      req.setValue(eventID);
      const opts: UnaryRpcOptions<Int32, String> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<String>) => {
          if (result.status !== grpc.Code.OK) {
            reject(result.statusMessage);
          } else {
            resolve(result.message!.getValue());
          }
        },
      };
      grpc.unary(TimesheetLineService.GetReferenceURL, opts);
    });
  }
  public async GetTimesheet(
    req: TimesheetReq,
    startDate: string,
    endDate: string
  ) {
    const tsLine = req.getTimesheetLine();
    tsLine?.setDateRangeList(['>=', startDate, '<=', endDate]);
    const sr = req.getServicesRendered();
    sr?.setDateRangeList(['>=', startDate, '<=', endDate]);
    req.setTimesheetLine(tsLine);
    req.setServicesRendered(sr);

    return new Promise<Timesheet>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimesheetReq, Timesheet> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<Timesheet>) => {
          if (result.status !== grpc.Code.OK) {
            reject(new Error(result.statusMessage));
          } else {
            resolve(result.message!);
          }
        },
      };
      grpc.unary(TimesheetLineService.GetTimesheet, opts);
    });
  }

  loadTimesheets = async ({
    page,
    departmentId,
    employeeId,
    startDate,
    endDate,
  }: {
    page: number;
    departmentId?: number;
    employeeId?: number;
    startDate?: string;
    endDate?: string;
  }) =>
    await this.GetTimesheets({
      page,
      departmentID: departmentId,
      technicianUserID: employeeId,
      startDate,
      endDate,
      type: 'Payroll', // Added payroll type to get rid of error
    });

  loadTimesheetLine = async ({
    page,
    departmentId,
    technicianUserId,
  }: {
    page: number;
    departmentId: number;
    technicianUserId: number;
  }) => {
    const req = new TimesheetLine();
    req.setPageNumber(page);
    if (departmentId) {
      req.setDepartmentCode(departmentId);
    }
    if (technicianUserId) {
      req.setTechnicianUserId(technicianUserId);
    }
    return await this.BatchGet(req);
  };

  public async getLaborHoursByEventID(eventID: number) {
    return new Promise((resolve, reject) => {
      const req = new Int32();
      req.setValue(eventID);
      const opts: UnaryRpcOptions<Int32, Double> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<Double>) => {
          if (result.status !== grpc.Code.OK) {
            reject(result.statusMessage);
          } else {
            resolve(result.message?.getValue());
          }
        },
      };
    });
  }
}

export {
  TimesheetLine,
  TimesheetLineList,
  TimesheetLineClient,
  SubmitApproveReq,
  Timesheet,
  TimesheetDay,
  TimesheetReq,
};

interface GetTimesheetConfig {
  page?: number;
  departmentID?: number;
  technicianUserID?: number;
  startDate?: string;
  endDate?: string;
  type: 'Payroll' | 'Manager';
}
