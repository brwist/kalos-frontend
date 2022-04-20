// package: 
// file: devlog.proto

import * as devlog_pb from "./devlog_pb";
import {grpc} from "@improbable-eng/grpc-web";

type DevlogServiceCreate = {
  readonly methodName: string;
  readonly service: typeof DevlogService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof devlog_pb.Devlog;
  readonly responseType: typeof devlog_pb.Devlog;
};

type DevlogServiceGet = {
  readonly methodName: string;
  readonly service: typeof DevlogService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof devlog_pb.Devlog;
  readonly responseType: typeof devlog_pb.Devlog;
};

type DevlogServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof DevlogService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof devlog_pb.Devlog;
  readonly responseType: typeof devlog_pb.DevlogList;
};

type DevlogServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof DevlogService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof devlog_pb.Devlog;
  readonly responseType: typeof devlog_pb.Devlog;
};

type DevlogServiceDelete = {
  readonly methodName: string;
  readonly service: typeof DevlogService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof devlog_pb.Devlog;
  readonly responseType: typeof devlog_pb.Devlog;
};

export class DevlogService {
  static readonly serviceName: string;
  static readonly Create: DevlogServiceCreate;
  static readonly Get: DevlogServiceGet;
  static readonly BatchGet: DevlogServiceBatchGet;
  static readonly Update: DevlogServiceUpdate;
  static readonly Delete: DevlogServiceDelete;
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

export class DevlogServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: devlog_pb.Devlog,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: devlog_pb.Devlog|null) => void
  ): UnaryResponse;
  create(
    requestMessage: devlog_pb.Devlog,
    callback: (error: ServiceError|null, responseMessage: devlog_pb.Devlog|null) => void
  ): UnaryResponse;
  get(
    requestMessage: devlog_pb.Devlog,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: devlog_pb.Devlog|null) => void
  ): UnaryResponse;
  get(
    requestMessage: devlog_pb.Devlog,
    callback: (error: ServiceError|null, responseMessage: devlog_pb.Devlog|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: devlog_pb.Devlog,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: devlog_pb.DevlogList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: devlog_pb.Devlog,
    callback: (error: ServiceError|null, responseMessage: devlog_pb.DevlogList|null) => void
  ): UnaryResponse;
  update(
    requestMessage: devlog_pb.Devlog,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: devlog_pb.Devlog|null) => void
  ): UnaryResponse;
  update(
    requestMessage: devlog_pb.Devlog,
    callback: (error: ServiceError|null, responseMessage: devlog_pb.Devlog|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: devlog_pb.Devlog,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: devlog_pb.Devlog|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: devlog_pb.Devlog,
    callback: (error: ServiceError|null, responseMessage: devlog_pb.Devlog|null) => void
  ): UnaryResponse;
}

