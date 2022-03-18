// package: 
// file: user_group_link.proto

import * as user_group_link_pb from "./user_group_link_pb";
import {grpc} from "@improbable-eng/grpc-web";

type UserGroupLinkServiceCreate = {
  readonly methodName: string;
  readonly service: typeof UserGroupLinkService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_group_link_pb.UserGroupLink;
  readonly responseType: typeof user_group_link_pb.UserGroupLink;
};

type UserGroupLinkServiceGet = {
  readonly methodName: string;
  readonly service: typeof UserGroupLinkService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_group_link_pb.UserGroupLink;
  readonly responseType: typeof user_group_link_pb.UserGroupLink;
};

type UserGroupLinkServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof UserGroupLinkService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_group_link_pb.UserGroupLink;
  readonly responseType: typeof user_group_link_pb.UserGroupLinkList;
};

type UserGroupLinkServiceList = {
  readonly methodName: string;
  readonly service: typeof UserGroupLinkService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof user_group_link_pb.UserGroupLink;
  readonly responseType: typeof user_group_link_pb.UserGroupLink;
};

type UserGroupLinkServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof UserGroupLinkService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_group_link_pb.UserGroupLink;
  readonly responseType: typeof user_group_link_pb.UserGroupLink;
};

type UserGroupLinkServiceDelete = {
  readonly methodName: string;
  readonly service: typeof UserGroupLinkService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_group_link_pb.UserGroupLink;
  readonly responseType: typeof user_group_link_pb.UserGroupLink;
};

export class UserGroupLinkService {
  static readonly serviceName: string;
  static readonly Create: UserGroupLinkServiceCreate;
  static readonly Get: UserGroupLinkServiceGet;
  static readonly BatchGet: UserGroupLinkServiceBatchGet;
  static readonly List: UserGroupLinkServiceList;
  static readonly Update: UserGroupLinkServiceUpdate;
  static readonly Delete: UserGroupLinkServiceDelete;
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

export class UserGroupLinkServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: user_group_link_pb.UserGroupLink,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: user_group_link_pb.UserGroupLink|null) => void
  ): UnaryResponse;
  create(
    requestMessage: user_group_link_pb.UserGroupLink,
    callback: (error: ServiceError|null, responseMessage: user_group_link_pb.UserGroupLink|null) => void
  ): UnaryResponse;
  get(
    requestMessage: user_group_link_pb.UserGroupLink,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: user_group_link_pb.UserGroupLink|null) => void
  ): UnaryResponse;
  get(
    requestMessage: user_group_link_pb.UserGroupLink,
    callback: (error: ServiceError|null, responseMessage: user_group_link_pb.UserGroupLink|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: user_group_link_pb.UserGroupLink,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: user_group_link_pb.UserGroupLinkList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: user_group_link_pb.UserGroupLink,
    callback: (error: ServiceError|null, responseMessage: user_group_link_pb.UserGroupLinkList|null) => void
  ): UnaryResponse;
  list(requestMessage: user_group_link_pb.UserGroupLink, metadata?: grpc.Metadata): ResponseStream<user_group_link_pb.UserGroupLink>;
  update(
    requestMessage: user_group_link_pb.UserGroupLink,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: user_group_link_pb.UserGroupLink|null) => void
  ): UnaryResponse;
  update(
    requestMessage: user_group_link_pb.UserGroupLink,
    callback: (error: ServiceError|null, responseMessage: user_group_link_pb.UserGroupLink|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: user_group_link_pb.UserGroupLink,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: user_group_link_pb.UserGroupLink|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: user_group_link_pb.UserGroupLink,
    callback: (error: ServiceError|null, responseMessage: user_group_link_pb.UserGroupLink|null) => void
  ): UnaryResponse;
}

