// package: 
// file: task_assignment.proto

import * as task_assignment_pb from "./task_assignment_pb";
import {grpc} from "@improbable-eng/grpc-web";

type TaskAssignmentServiceCreate = {
  readonly methodName: string;
  readonly service: typeof TaskAssignmentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_assignment_pb.TaskAssignment;
  readonly responseType: typeof task_assignment_pb.TaskAssignment;
};

type TaskAssignmentServiceGet = {
  readonly methodName: string;
  readonly service: typeof TaskAssignmentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_assignment_pb.TaskAssignment;
  readonly responseType: typeof task_assignment_pb.TaskAssignment;
};

type TaskAssignmentServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof TaskAssignmentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_assignment_pb.TaskAssignment;
  readonly responseType: typeof task_assignment_pb.TaskAssignmentList;
};

type TaskAssignmentServiceList = {
  readonly methodName: string;
  readonly service: typeof TaskAssignmentService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof task_assignment_pb.TaskAssignment;
  readonly responseType: typeof task_assignment_pb.TaskAssignment;
};

type TaskAssignmentServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof TaskAssignmentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_assignment_pb.TaskAssignment;
  readonly responseType: typeof task_assignment_pb.TaskAssignment;
};

type TaskAssignmentServiceDelete = {
  readonly methodName: string;
  readonly service: typeof TaskAssignmentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_assignment_pb.TaskAssignment;
  readonly responseType: typeof task_assignment_pb.TaskAssignment;
};

export class TaskAssignmentService {
  static readonly serviceName: string;
  static readonly Create: TaskAssignmentServiceCreate;
  static readonly Get: TaskAssignmentServiceGet;
  static readonly BatchGet: TaskAssignmentServiceBatchGet;
  static readonly List: TaskAssignmentServiceList;
  static readonly Update: TaskAssignmentServiceUpdate;
  static readonly Delete: TaskAssignmentServiceDelete;
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

export class TaskAssignmentServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: task_assignment_pb.TaskAssignment,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_assignment_pb.TaskAssignment|null) => void
  ): UnaryResponse;
  create(
    requestMessage: task_assignment_pb.TaskAssignment,
    callback: (error: ServiceError|null, responseMessage: task_assignment_pb.TaskAssignment|null) => void
  ): UnaryResponse;
  get(
    requestMessage: task_assignment_pb.TaskAssignment,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_assignment_pb.TaskAssignment|null) => void
  ): UnaryResponse;
  get(
    requestMessage: task_assignment_pb.TaskAssignment,
    callback: (error: ServiceError|null, responseMessage: task_assignment_pb.TaskAssignment|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: task_assignment_pb.TaskAssignment,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_assignment_pb.TaskAssignmentList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: task_assignment_pb.TaskAssignment,
    callback: (error: ServiceError|null, responseMessage: task_assignment_pb.TaskAssignmentList|null) => void
  ): UnaryResponse;
  list(requestMessage: task_assignment_pb.TaskAssignment, metadata?: grpc.Metadata): ResponseStream<task_assignment_pb.TaskAssignment>;
  update(
    requestMessage: task_assignment_pb.TaskAssignment,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_assignment_pb.TaskAssignment|null) => void
  ): UnaryResponse;
  update(
    requestMessage: task_assignment_pb.TaskAssignment,
    callback: (error: ServiceError|null, responseMessage: task_assignment_pb.TaskAssignment|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: task_assignment_pb.TaskAssignment,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_assignment_pb.TaskAssignment|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: task_assignment_pb.TaskAssignment,
    callback: (error: ServiceError|null, responseMessage: task_assignment_pb.TaskAssignment|null) => void
  ): UnaryResponse;
}

