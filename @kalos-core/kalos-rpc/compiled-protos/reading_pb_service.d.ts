// package: 
// file: reading.proto

import * as reading_pb from "./reading_pb";
import {grpc} from "@improbable-eng/grpc-web";

type ReadingServiceCreate = {
  readonly methodName: string;
  readonly service: typeof ReadingService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof reading_pb.Reading;
  readonly responseType: typeof reading_pb.Reading;
};

type ReadingServiceGet = {
  readonly methodName: string;
  readonly service: typeof ReadingService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof reading_pb.Reading;
  readonly responseType: typeof reading_pb.Reading;
};

type ReadingServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof ReadingService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof reading_pb.Reading;
  readonly responseType: typeof reading_pb.ReadingList;
};

type ReadingServiceList = {
  readonly methodName: string;
  readonly service: typeof ReadingService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof reading_pb.Reading;
  readonly responseType: typeof reading_pb.Reading;
};

type ReadingServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof ReadingService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof reading_pb.Reading;
  readonly responseType: typeof reading_pb.Reading;
};

type ReadingServiceDelete = {
  readonly methodName: string;
  readonly service: typeof ReadingService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof reading_pb.Reading;
  readonly responseType: typeof reading_pb.Reading;
};

export class ReadingService {
  static readonly serviceName: string;
  static readonly Create: ReadingServiceCreate;
  static readonly Get: ReadingServiceGet;
  static readonly BatchGet: ReadingServiceBatchGet;
  static readonly List: ReadingServiceList;
  static readonly Update: ReadingServiceUpdate;
  static readonly Delete: ReadingServiceDelete;
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

export class ReadingServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: reading_pb.Reading,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: reading_pb.Reading|null) => void
  ): UnaryResponse;
  create(
    requestMessage: reading_pb.Reading,
    callback: (error: ServiceError|null, responseMessage: reading_pb.Reading|null) => void
  ): UnaryResponse;
  get(
    requestMessage: reading_pb.Reading,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: reading_pb.Reading|null) => void
  ): UnaryResponse;
  get(
    requestMessage: reading_pb.Reading,
    callback: (error: ServiceError|null, responseMessage: reading_pb.Reading|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: reading_pb.Reading,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: reading_pb.ReadingList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: reading_pb.Reading,
    callback: (error: ServiceError|null, responseMessage: reading_pb.ReadingList|null) => void
  ): UnaryResponse;
  list(requestMessage: reading_pb.Reading, metadata?: grpc.Metadata): ResponseStream<reading_pb.Reading>;
  update(
    requestMessage: reading_pb.Reading,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: reading_pb.Reading|null) => void
  ): UnaryResponse;
  update(
    requestMessage: reading_pb.Reading,
    callback: (error: ServiceError|null, responseMessage: reading_pb.Reading|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: reading_pb.Reading,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: reading_pb.Reading|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: reading_pb.Reading,
    callback: (error: ServiceError|null, responseMessage: reading_pb.Reading|null) => void
  ): UnaryResponse;
}

