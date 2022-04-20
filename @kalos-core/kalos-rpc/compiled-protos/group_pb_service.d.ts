// package: 
// file: group.proto

import * as group_pb from "./group_pb";
import {grpc} from "@improbable-eng/grpc-web";

type GroupServiceCreate = {
  readonly methodName: string;
  readonly service: typeof GroupService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof group_pb.Group;
  readonly responseType: typeof group_pb.Group;
};

type GroupServiceGet = {
  readonly methodName: string;
  readonly service: typeof GroupService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof group_pb.Group;
  readonly responseType: typeof group_pb.Group;
};

type GroupServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof GroupService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof group_pb.Group;
  readonly responseType: typeof group_pb.GroupList;
};

type GroupServiceList = {
  readonly methodName: string;
  readonly service: typeof GroupService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof group_pb.Group;
  readonly responseType: typeof group_pb.Group;
};

type GroupServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof GroupService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof group_pb.Group;
  readonly responseType: typeof group_pb.Group;
};

type GroupServiceDelete = {
  readonly methodName: string;
  readonly service: typeof GroupService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof group_pb.Group;
  readonly responseType: typeof group_pb.Group;
};

export class GroupService {
  static readonly serviceName: string;
  static readonly Create: GroupServiceCreate;
  static readonly Get: GroupServiceGet;
  static readonly BatchGet: GroupServiceBatchGet;
  static readonly List: GroupServiceList;
  static readonly Update: GroupServiceUpdate;
  static readonly Delete: GroupServiceDelete;
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

export class GroupServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: group_pb.Group,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: group_pb.Group|null) => void
  ): UnaryResponse;
  create(
    requestMessage: group_pb.Group,
    callback: (error: ServiceError|null, responseMessage: group_pb.Group|null) => void
  ): UnaryResponse;
  get(
    requestMessage: group_pb.Group,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: group_pb.Group|null) => void
  ): UnaryResponse;
  get(
    requestMessage: group_pb.Group,
    callback: (error: ServiceError|null, responseMessage: group_pb.Group|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: group_pb.Group,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: group_pb.GroupList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: group_pb.Group,
    callback: (error: ServiceError|null, responseMessage: group_pb.GroupList|null) => void
  ): UnaryResponse;
  list(requestMessage: group_pb.Group, metadata?: grpc.Metadata): ResponseStream<group_pb.Group>;
  update(
    requestMessage: group_pb.Group,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: group_pb.Group|null) => void
  ): UnaryResponse;
  update(
    requestMessage: group_pb.Group,
    callback: (error: ServiceError|null, responseMessage: group_pb.Group|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: group_pb.Group,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: group_pb.Group|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: group_pb.Group,
    callback: (error: ServiceError|null, responseMessage: group_pb.Group|null) => void
  ): UnaryResponse;
}

