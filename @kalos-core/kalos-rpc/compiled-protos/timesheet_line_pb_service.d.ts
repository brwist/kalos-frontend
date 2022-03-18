// package: 
// file: timesheet_line.proto

import * as timesheet_line_pb from "./timesheet_line_pb";
import * as common_pb from "./common_pb";
import {grpc} from "@improbable-eng/grpc-web";

type TimesheetLineServiceCreate = {
  readonly methodName: string;
  readonly service: typeof TimesheetLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_line_pb.TimesheetLine;
  readonly responseType: typeof timesheet_line_pb.TimesheetLine;
};

type TimesheetLineServiceGet = {
  readonly methodName: string;
  readonly service: typeof TimesheetLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_line_pb.TimesheetLine;
  readonly responseType: typeof timesheet_line_pb.TimesheetLine;
};

type TimesheetLineServiceGetTimesheet = {
  readonly methodName: string;
  readonly service: typeof TimesheetLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_line_pb.TimesheetReq;
  readonly responseType: typeof timesheet_line_pb.Timesheet;
};

type TimesheetLineServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof TimesheetLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_line_pb.TimesheetLine;
  readonly responseType: typeof timesheet_line_pb.TimesheetLineList;
};

type TimesheetLineServiceBatchGetPayroll = {
  readonly methodName: string;
  readonly service: typeof TimesheetLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_line_pb.TimesheetLine;
  readonly responseType: typeof timesheet_line_pb.TimesheetLineList;
};

type TimesheetLineServiceBatchGetManager = {
  readonly methodName: string;
  readonly service: typeof TimesheetLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_line_pb.TimesheetLine;
  readonly responseType: typeof timesheet_line_pb.TimesheetLineList;
};

type TimesheetLineServiceList = {
  readonly methodName: string;
  readonly service: typeof TimesheetLineService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof timesheet_line_pb.TimesheetLine;
  readonly responseType: typeof timesheet_line_pb.TimesheetLine;
};

type TimesheetLineServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof TimesheetLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_line_pb.TimesheetLine;
  readonly responseType: typeof timesheet_line_pb.TimesheetLine;
};

type TimesheetLineServiceDelete = {
  readonly methodName: string;
  readonly service: typeof TimesheetLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_line_pb.TimesheetLine;
  readonly responseType: typeof timesheet_line_pb.TimesheetLine;
};

type TimesheetLineServiceSubmit = {
  readonly methodName: string;
  readonly service: typeof TimesheetLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_line_pb.SubmitApproveReq;
  readonly responseType: typeof common_pb.Empty;
};

type TimesheetLineServiceApprove = {
  readonly methodName: string;
  readonly service: typeof TimesheetLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_line_pb.SubmitApproveReq;
  readonly responseType: typeof common_pb.Empty;
};

type TimesheetLineServiceProcess = {
  readonly methodName: string;
  readonly service: typeof TimesheetLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_line_pb.SubmitApproveReq;
  readonly responseType: typeof common_pb.Empty;
};

type TimesheetLineServiceReject = {
  readonly methodName: string;
  readonly service: typeof TimesheetLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_line_pb.SubmitApproveReq;
  readonly responseType: typeof common_pb.Empty;
};

type TimesheetLineServiceDeny = {
  readonly methodName: string;
  readonly service: typeof TimesheetLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_line_pb.SubmitApproveReq;
  readonly responseType: typeof common_pb.Empty;
};

type TimesheetLineServiceGetIDsForPayroll = {
  readonly methodName: string;
  readonly service: typeof TimesheetLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof common_pb.DateRange;
  readonly responseType: typeof common_pb.Int32List;
};

type TimesheetLineServiceGetReferenceURL = {
  readonly methodName: string;
  readonly service: typeof TimesheetLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof common_pb.Int32;
  readonly responseType: typeof common_pb.String;
};

export class TimesheetLineService {
  static readonly serviceName: string;
  static readonly Create: TimesheetLineServiceCreate;
  static readonly Get: TimesheetLineServiceGet;
  static readonly GetTimesheet: TimesheetLineServiceGetTimesheet;
  static readonly BatchGet: TimesheetLineServiceBatchGet;
  static readonly BatchGetPayroll: TimesheetLineServiceBatchGetPayroll;
  static readonly BatchGetManager: TimesheetLineServiceBatchGetManager;
  static readonly List: TimesheetLineServiceList;
  static readonly Update: TimesheetLineServiceUpdate;
  static readonly Delete: TimesheetLineServiceDelete;
  static readonly Submit: TimesheetLineServiceSubmit;
  static readonly Approve: TimesheetLineServiceApprove;
  static readonly Process: TimesheetLineServiceProcess;
  static readonly Reject: TimesheetLineServiceReject;
  static readonly Deny: TimesheetLineServiceDeny;
  static readonly GetIDsForPayroll: TimesheetLineServiceGetIDsForPayroll;
  static readonly GetReferenceURL: TimesheetLineServiceGetReferenceURL;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class TimesheetLineServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: timesheet_line_pb.TimesheetLine,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_line_pb.TimesheetLine|null) => void
  ): UnaryResponse;
  create(
    requestMessage: timesheet_line_pb.TimesheetLine,
    callback: (error: ServiceError|null, responseMessage: timesheet_line_pb.TimesheetLine|null) => void
  ): UnaryResponse;
  get(
    requestMessage: timesheet_line_pb.TimesheetLine,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_line_pb.TimesheetLine|null) => void
  ): UnaryResponse;
  get(
    requestMessage: timesheet_line_pb.TimesheetLine,
    callback: (error: ServiceError|null, responseMessage: timesheet_line_pb.TimesheetLine|null) => void
  ): UnaryResponse;
  getTimesheet(
    requestMessage: timesheet_line_pb.TimesheetReq,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_line_pb.Timesheet|null) => void
  ): UnaryResponse;
  getTimesheet(
    requestMessage: timesheet_line_pb.TimesheetReq,
    callback: (error: ServiceError|null, responseMessage: timesheet_line_pb.Timesheet|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: timesheet_line_pb.TimesheetLine,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_line_pb.TimesheetLineList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: timesheet_line_pb.TimesheetLine,
    callback: (error: ServiceError|null, responseMessage: timesheet_line_pb.TimesheetLineList|null) => void
  ): UnaryResponse;
  batchGetPayroll(
    requestMessage: timesheet_line_pb.TimesheetLine,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_line_pb.TimesheetLineList|null) => void
  ): UnaryResponse;
  batchGetPayroll(
    requestMessage: timesheet_line_pb.TimesheetLine,
    callback: (error: ServiceError|null, responseMessage: timesheet_line_pb.TimesheetLineList|null) => void
  ): UnaryResponse;
  batchGetManager(
    requestMessage: timesheet_line_pb.TimesheetLine,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_line_pb.TimesheetLineList|null) => void
  ): UnaryResponse;
  batchGetManager(
    requestMessage: timesheet_line_pb.TimesheetLine,
    callback: (error: ServiceError|null, responseMessage: timesheet_line_pb.TimesheetLineList|null) => void
  ): UnaryResponse;
  list(requestMessage: timesheet_line_pb.TimesheetLine, metadata?: grpc.Metadata): ResponseStream<timesheet_line_pb.TimesheetLine>;
  update(
    requestMessage: timesheet_line_pb.TimesheetLine,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_line_pb.TimesheetLine|null) => void
  ): UnaryResponse;
  update(
    requestMessage: timesheet_line_pb.TimesheetLine,
    callback: (error: ServiceError|null, responseMessage: timesheet_line_pb.TimesheetLine|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: timesheet_line_pb.TimesheetLine,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_line_pb.TimesheetLine|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: timesheet_line_pb.TimesheetLine,
    callback: (error: ServiceError|null, responseMessage: timesheet_line_pb.TimesheetLine|null) => void
  ): UnaryResponse;
  submit(
    requestMessage: timesheet_line_pb.SubmitApproveReq,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  submit(
    requestMessage: timesheet_line_pb.SubmitApproveReq,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  approve(
    requestMessage: timesheet_line_pb.SubmitApproveReq,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  approve(
    requestMessage: timesheet_line_pb.SubmitApproveReq,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  process(
    requestMessage: timesheet_line_pb.SubmitApproveReq,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  process(
    requestMessage: timesheet_line_pb.SubmitApproveReq,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  reject(
    requestMessage: timesheet_line_pb.SubmitApproveReq,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  reject(
    requestMessage: timesheet_line_pb.SubmitApproveReq,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  deny(
    requestMessage: timesheet_line_pb.SubmitApproveReq,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  deny(
    requestMessage: timesheet_line_pb.SubmitApproveReq,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  getIDsForPayroll(
    requestMessage: common_pb.DateRange,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Int32List|null) => void
  ): UnaryResponse;
  getIDsForPayroll(
    requestMessage: common_pb.DateRange,
    callback: (error: ServiceError|null, responseMessage: common_pb.Int32List|null) => void
  ): UnaryResponse;
  getReferenceURL(
    requestMessage: common_pb.Int32,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.String|null) => void
  ): UnaryResponse;
  getReferenceURL(
    requestMessage: common_pb.Int32,
    callback: (error: ServiceError|null, responseMessage: common_pb.String|null) => void
  ): UnaryResponse;
}

