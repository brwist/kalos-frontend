// package: 
// file: task_event.proto

import * as task_event_pb from "./task_event_pb";
import {grpc} from "@improbable-eng/grpc-web";

type TaskEventServiceCreate = {
  readonly methodName: string;
  readonly service: typeof TaskEventService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_event_pb.TaskEvent;
  readonly responseType: typeof task_event_pb.TaskEvent;
};

type TaskEventServiceGet = {
  readonly methodName: string;
  readonly service: typeof TaskEventService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_event_pb.TaskEvent;
  readonly responseType: typeof task_event_pb.TaskEvent;
};

type TaskEventServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof TaskEventService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_event_pb.TaskEvent;
  readonly responseType: typeof task_event_pb.TaskEventList;
};

type TaskEventServiceList = {
  readonly methodName: string;
  readonly service: typeof TaskEventService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof task_event_pb.TaskEvent;
  readonly responseType: typeof task_event_pb.TaskEvent;
};

type TaskEventServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof TaskEventService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_event_pb.TaskEvent;
  readonly responseType: typeof task_event_pb.TaskEvent;
};

type TaskEventServiceDelete = {
  readonly methodName: string;
  readonly service: typeof TaskEventService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_event_pb.TaskEvent;
  readonly responseType: typeof task_event_pb.TaskEvent;
};

export class TaskEventService {
  static readonly serviceName: string;
  static readonly Create: TaskEventServiceCreate;
  static readonly Get: TaskEventServiceGet;
  static readonly BatchGet: TaskEventServiceBatchGet;
  static readonly List: TaskEventServiceList;
  static readonly Update: TaskEventServiceUpdate;
  static readonly Delete: TaskEventServiceDelete;
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

export class TaskEventServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: task_event_pb.TaskEvent,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_event_pb.TaskEvent|null) => void
  ): UnaryResponse;
  create(
    requestMessage: task_event_pb.TaskEvent,
    callback: (error: ServiceError|null, responseMessage: task_event_pb.TaskEvent|null) => void
  ): UnaryResponse;
  get(
    requestMessage: task_event_pb.TaskEvent,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_event_pb.TaskEvent|null) => void
  ): UnaryResponse;
  get(
    requestMessage: task_event_pb.TaskEvent,
    callback: (error: ServiceError|null, responseMessage: task_event_pb.TaskEvent|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: task_event_pb.TaskEvent,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_event_pb.TaskEventList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: task_event_pb.TaskEvent,
    callback: (error: ServiceError|null, responseMessage: task_event_pb.TaskEventList|null) => void
  ): UnaryResponse;
  list(requestMessage: task_event_pb.TaskEvent, metadata?: grpc.Metadata): ResponseStream<task_event_pb.TaskEvent>;
  update(
    requestMessage: task_event_pb.TaskEvent,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_event_pb.TaskEvent|null) => void
  ): UnaryResponse;
  update(
    requestMessage: task_event_pb.TaskEvent,
    callback: (error: ServiceError|null, responseMessage: task_event_pb.TaskEvent|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: task_event_pb.TaskEvent,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_event_pb.TaskEvent|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: task_event_pb.TaskEvent,
    callback: (error: ServiceError|null, responseMessage: task_event_pb.TaskEvent|null) => void
  ): UnaryResponse;
}

