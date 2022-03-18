// package: 
// file: default_view.proto

import * as default_view_pb from "./default_view_pb";
import {grpc} from "@improbable-eng/grpc-web";

type DefaultViewServiceCreate = {
  readonly methodName: string;
  readonly service: typeof DefaultViewService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof default_view_pb.DefaultView;
  readonly responseType: typeof default_view_pb.DefaultView;
};

type DefaultViewServiceGet = {
  readonly methodName: string;
  readonly service: typeof DefaultViewService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof default_view_pb.DefaultView;
  readonly responseType: typeof default_view_pb.DefaultView;
};

type DefaultViewServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof DefaultViewService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof default_view_pb.DefaultView;
  readonly responseType: typeof default_view_pb.DefaultViewList;
};

type DefaultViewServiceList = {
  readonly methodName: string;
  readonly service: typeof DefaultViewService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof default_view_pb.DefaultView;
  readonly responseType: typeof default_view_pb.DefaultView;
};

type DefaultViewServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof DefaultViewService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof default_view_pb.DefaultView;
  readonly responseType: typeof default_view_pb.DefaultView;
};

type DefaultViewServiceDelete = {
  readonly methodName: string;
  readonly service: typeof DefaultViewService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof default_view_pb.DefaultView;
  readonly responseType: typeof default_view_pb.DefaultView;
};

export class DefaultViewService {
  static readonly serviceName: string;
  static readonly Create: DefaultViewServiceCreate;
  static readonly Get: DefaultViewServiceGet;
  static readonly BatchGet: DefaultViewServiceBatchGet;
  static readonly List: DefaultViewServiceList;
  static readonly Update: DefaultViewServiceUpdate;
  static readonly Delete: DefaultViewServiceDelete;
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

export class DefaultViewServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: default_view_pb.DefaultView,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: default_view_pb.DefaultView|null) => void
  ): UnaryResponse;
  create(
    requestMessage: default_view_pb.DefaultView,
    callback: (error: ServiceError|null, responseMessage: default_view_pb.DefaultView|null) => void
  ): UnaryResponse;
  get(
    requestMessage: default_view_pb.DefaultView,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: default_view_pb.DefaultView|null) => void
  ): UnaryResponse;
  get(
    requestMessage: default_view_pb.DefaultView,
    callback: (error: ServiceError|null, responseMessage: default_view_pb.DefaultView|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: default_view_pb.DefaultView,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: default_view_pb.DefaultViewList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: default_view_pb.DefaultView,
    callback: (error: ServiceError|null, responseMessage: default_view_pb.DefaultViewList|null) => void
  ): UnaryResponse;
  list(requestMessage: default_view_pb.DefaultView, metadata?: grpc.Metadata): ResponseStream<default_view_pb.DefaultView>;
  update(
    requestMessage: default_view_pb.DefaultView,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: default_view_pb.DefaultView|null) => void
  ): UnaryResponse;
  update(
    requestMessage: default_view_pb.DefaultView,
    callback: (error: ServiceError|null, responseMessage: default_view_pb.DefaultView|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: default_view_pb.DefaultView,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: default_view_pb.DefaultView|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: default_view_pb.DefaultView,
    callback: (error: ServiceError|null, responseMessage: default_view_pb.DefaultView|null) => void
  ): UnaryResponse;
}

