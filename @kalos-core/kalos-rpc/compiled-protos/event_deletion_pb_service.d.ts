// package: 
// file: event_deletion.proto

import * as event_deletion_pb from "./event_deletion_pb";
import {grpc} from "@improbable-eng/grpc-web";

type EventDeletionServiceCreate = {
  readonly methodName: string;
  readonly service: typeof EventDeletionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof event_deletion_pb.EventDeletion;
  readonly responseType: typeof event_deletion_pb.EventDeletion;
};

type EventDeletionServiceGet = {
  readonly methodName: string;
  readonly service: typeof EventDeletionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof event_deletion_pb.EventDeletion;
  readonly responseType: typeof event_deletion_pb.EventDeletion;
};

type EventDeletionServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof EventDeletionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof event_deletion_pb.EventDeletion;
  readonly responseType: typeof event_deletion_pb.EventDeletionList;
};

type EventDeletionServiceList = {
  readonly methodName: string;
  readonly service: typeof EventDeletionService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof event_deletion_pb.EventDeletion;
  readonly responseType: typeof event_deletion_pb.EventDeletion;
};

type EventDeletionServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof EventDeletionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof event_deletion_pb.EventDeletion;
  readonly responseType: typeof event_deletion_pb.EventDeletion;
};

type EventDeletionServiceDelete = {
  readonly methodName: string;
  readonly service: typeof EventDeletionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof event_deletion_pb.EventDeletion;
  readonly responseType: typeof event_deletion_pb.EventDeletion;
};

export class EventDeletionService {
  static readonly serviceName: string;
  static readonly Create: EventDeletionServiceCreate;
  static readonly Get: EventDeletionServiceGet;
  static readonly BatchGet: EventDeletionServiceBatchGet;
  static readonly List: EventDeletionServiceList;
  static readonly Update: EventDeletionServiceUpdate;
  static readonly Delete: EventDeletionServiceDelete;
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

export class EventDeletionServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: event_deletion_pb.EventDeletion,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: event_deletion_pb.EventDeletion|null) => void
  ): UnaryResponse;
  create(
    requestMessage: event_deletion_pb.EventDeletion,
    callback: (error: ServiceError|null, responseMessage: event_deletion_pb.EventDeletion|null) => void
  ): UnaryResponse;
  get(
    requestMessage: event_deletion_pb.EventDeletion,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: event_deletion_pb.EventDeletion|null) => void
  ): UnaryResponse;
  get(
    requestMessage: event_deletion_pb.EventDeletion,
    callback: (error: ServiceError|null, responseMessage: event_deletion_pb.EventDeletion|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: event_deletion_pb.EventDeletion,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: event_deletion_pb.EventDeletionList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: event_deletion_pb.EventDeletion,
    callback: (error: ServiceError|null, responseMessage: event_deletion_pb.EventDeletionList|null) => void
  ): UnaryResponse;
  list(requestMessage: event_deletion_pb.EventDeletion, metadata?: grpc.Metadata): ResponseStream<event_deletion_pb.EventDeletion>;
  update(
    requestMessage: event_deletion_pb.EventDeletion,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: event_deletion_pb.EventDeletion|null) => void
  ): UnaryResponse;
  update(
    requestMessage: event_deletion_pb.EventDeletion,
    callback: (error: ServiceError|null, responseMessage: event_deletion_pb.EventDeletion|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: event_deletion_pb.EventDeletion,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: event_deletion_pb.EventDeletion|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: event_deletion_pb.EventDeletion,
    callback: (error: ServiceError|null, responseMessage: event_deletion_pb.EventDeletion|null) => void
  ): UnaryResponse;
}

