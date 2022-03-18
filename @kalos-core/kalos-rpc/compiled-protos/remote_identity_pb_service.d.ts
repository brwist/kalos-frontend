// package: 
// file: remote_identity.proto

import * as remote_identity_pb from "./remote_identity_pb";
import {grpc} from "@improbable-eng/grpc-web";

type RemoteIdentityServiceCreate = {
  readonly methodName: string;
  readonly service: typeof RemoteIdentityService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof remote_identity_pb.RemoteIdentity;
  readonly responseType: typeof remote_identity_pb.RemoteIdentity;
};

type RemoteIdentityServiceGet = {
  readonly methodName: string;
  readonly service: typeof RemoteIdentityService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof remote_identity_pb.RemoteIdentity;
  readonly responseType: typeof remote_identity_pb.RemoteIdentity;
};

type RemoteIdentityServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof RemoteIdentityService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof remote_identity_pb.RemoteIdentity;
  readonly responseType: typeof remote_identity_pb.RemoteIdentityList;
};

type RemoteIdentityServiceList = {
  readonly methodName: string;
  readonly service: typeof RemoteIdentityService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof remote_identity_pb.RemoteIdentity;
  readonly responseType: typeof remote_identity_pb.RemoteIdentity;
};

type RemoteIdentityServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof RemoteIdentityService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof remote_identity_pb.RemoteIdentity;
  readonly responseType: typeof remote_identity_pb.RemoteIdentity;
};

type RemoteIdentityServiceDelete = {
  readonly methodName: string;
  readonly service: typeof RemoteIdentityService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof remote_identity_pb.RemoteIdentity;
  readonly responseType: typeof remote_identity_pb.RemoteIdentity;
};

export class RemoteIdentityService {
  static readonly serviceName: string;
  static readonly Create: RemoteIdentityServiceCreate;
  static readonly Get: RemoteIdentityServiceGet;
  static readonly BatchGet: RemoteIdentityServiceBatchGet;
  static readonly List: RemoteIdentityServiceList;
  static readonly Update: RemoteIdentityServiceUpdate;
  static readonly Delete: RemoteIdentityServiceDelete;
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

export class RemoteIdentityServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: remote_identity_pb.RemoteIdentity,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: remote_identity_pb.RemoteIdentity|null) => void
  ): UnaryResponse;
  create(
    requestMessage: remote_identity_pb.RemoteIdentity,
    callback: (error: ServiceError|null, responseMessage: remote_identity_pb.RemoteIdentity|null) => void
  ): UnaryResponse;
  get(
    requestMessage: remote_identity_pb.RemoteIdentity,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: remote_identity_pb.RemoteIdentity|null) => void
  ): UnaryResponse;
  get(
    requestMessage: remote_identity_pb.RemoteIdentity,
    callback: (error: ServiceError|null, responseMessage: remote_identity_pb.RemoteIdentity|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: remote_identity_pb.RemoteIdentity,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: remote_identity_pb.RemoteIdentityList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: remote_identity_pb.RemoteIdentity,
    callback: (error: ServiceError|null, responseMessage: remote_identity_pb.RemoteIdentityList|null) => void
  ): UnaryResponse;
  list(requestMessage: remote_identity_pb.RemoteIdentity, metadata?: grpc.Metadata): ResponseStream<remote_identity_pb.RemoteIdentity>;
  update(
    requestMessage: remote_identity_pb.RemoteIdentity,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: remote_identity_pb.RemoteIdentity|null) => void
  ): UnaryResponse;
  update(
    requestMessage: remote_identity_pb.RemoteIdentity,
    callback: (error: ServiceError|null, responseMessage: remote_identity_pb.RemoteIdentity|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: remote_identity_pb.RemoteIdentity,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: remote_identity_pb.RemoteIdentity|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: remote_identity_pb.RemoteIdentity,
    callback: (error: ServiceError|null, responseMessage: remote_identity_pb.RemoteIdentity|null) => void
  ): UnaryResponse;
}

