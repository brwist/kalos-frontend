// package: 
// file: timesheet_department.proto

import * as timesheet_department_pb from "./timesheet_department_pb";
import * as common_pb from "./common_pb";
import {grpc} from "@improbable-eng/grpc-web";

type TimesheetDepartmentServiceCreate = {
  readonly methodName: string;
  readonly service: typeof TimesheetDepartmentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_department_pb.TimesheetDepartment;
  readonly responseType: typeof timesheet_department_pb.TimesheetDepartment;
};

type TimesheetDepartmentServiceGet = {
  readonly methodName: string;
  readonly service: typeof TimesheetDepartmentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_department_pb.TimesheetDepartment;
  readonly responseType: typeof timesheet_department_pb.TimesheetDepartment;
};

type TimesheetDepartmentServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof TimesheetDepartmentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_department_pb.TimesheetDepartment;
  readonly responseType: typeof timesheet_department_pb.TimesheetDepartmentList;
};

type TimesheetDepartmentServiceList = {
  readonly methodName: string;
  readonly service: typeof TimesheetDepartmentService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof timesheet_department_pb.TimesheetDepartment;
  readonly responseType: typeof timesheet_department_pb.TimesheetDepartment;
};

type TimesheetDepartmentServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof TimesheetDepartmentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_department_pb.TimesheetDepartment;
  readonly responseType: typeof timesheet_department_pb.TimesheetDepartment;
};

type TimesheetDepartmentServiceDelete = {
  readonly methodName: string;
  readonly service: typeof TimesheetDepartmentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_department_pb.TimesheetDepartment;
  readonly responseType: typeof timesheet_department_pb.TimesheetDepartment;
};

type TimesheetDepartmentServiceBatchGetDepartmentsByIds = {
  readonly methodName: string;
  readonly service: typeof TimesheetDepartmentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof common_pb.IntArray;
  readonly responseType: typeof timesheet_department_pb.TimesheetDepartmentList;
};

export class TimesheetDepartmentService {
  static readonly serviceName: string;
  static readonly Create: TimesheetDepartmentServiceCreate;
  static readonly Get: TimesheetDepartmentServiceGet;
  static readonly BatchGet: TimesheetDepartmentServiceBatchGet;
  static readonly List: TimesheetDepartmentServiceList;
  static readonly Update: TimesheetDepartmentServiceUpdate;
  static readonly Delete: TimesheetDepartmentServiceDelete;
  static readonly BatchGetDepartmentsByIds: TimesheetDepartmentServiceBatchGetDepartmentsByIds;
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

export class TimesheetDepartmentServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: timesheet_department_pb.TimesheetDepartment,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_pb.TimesheetDepartment|null) => void
  ): UnaryResponse;
  create(
    requestMessage: timesheet_department_pb.TimesheetDepartment,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_pb.TimesheetDepartment|null) => void
  ): UnaryResponse;
  get(
    requestMessage: timesheet_department_pb.TimesheetDepartment,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_pb.TimesheetDepartment|null) => void
  ): UnaryResponse;
  get(
    requestMessage: timesheet_department_pb.TimesheetDepartment,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_pb.TimesheetDepartment|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: timesheet_department_pb.TimesheetDepartment,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_pb.TimesheetDepartmentList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: timesheet_department_pb.TimesheetDepartment,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_pb.TimesheetDepartmentList|null) => void
  ): UnaryResponse;
  list(requestMessage: timesheet_department_pb.TimesheetDepartment, metadata?: grpc.Metadata): ResponseStream<timesheet_department_pb.TimesheetDepartment>;
  update(
    requestMessage: timesheet_department_pb.TimesheetDepartment,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_pb.TimesheetDepartment|null) => void
  ): UnaryResponse;
  update(
    requestMessage: timesheet_department_pb.TimesheetDepartment,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_pb.TimesheetDepartment|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: timesheet_department_pb.TimesheetDepartment,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_pb.TimesheetDepartment|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: timesheet_department_pb.TimesheetDepartment,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_pb.TimesheetDepartment|null) => void
  ): UnaryResponse;
  batchGetDepartmentsByIds(
    requestMessage: common_pb.IntArray,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_pb.TimesheetDepartmentList|null) => void
  ): UnaryResponse;
  batchGetDepartmentsByIds(
    requestMessage: common_pb.IntArray,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_pb.TimesheetDepartmentList|null) => void
  ): UnaryResponse;
}

