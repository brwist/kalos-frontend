// package: 
// file: service_reading_line.proto

import * as service_reading_line_pb from "./service_reading_line_pb";
import {grpc} from "@improbable-eng/grpc-web";

type ServiceReadingLineServiceCreate = {
  readonly methodName: string;
  readonly service: typeof ServiceReadingLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_reading_line_pb.ServiceReadingLine;
  readonly responseType: typeof service_reading_line_pb.ServiceReadingLine;
};

type ServiceReadingLineServiceGet = {
  readonly methodName: string;
  readonly service: typeof ServiceReadingLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_reading_line_pb.ServiceReadingLine;
  readonly responseType: typeof service_reading_line_pb.ServiceReadingLine;
};

type ServiceReadingLineServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof ServiceReadingLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_reading_line_pb.ServiceReadingLine;
  readonly responseType: typeof service_reading_line_pb.ServiceReadingLineList;
};

type ServiceReadingLineServiceList = {
  readonly methodName: string;
  readonly service: typeof ServiceReadingLineService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof service_reading_line_pb.ServiceReadingLine;
  readonly responseType: typeof service_reading_line_pb.ServiceReadingLine;
};

type ServiceReadingLineServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof ServiceReadingLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_reading_line_pb.ServiceReadingLine;
  readonly responseType: typeof service_reading_line_pb.ServiceReadingLine;
};

type ServiceReadingLineServiceDelete = {
  readonly methodName: string;
  readonly service: typeof ServiceReadingLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_reading_line_pb.ServiceReadingLine;
  readonly responseType: typeof service_reading_line_pb.ServiceReadingLine;
};

export class ServiceReadingLineService {
  static readonly serviceName: string;
  static readonly Create: ServiceReadingLineServiceCreate;
  static readonly Get: ServiceReadingLineServiceGet;
  static readonly BatchGet: ServiceReadingLineServiceBatchGet;
  static readonly List: ServiceReadingLineServiceList;
  static readonly Update: ServiceReadingLineServiceUpdate;
  static readonly Delete: ServiceReadingLineServiceDelete;
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

export class ServiceReadingLineServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: service_reading_line_pb.ServiceReadingLine,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_reading_line_pb.ServiceReadingLine|null) => void
  ): UnaryResponse;
  create(
    requestMessage: service_reading_line_pb.ServiceReadingLine,
    callback: (error: ServiceError|null, responseMessage: service_reading_line_pb.ServiceReadingLine|null) => void
  ): UnaryResponse;
  get(
    requestMessage: service_reading_line_pb.ServiceReadingLine,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_reading_line_pb.ServiceReadingLine|null) => void
  ): UnaryResponse;
  get(
    requestMessage: service_reading_line_pb.ServiceReadingLine,
    callback: (error: ServiceError|null, responseMessage: service_reading_line_pb.ServiceReadingLine|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: service_reading_line_pb.ServiceReadingLine,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_reading_line_pb.ServiceReadingLineList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: service_reading_line_pb.ServiceReadingLine,
    callback: (error: ServiceError|null, responseMessage: service_reading_line_pb.ServiceReadingLineList|null) => void
  ): UnaryResponse;
  list(requestMessage: service_reading_line_pb.ServiceReadingLine, metadata?: grpc.Metadata): ResponseStream<service_reading_line_pb.ServiceReadingLine>;
  update(
    requestMessage: service_reading_line_pb.ServiceReadingLine,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_reading_line_pb.ServiceReadingLine|null) => void
  ): UnaryResponse;
  update(
    requestMessage: service_reading_line_pb.ServiceReadingLine,
    callback: (error: ServiceError|null, responseMessage: service_reading_line_pb.ServiceReadingLine|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: service_reading_line_pb.ServiceReadingLine,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_reading_line_pb.ServiceReadingLine|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: service_reading_line_pb.ServiceReadingLine,
    callback: (error: ServiceError|null, responseMessage: service_reading_line_pb.ServiceReadingLine|null) => void
  ): UnaryResponse;
}

