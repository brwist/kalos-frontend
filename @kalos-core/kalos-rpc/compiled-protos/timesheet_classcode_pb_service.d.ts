// package: 
// file: timesheet_classcode.proto

import * as timesheet_classcode_pb from "./timesheet_classcode_pb";
import {grpc} from "@improbable-eng/grpc-web";

type TimesheetClassCodeServiceCreate = {
  readonly methodName: string;
  readonly service: typeof TimesheetClassCodeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_classcode_pb.TimesheetClassCode;
  readonly responseType: typeof timesheet_classcode_pb.TimesheetClassCode;
};

type TimesheetClassCodeServiceGet = {
  readonly methodName: string;
  readonly service: typeof TimesheetClassCodeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_classcode_pb.TimesheetClassCode;
  readonly responseType: typeof timesheet_classcode_pb.TimesheetClassCode;
};

type TimesheetClassCodeServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof TimesheetClassCodeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_classcode_pb.TimesheetClassCode;
  readonly responseType: typeof timesheet_classcode_pb.TimesheetClassCodeList;
};

type TimesheetClassCodeServiceList = {
  readonly methodName: string;
  readonly service: typeof TimesheetClassCodeService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof timesheet_classcode_pb.TimesheetClassCode;
  readonly responseType: typeof timesheet_classcode_pb.TimesheetClassCode;
};

type TimesheetClassCodeServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof TimesheetClassCodeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_classcode_pb.TimesheetClassCode;
  readonly responseType: typeof timesheet_classcode_pb.TimesheetClassCode;
};

type TimesheetClassCodeServiceDelete = {
  readonly methodName: string;
  readonly service: typeof TimesheetClassCodeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timesheet_classcode_pb.TimesheetClassCode;
  readonly responseType: typeof timesheet_classcode_pb.TimesheetClassCode;
};

export class TimesheetClassCodeService {
  static readonly serviceName: string;
  static readonly Create: TimesheetClassCodeServiceCreate;
  static readonly Get: TimesheetClassCodeServiceGet;
  static readonly BatchGet: TimesheetClassCodeServiceBatchGet;
  static readonly List: TimesheetClassCodeServiceList;
  static readonly Update: TimesheetClassCodeServiceUpdate;
  static readonly Delete: TimesheetClassCodeServiceDelete;
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

export class TimesheetClassCodeServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: timesheet_classcode_pb.TimesheetClassCode,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_classcode_pb.TimesheetClassCode|null) => void
  ): UnaryResponse;
  create(
    requestMessage: timesheet_classcode_pb.TimesheetClassCode,
    callback: (error: ServiceError|null, responseMessage: timesheet_classcode_pb.TimesheetClassCode|null) => void
  ): UnaryResponse;
  get(
    requestMessage: timesheet_classcode_pb.TimesheetClassCode,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_classcode_pb.TimesheetClassCode|null) => void
  ): UnaryResponse;
  get(
    requestMessage: timesheet_classcode_pb.TimesheetClassCode,
    callback: (error: ServiceError|null, responseMessage: timesheet_classcode_pb.TimesheetClassCode|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: timesheet_classcode_pb.TimesheetClassCode,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_classcode_pb.TimesheetClassCodeList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: timesheet_classcode_pb.TimesheetClassCode,
    callback: (error: ServiceError|null, responseMessage: timesheet_classcode_pb.TimesheetClassCodeList|null) => void
  ): UnaryResponse;
  list(requestMessage: timesheet_classcode_pb.TimesheetClassCode, metadata?: grpc.Metadata): ResponseStream<timesheet_classcode_pb.TimesheetClassCode>;
  update(
    requestMessage: timesheet_classcode_pb.TimesheetClassCode,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_classcode_pb.TimesheetClassCode|null) => void
  ): UnaryResponse;
  update(
    requestMessage: timesheet_classcode_pb.TimesheetClassCode,
    callback: (error: ServiceError|null, responseMessage: timesheet_classcode_pb.TimesheetClassCode|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: timesheet_classcode_pb.TimesheetClassCode,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timesheet_classcode_pb.TimesheetClassCode|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: timesheet_classcode_pb.TimesheetClassCode,
    callback: (error: ServiceError|null, responseMessage: timesheet_classcode_pb.TimesheetClassCode|null) => void
  ): UnaryResponse;
}

