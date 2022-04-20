// package: 
// file: logger.proto

import * as logger_pb from "./logger_pb";
import {grpc} from "@improbable-eng/grpc-web";

type LoggerServiceCreate = {
  readonly methodName: string;
  readonly service: typeof LoggerService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof logger_pb.Logger;
  readonly responseType: typeof logger_pb.Logger;
};

type LoggerServiceGet = {
  readonly methodName: string;
  readonly service: typeof LoggerService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof logger_pb.Logger;
  readonly responseType: typeof logger_pb.Logger;
};

type LoggerServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof LoggerService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof logger_pb.Logger;
  readonly responseType: typeof logger_pb.LoggerList;
};

type LoggerServiceList = {
  readonly methodName: string;
  readonly service: typeof LoggerService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof logger_pb.Logger;
  readonly responseType: typeof logger_pb.Logger;
};

type LoggerServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof LoggerService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof logger_pb.Logger;
  readonly responseType: typeof logger_pb.Logger;
};

type LoggerServiceDelete = {
  readonly methodName: string;
  readonly service: typeof LoggerService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof logger_pb.Logger;
  readonly responseType: typeof logger_pb.Logger;
};

export class LoggerService {
  static readonly serviceName: string;
  static readonly Create: LoggerServiceCreate;
  static readonly Get: LoggerServiceGet;
  static readonly BatchGet: LoggerServiceBatchGet;
  static readonly List: LoggerServiceList;
  static readonly Update: LoggerServiceUpdate;
  static readonly Delete: LoggerServiceDelete;
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

export class LoggerServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: logger_pb.Logger,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: logger_pb.Logger|null) => void
  ): UnaryResponse;
  create(
    requestMessage: logger_pb.Logger,
    callback: (error: ServiceError|null, responseMessage: logger_pb.Logger|null) => void
  ): UnaryResponse;
  get(
    requestMessage: logger_pb.Logger,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: logger_pb.Logger|null) => void
  ): UnaryResponse;
  get(
    requestMessage: logger_pb.Logger,
    callback: (error: ServiceError|null, responseMessage: logger_pb.Logger|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: logger_pb.Logger,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: logger_pb.LoggerList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: logger_pb.Logger,
    callback: (error: ServiceError|null, responseMessage: logger_pb.LoggerList|null) => void
  ): UnaryResponse;
  list(requestMessage: logger_pb.Logger, metadata?: grpc.Metadata): ResponseStream<logger_pb.Logger>;
  update(
    requestMessage: logger_pb.Logger,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: logger_pb.Logger|null) => void
  ): UnaryResponse;
  update(
    requestMessage: logger_pb.Logger,
    callback: (error: ServiceError|null, responseMessage: logger_pb.Logger|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: logger_pb.Logger,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: logger_pb.Logger|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: logger_pb.Logger,
    callback: (error: ServiceError|null, responseMessage: logger_pb.Logger|null) => void
  ): UnaryResponse;
}

