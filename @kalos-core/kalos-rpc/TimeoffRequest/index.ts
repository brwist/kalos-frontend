import { grpc } from '@improbable-eng/grpc-web';
import { TimeoffRequestService } from '../compiled-protos/timeoff_request_pb_service';
import {
  TimeoffRequest,
  TimeoffRequestList,
  PTO,
  TimeoffRequestType,
  TimeoffRequestTypeList,
} from '../compiled-protos/timeoff_request_pb';
import { User } from '../compiled-protos/user_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';
import { NULL_TIME } from '../constants';
class TimeoffRequestClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: TimeoffRequest) {
    return new Promise<TimeoffRequest>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimeoffRequest, TimeoffRequest> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TimeoffRequestService.Create, opts);
    });
  }

  public async Get(req: TimeoffRequest) {
    return new Promise<TimeoffRequest>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimeoffRequest, TimeoffRequest> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TimeoffRequestService.Get, opts);
    });
  }

  public async List(req: TimeoffRequest, cb: (arg: TimeoffRequest) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<TimeoffRequest, TimeoffRequest> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: TimeoffRequest) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(TimeoffRequestService.List, opts);
    });
  }

  public async Update(req: TimeoffRequest) {
    return new Promise<TimeoffRequest>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimeoffRequest, TimeoffRequest> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TimeoffRequestService.Update, opts);
    });
  }

  public async Delete(req: TimeoffRequest) {
    return new Promise<TimeoffRequest>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimeoffRequest, TimeoffRequest> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TimeoffRequestService.Delete, opts);
    });
  }

  public async BatchGet(req: TimeoffRequest) {
    return new Promise<TimeoffRequestList>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimeoffRequest, TimeoffRequestList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TimeoffRequestList>) => {
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
      grpc.unary(TimeoffRequestService.BatchGet, opts);
    });
  }

  public async GetTimeoffRequestTypes() {
    const req = new TimeoffRequestType();
    return new Promise<TimeoffRequestTypeList>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        TimeoffRequestType,
        TimeoffRequestTypeList
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TimeoffRequestTypeList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(result.statusMessage);
          }
        },
      };
      grpc.unary(TimeoffRequestService.GetTimeoffRequestTypes, opts);
    });
  }

  public async getTimeoffRequestById(id: number) {
    const req = new TimeoffRequest();
    req.setId(id);
    req.setIsActive(1);
    try {
      return await this.Get(req);
    } catch (e) {
      return null;
    }
  }
  loadTimeoffRequests = async (config: GetTimesheetConfig) => {
    const req = new TimeoffRequest();
    if (config.startDate && config.endDate) {
      req.setDateRangeList(['>=', config.startDate, '<=', config.endDate]);
    }
    if (config.departmentID) {
      req.setDepartmentCode(config.departmentID);
    }
    if (config.technicianUserID) {
      req.setUserId(config.technicianUserID);
    }
    if (config.payrollProcessed) {
      req.setPayrollProcessed(true);
    }
    if (config.approved) {
      req.setRequestStatus(config.approved === true ? 1 : 2);
    }
    req.setPageNumber(config.page || 0);
    req.setOrderBy('time_started');
    if (config.requestType !== 9) {
      req.setRequestType(config.requestType || 0);
      req.setFieldMaskList(['AdminApprovalUserId']);
    }
    if (config.requestType === 9) {
      req.setFieldMaskList(['PayrollProcessed']);
      req.setNotEqualsList(['AdminApprovalDatetime']);
      req.setAdminApprovalDatetime(NULL_TIME);
      req.setRequestTypeList('9,10,11');
    } else {
      req.setNotEqualsList(['AdminApprovalDatetime']);
      req.setAdminApprovalDatetime(NULL_TIME);
      req.setRequestTypeList('9,10,11');
    }
    if (config.departmentID) {
      const user = new User();
      user.setEmployeeDepartmentId(config.departmentID);
      req.setUser(user);
    }
    req.setIsActive(1);
    return await this.BatchGet(req);
  };

  loadTimeoffRequestProtos = async (config: GetTimesheetConfig) => {
    const req = new TimeoffRequest();
    if (config.startDate && config.endDate) {
      req.setDateRangeList(['>=', config.startDate, '<=', config.endDate]);
    }
    if (config.departmentID) {
      req.setDepartmentCode(config.departmentID);
    }
    if (config.technicianUserID) {
      req.setUserId(config.technicianUserID);
    }
    if (config.payrollProcessed === true) {
      req.addNotEquals('PayrollProcessed');
      req.setPayrollProcessed(false);
      req.setRequestTypeList('9,10,11');
    }
    if (config.payrollProcessed === false) {
      req.addFieldMask('PayrollProcessed');
      req.setRequestTypeList('9,10,11');
    }
    if (config.approved === true) {
      req.addNotEquals('AdminApprovalUserId');
      req.setAdminApprovalUserId(0);
    }
    if (config.approved === false) {
      req.addFieldMask('AdminApprovalUserId');
    }
    req.setPageNumber(config.page || 0);
    req.setOrderBy('time_started');
    if (config.requestType !== 9) {
      req.setRequestType(config.requestType || 0);
    }
    if (config.requestType === 9) {
      req.setRequestTypeList('9,10,11');
    }
    if (config.departmentID) {
      const user = new User();
      user.setEmployeeDepartmentId(config.departmentID);
      req.setUser(user);
    }
    if (config.orderBy) {
      req.setOrderBy(config.orderBy);
      if (config.orderDir) {
        req.setOrderDir(config.orderDir);
      }
    }
    req.setIsActive(1);
    return await this.BatchGet(req);
  };

  public async deleteTimeoffRequestById(id: number) {
    const req = new TimeoffRequest();
    req.setId(id);
    return await this.Delete(req);
  }

  public async processTimeoffRequest(id: number) {
    const req = new TimeoffRequest();
    req.setId(id);
    req.setPayrollProcessed(true);
    req.setFieldMaskList(['PayrollProcessed']);
    return await this.Update(req);
  }

  public async PTOInquiry(userID: number) {
    const req = new PTO();
    req.setId(userID);
    return new Promise<PTO>((resolve, reject) => {
      const opts: UnaryRpcOptions<PTO, PTO> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<PTO>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            if (
              result.statusMessage.toLowerCase() ===
              'response closed without headers'
            ) {
              return this.PTOInquiry(userID);
            } else {
              reject(new Error(result.statusMessage));
            }
          }
        },
      };
      grpc.unary(TimeoffRequestService.PTOInquiry, opts);
    });
  }

  public getPTOInquiryByUserId = async (userId: number) =>
    await this.PTOInquiry(userId);

  public getTimeoffRequestTypes = async () =>
    await (await this.GetTimeoffRequestTypes()).getDataList();

  public getTimeoffRequestByFilter = async (filter: TimeoffRequest) => {
    return await this.BatchGet(filter);
  };

  public upsertTimeoffRequest = async (data: TimeoffRequest) => {
    const id = data.getId();
    if (id !== 0 && data.getFieldMaskList().length === 0) {
      throw new Error(
        'Attempting to update entity without providing a field mask will result in a no op'
      );
    }
    return await this[id != 0 ? 'Update' : 'Create'](data);
  };
}
interface GetTimesheetConfig {
  page?: number;
  departmentID?: number;
  requestType?: number;
  technicianUserID?: number;
  startDate?: string;
  endDate?: string;
  payrollProcessed?: boolean;
  approved?: boolean;
  orderBy?: string;
  orderDir?: string;
}

export {
  TimeoffRequest,
  TimeoffRequestList,
  TimeoffRequestClient,
  PTO,
  GetTimesheetConfig,
};
