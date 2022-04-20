// package: 
// file: projects_activity_log.proto

import * as projects_activity_log_pb from "./projects_activity_log_pb";
import {grpc} from "@improbable-eng/grpc-web";

type ProjectsActivityLogServiceCreate = {
  readonly methodName: string;
  readonly service: typeof ProjectsActivityLogService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof projects_activity_log_pb.ProjectsActivityLog;
  readonly responseType: typeof projects_activity_log_pb.ProjectsActivityLog;
};

type ProjectsActivityLogServiceGet = {
  readonly methodName: string;
  readonly service: typeof ProjectsActivityLogService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof projects_activity_log_pb.ProjectsActivityLog;
  readonly responseType: typeof projects_activity_log_pb.ProjectsActivityLog;
};

type ProjectsActivityLogServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof ProjectsActivityLogService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof projects_activity_log_pb.ProjectsActivityLog;
  readonly responseType: typeof projects_activity_log_pb.ProjectsActivityLogList;
};

type ProjectsActivityLogServiceList = {
  readonly methodName: string;
  readonly service: typeof ProjectsActivityLogService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof projects_activity_log_pb.ProjectsActivityLog;
  readonly responseType: typeof projects_activity_log_pb.ProjectsActivityLog;
};

type ProjectsActivityLogServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof ProjectsActivityLogService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof projects_activity_log_pb.ProjectsActivityLog;
  readonly responseType: typeof projects_activity_log_pb.ProjectsActivityLog;
};

type ProjectsActivityLogServiceDelete = {
  readonly methodName: string;
  readonly service: typeof ProjectsActivityLogService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof projects_activity_log_pb.ProjectsActivityLog;
  readonly responseType: typeof projects_activity_log_pb.ProjectsActivityLog;
};

export class ProjectsActivityLogService {
  static readonly serviceName: string;
  static readonly Create: ProjectsActivityLogServiceCreate;
  static readonly Get: ProjectsActivityLogServiceGet;
  static readonly BatchGet: ProjectsActivityLogServiceBatchGet;
  static readonly List: ProjectsActivityLogServiceList;
  static readonly Update: ProjectsActivityLogServiceUpdate;
  static readonly Delete: ProjectsActivityLogServiceDelete;
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

export class ProjectsActivityLogServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: projects_activity_log_pb.ProjectsActivityLog,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: projects_activity_log_pb.ProjectsActivityLog|null) => void
  ): UnaryResponse;
  create(
    requestMessage: projects_activity_log_pb.ProjectsActivityLog,
    callback: (error: ServiceError|null, responseMessage: projects_activity_log_pb.ProjectsActivityLog|null) => void
  ): UnaryResponse;
  get(
    requestMessage: projects_activity_log_pb.ProjectsActivityLog,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: projects_activity_log_pb.ProjectsActivityLog|null) => void
  ): UnaryResponse;
  get(
    requestMessage: projects_activity_log_pb.ProjectsActivityLog,
    callback: (error: ServiceError|null, responseMessage: projects_activity_log_pb.ProjectsActivityLog|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: projects_activity_log_pb.ProjectsActivityLog,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: projects_activity_log_pb.ProjectsActivityLogList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: projects_activity_log_pb.ProjectsActivityLog,
    callback: (error: ServiceError|null, responseMessage: projects_activity_log_pb.ProjectsActivityLogList|null) => void
  ): UnaryResponse;
  list(requestMessage: projects_activity_log_pb.ProjectsActivityLog, metadata?: grpc.Metadata): ResponseStream<projects_activity_log_pb.ProjectsActivityLog>;
  update(
    requestMessage: projects_activity_log_pb.ProjectsActivityLog,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: projects_activity_log_pb.ProjectsActivityLog|null) => void
  ): UnaryResponse;
  update(
    requestMessage: projects_activity_log_pb.ProjectsActivityLog,
    callback: (error: ServiceError|null, responseMessage: projects_activity_log_pb.ProjectsActivityLog|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: projects_activity_log_pb.ProjectsActivityLog,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: projects_activity_log_pb.ProjectsActivityLog|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: projects_activity_log_pb.ProjectsActivityLog,
    callback: (error: ServiceError|null, responseMessage: projects_activity_log_pb.ProjectsActivityLog|null) => void
  ): UnaryResponse;
}

