// package: 
// file: activity_log.proto

import * as activity_log_pb from "./activity_log_pb";
import {grpc} from "@improbable-eng/grpc-web";

type ActivityLogServiceCreate = {
  readonly methodName: string;
  readonly service: typeof ActivityLogService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof activity_log_pb.ActivityLog;
  readonly responseType: typeof activity_log_pb.ActivityLog;
};

type ActivityLogServiceGet = {
  readonly methodName: string;
  readonly service: typeof ActivityLogService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof activity_log_pb.ActivityLog;
  readonly responseType: typeof activity_log_pb.ActivityLog;
};

type ActivityLogServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof ActivityLogService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof activity_log_pb.ActivityLog;
  readonly responseType: typeof activity_log_pb.ActivityLogList;
};

type ActivityLogServiceBatchGetEventLogs = {
  readonly methodName: string;
  readonly service: typeof ActivityLogService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof activity_log_pb.ActivityLog;
  readonly responseType: typeof activity_log_pb.ActivityLogList;
};

type ActivityLogServiceList = {
  readonly methodName: string;
  readonly service: typeof ActivityLogService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof activity_log_pb.ActivityLog;
  readonly responseType: typeof activity_log_pb.ActivityLog;
};

type ActivityLogServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof ActivityLogService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof activity_log_pb.ActivityLog;
  readonly responseType: typeof activity_log_pb.ActivityLog;
};

type ActivityLogServiceDelete = {
  readonly methodName: string;
  readonly service: typeof ActivityLogService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof activity_log_pb.ActivityLog;
  readonly responseType: typeof activity_log_pb.ActivityLog;
};

export class ActivityLogService {
  static readonly serviceName: string;
  static readonly Create: ActivityLogServiceCreate;
  static readonly Get: ActivityLogServiceGet;
  static readonly BatchGet: ActivityLogServiceBatchGet;
  static readonly BatchGetEventLogs: ActivityLogServiceBatchGetEventLogs;
  static readonly List: ActivityLogServiceList;
  static readonly Update: ActivityLogServiceUpdate;
  static readonly Delete: ActivityLogServiceDelete;
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

export class ActivityLogServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: activity_log_pb.ActivityLog,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: activity_log_pb.ActivityLog|null) => void
  ): UnaryResponse;
  create(
    requestMessage: activity_log_pb.ActivityLog,
    callback: (error: ServiceError|null, responseMessage: activity_log_pb.ActivityLog|null) => void
  ): UnaryResponse;
  get(
    requestMessage: activity_log_pb.ActivityLog,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: activity_log_pb.ActivityLog|null) => void
  ): UnaryResponse;
  get(
    requestMessage: activity_log_pb.ActivityLog,
    callback: (error: ServiceError|null, responseMessage: activity_log_pb.ActivityLog|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: activity_log_pb.ActivityLog,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: activity_log_pb.ActivityLogList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: activity_log_pb.ActivityLog,
    callback: (error: ServiceError|null, responseMessage: activity_log_pb.ActivityLogList|null) => void
  ): UnaryResponse;
  batchGetEventLogs(
    requestMessage: activity_log_pb.ActivityLog,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: activity_log_pb.ActivityLogList|null) => void
  ): UnaryResponse;
  batchGetEventLogs(
    requestMessage: activity_log_pb.ActivityLog,
    callback: (error: ServiceError|null, responseMessage: activity_log_pb.ActivityLogList|null) => void
  ): UnaryResponse;
  list(requestMessage: activity_log_pb.ActivityLog, metadata?: grpc.Metadata): ResponseStream<activity_log_pb.ActivityLog>;
  update(
    requestMessage: activity_log_pb.ActivityLog,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: activity_log_pb.ActivityLog|null) => void
  ): UnaryResponse;
  update(
    requestMessage: activity_log_pb.ActivityLog,
    callback: (error: ServiceError|null, responseMessage: activity_log_pb.ActivityLog|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: activity_log_pb.ActivityLog,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: activity_log_pb.ActivityLog|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: activity_log_pb.ActivityLog,
    callback: (error: ServiceError|null, responseMessage: activity_log_pb.ActivityLog|null) => void
  ): UnaryResponse;
}

