// package: 
// file: timesheet_department_group.proto

import * as timesheet_department_group_pb from "./timesheet_department_group_pb";
import {grpc} from "@improbable-eng/grpc-web";

type TimesheetDepartmentGroupServiceCreate = {
  readonly methodName: string;
  readonly service: typeof TimesheetDepartmentGroupService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_department_group_pb.TimesheetDepartmentGroup;
  readonly responseType: typeof timesheet_department_group_pb.TimesheetDepartmentGroup;
};

type TimesheetDepartmentGroupServiceGet = {
  readonly methodName: string;
  readonly service: typeof TimesheetDepartmentGroupService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_department_group_pb.TimesheetDepartmentGroup;
  readonly responseType: typeof timesheet_department_group_pb.TimesheetDepartmentGroup;
};

type TimesheetDepartmentGroupServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof TimesheetDepartmentGroupService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_department_group_pb.TimesheetDepartmentGroup;
  readonly responseType: typeof timesheet_department_group_pb.TimesheetDepartmentGroupList;
};

type TimesheetDepartmentGroupServiceList = {
  readonly methodName: string;
  readonly service: typeof TimesheetDepartmentGroupService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof timesheet_department_group_pb.TimesheetDepartmentGroup;
  readonly responseType: typeof timesheet_department_group_pb.TimesheetDepartmentGroup;
};

type TimesheetDepartmentGroupServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof TimesheetDepartmentGroupService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_department_group_pb.TimesheetDepartmentGroup;
  readonly responseType: typeof timesheet_department_group_pb.TimesheetDepartmentGroup;
};

type TimesheetDepartmentGroupServiceDelete = {
  readonly methodName: string;
  readonly service: typeof TimesheetDepartmentGroupService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_department_group_pb.TimesheetDepartmentGroup;
  readonly responseType: typeof timesheet_department_group_pb.TimesheetDepartmentGroup;
};

export class TimesheetDepartmentGroupService {
  static readonly serviceName: string;
  static readonly Create: TimesheetDepartmentGroupServiceCreate;
  static readonly Get: TimesheetDepartmentGroupServiceGet;
  static readonly BatchGet: TimesheetDepartmentGroupServiceBatchGet;
  static readonly List: TimesheetDepartmentGroupServiceList;
  static readonly Update: TimesheetDepartmentGroupServiceUpdate;
  static readonly Delete: TimesheetDepartmentGroupServiceDelete;
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

export class TimesheetDepartmentGroupServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: timesheet_department_group_pb.TimesheetDepartmentGroup,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_group_pb.TimesheetDepartmentGroup|null) => void
  ): UnaryResponse;
  create(
    requestMessage: timesheet_department_group_pb.TimesheetDepartmentGroup,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_group_pb.TimesheetDepartmentGroup|null) => void
  ): UnaryResponse;
  get(
    requestMessage: timesheet_department_group_pb.TimesheetDepartmentGroup,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_group_pb.TimesheetDepartmentGroup|null) => void
  ): UnaryResponse;
  get(
    requestMessage: timesheet_department_group_pb.TimesheetDepartmentGroup,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_group_pb.TimesheetDepartmentGroup|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: timesheet_department_group_pb.TimesheetDepartmentGroup,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_group_pb.TimesheetDepartmentGroupList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: timesheet_department_group_pb.TimesheetDepartmentGroup,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_group_pb.TimesheetDepartmentGroupList|null) => void
  ): UnaryResponse;
  list(requestMessage: timesheet_department_group_pb.TimesheetDepartmentGroup, metadata?: grpc.Metadata): ResponseStream<timesheet_department_group_pb.TimesheetDepartmentGroup>;
  update(
    requestMessage: timesheet_department_group_pb.TimesheetDepartmentGroup,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_group_pb.TimesheetDepartmentGroup|null) => void
  ): UnaryResponse;
  update(
    requestMessage: timesheet_department_group_pb.TimesheetDepartmentGroup,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_group_pb.TimesheetDepartmentGroup|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: timesheet_department_group_pb.TimesheetDepartmentGroup,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_group_pb.TimesheetDepartmentGroup|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: timesheet_department_group_pb.TimesheetDepartmentGroup,
    callback: (error: ServiceError|null, responseMessage: timesheet_department_group_pb.TimesheetDepartmentGroup|null) => void
  ): UnaryResponse;
}

