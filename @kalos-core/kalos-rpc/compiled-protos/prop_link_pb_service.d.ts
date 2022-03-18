// package: 
// file: prop_link.proto

import * as prop_link_pb from "./prop_link_pb";
import {grpc} from "@improbable-eng/grpc-web";

type PropLinkServiceCreate = {
  readonly methodName: string;
  readonly service: typeof PropLinkService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof prop_link_pb.PropLink;
  readonly responseType: typeof prop_link_pb.PropLink;
};

type PropLinkServiceGet = {
  readonly methodName: string;
  readonly service: typeof PropLinkService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof prop_link_pb.PropLink;
  readonly responseType: typeof prop_link_pb.PropLink;
};

type PropLinkServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof PropLinkService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof prop_link_pb.PropLink;
  readonly responseType: typeof prop_link_pb.PropLinkList;
};

type PropLinkServiceList = {
  readonly methodName: string;
  readonly service: typeof PropLinkService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof prop_link_pb.PropLink;
  readonly responseType: typeof prop_link_pb.PropLink;
};

type PropLinkServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof PropLinkService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof prop_link_pb.PropLink;
  readonly responseType: typeof prop_link_pb.PropLink;
};

type PropLinkServiceDelete = {
  readonly methodName: string;
  readonly service: typeof PropLinkService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof prop_link_pb.PropLink;
  readonly responseType: typeof prop_link_pb.PropLink;
};

export class PropLinkService {
  static readonly serviceName: string;
  static readonly Create: PropLinkServiceCreate;
  static readonly Get: PropLinkServiceGet;
  static readonly BatchGet: PropLinkServiceBatchGet;
  static readonly List: PropLinkServiceList;
  static readonly Update: PropLinkServiceUpdate;
  static readonly Delete: PropLinkServiceDelete;
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

export class PropLinkServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: prop_link_pb.PropLink,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: prop_link_pb.PropLink|null) => void
  ): UnaryResponse;
  create(
    requestMessage: prop_link_pb.PropLink,
    callback: (error: ServiceError|null, responseMessage: prop_link_pb.PropLink|null) => void
  ): UnaryResponse;
  get(
    requestMessage: prop_link_pb.PropLink,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: prop_link_pb.PropLink|null) => void
  ): UnaryResponse;
  get(
    requestMessage: prop_link_pb.PropLink,
    callback: (error: ServiceError|null, responseMessage: prop_link_pb.PropLink|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: prop_link_pb.PropLink,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: prop_link_pb.PropLinkList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: prop_link_pb.PropLink,
    callback: (error: ServiceError|null, responseMessage: prop_link_pb.PropLinkList|null) => void
  ): UnaryResponse;
  list(requestMessage: prop_link_pb.PropLink, metadata?: grpc.Metadata): ResponseStream<prop_link_pb.PropLink>;
  update(
    requestMessage: prop_link_pb.PropLink,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: prop_link_pb.PropLink|null) => void
  ): UnaryResponse;
  update(
    requestMessage: prop_link_pb.PropLink,
    callback: (error: ServiceError|null, responseMessage: prop_link_pb.PropLink|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: prop_link_pb.PropLink,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: prop_link_pb.PropLink|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: prop_link_pb.PropLink,
    callback: (error: ServiceError|null, responseMessage: prop_link_pb.PropLink|null) => void
  ): UnaryResponse;
}

