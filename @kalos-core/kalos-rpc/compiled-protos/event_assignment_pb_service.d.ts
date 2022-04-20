// package: 
// file: event_assignment.proto

import * as event_assignment_pb from "./event_assignment_pb";
import {grpc} from "@improbable-eng/grpc-web";

type EventAssignmentServiceCreate = {
  readonly methodName: string;
  readonly service: typeof EventAssignmentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof event_assignment_pb.EventAssignment;
  readonly responseType: typeof event_assignment_pb.EventAssignment;
};

type EventAssignmentServiceGet = {
  readonly methodName: string;
  readonly service: typeof EventAssignmentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof event_assignment_pb.EventAssignment;
  readonly responseType: typeof event_assignment_pb.EventAssignment;
};

type EventAssignmentServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof EventAssignmentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof event_assignment_pb.EventAssignment;
  readonly responseType: typeof event_assignment_pb.EventAssignmentList;
};

type EventAssignmentServiceList = {
  readonly methodName: string;
  readonly service: typeof EventAssignmentService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof event_assignment_pb.EventAssignment;
  readonly responseType: typeof event_assignment_pb.EventAssignment;
};

type EventAssignmentServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof EventAssignmentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof event_assignment_pb.EventAssignment;
  readonly responseType: typeof event_assignment_pb.EventAssignment;
};

type EventAssignmentServiceDelete = {
  readonly methodName: string;
  readonly service: typeof EventAssignmentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof event_assignment_pb.EventAssignment;
  readonly responseType: typeof event_assignment_pb.EventAssignment;
};

export class EventAssignmentService {
  static readonly serviceName: string;
  static readonly Create: EventAssignmentServiceCreate;
  static readonly Get: EventAssignmentServiceGet;
  static readonly BatchGet: EventAssignmentServiceBatchGet;
  static readonly List: EventAssignmentServiceList;
  static readonly Update: EventAssignmentServiceUpdate;
  static readonly Delete: EventAssignmentServiceDelete;
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

export class EventAssignmentServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: event_assignment_pb.EventAssignment,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: event_assignment_pb.EventAssignment|null) => void
  ): UnaryResponse;
  create(
    requestMessage: event_assignment_pb.EventAssignment,
    callback: (error: ServiceError|null, responseMessage: event_assignment_pb.EventAssignment|null) => void
  ): UnaryResponse;
  get(
    requestMessage: event_assignment_pb.EventAssignment,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: event_assignment_pb.EventAssignment|null) => void
  ): UnaryResponse;
  get(
    requestMessage: event_assignment_pb.EventAssignment,
    callback: (error: ServiceError|null, responseMessage: event_assignment_pb.EventAssignment|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: event_assignment_pb.EventAssignment,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: event_assignment_pb.EventAssignmentList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: event_assignment_pb.EventAssignment,
    callback: (error: ServiceError|null, responseMessage: event_assignment_pb.EventAssignmentList|null) => void
  ): UnaryResponse;
  list(requestMessage: event_assignment_pb.EventAssignment, metadata?: grpc.Metadata): ResponseStream<event_assignment_pb.EventAssignment>;
  update(
    requestMessage: event_assignment_pb.EventAssignment,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: event_assignment_pb.EventAssignment|null) => void
  ): UnaryResponse;
  update(
    requestMessage: event_assignment_pb.EventAssignment,
    callback: (error: ServiceError|null, responseMessage: event_assignment_pb.EventAssignment|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: event_assignment_pb.EventAssignment,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: event_assignment_pb.EventAssignment|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: event_assignment_pb.EventAssignment,
    callback: (error: ServiceError|null, responseMessage: event_assignment_pb.EventAssignment|null) => void
  ): UnaryResponse;
}

