// package: 
// file: si_link.proto

import * as si_link_pb from "./si_link_pb";
import {grpc} from "@improbable-eng/grpc-web";

type SiLinkServiceCreate = {
  readonly methodName: string;
  readonly service: typeof SiLinkService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof si_link_pb.SiLink;
  readonly responseType: typeof si_link_pb.SiLink;
};

type SiLinkServiceGet = {
  readonly methodName: string;
  readonly service: typeof SiLinkService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof si_link_pb.SiLink;
  readonly responseType: typeof si_link_pb.SiLink;
};

type SiLinkServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof SiLinkService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof si_link_pb.SiLink;
  readonly responseType: typeof si_link_pb.SiLinkList;
};

type SiLinkServiceList = {
  readonly methodName: string;
  readonly service: typeof SiLinkService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof si_link_pb.SiLink;
  readonly responseType: typeof si_link_pb.SiLink;
};

type SiLinkServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof SiLinkService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof si_link_pb.SiLink;
  readonly responseType: typeof si_link_pb.SiLink;
};

type SiLinkServiceDelete = {
  readonly methodName: string;
  readonly service: typeof SiLinkService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof si_link_pb.SiLink;
  readonly responseType: typeof si_link_pb.SiLink;
};

export class SiLinkService {
  static readonly serviceName: string;
  static readonly Create: SiLinkServiceCreate;
  static readonly Get: SiLinkServiceGet;
  static readonly BatchGet: SiLinkServiceBatchGet;
  static readonly List: SiLinkServiceList;
  static readonly Update: SiLinkServiceUpdate;
  static readonly Delete: SiLinkServiceDelete;
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

export class SiLinkServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: si_link_pb.SiLink,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: si_link_pb.SiLink|null) => void
  ): UnaryResponse;
  create(
    requestMessage: si_link_pb.SiLink,
    callback: (error: ServiceError|null, responseMessage: si_link_pb.SiLink|null) => void
  ): UnaryResponse;
  get(
    requestMessage: si_link_pb.SiLink,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: si_link_pb.SiLink|null) => void
  ): UnaryResponse;
  get(
    requestMessage: si_link_pb.SiLink,
    callback: (error: ServiceError|null, responseMessage: si_link_pb.SiLink|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: si_link_pb.SiLink,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: si_link_pb.SiLinkList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: si_link_pb.SiLink,
    callback: (error: ServiceError|null, responseMessage: si_link_pb.SiLinkList|null) => void
  ): UnaryResponse;
  list(requestMessage: si_link_pb.SiLink, metadata?: grpc.Metadata): ResponseStream<si_link_pb.SiLink>;
  update(
    requestMessage: si_link_pb.SiLink,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: si_link_pb.SiLink|null) => void
  ): UnaryResponse;
  update(
    requestMessage: si_link_pb.SiLink,
    callback: (error: ServiceError|null, responseMessage: si_link_pb.SiLink|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: si_link_pb.SiLink,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: si_link_pb.SiLink|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: si_link_pb.SiLink,
    callback: (error: ServiceError|null, responseMessage: si_link_pb.SiLink|null) => void
  ): UnaryResponse;
}

