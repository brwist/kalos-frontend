// package: 
// file: quote_used.proto

import * as quote_used_pb from "./quote_used_pb";
import {grpc} from "@improbable-eng/grpc-web";

type QuoteUsedServiceCreate = {
  readonly methodName: string;
  readonly service: typeof QuoteUsedService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_used_pb.QuoteUsed;
  readonly responseType: typeof quote_used_pb.QuoteUsed;
};

type QuoteUsedServiceGet = {
  readonly methodName: string;
  readonly service: typeof QuoteUsedService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_used_pb.QuoteUsed;
  readonly responseType: typeof quote_used_pb.QuoteUsed;
};

type QuoteUsedServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof QuoteUsedService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_used_pb.QuoteUsed;
  readonly responseType: typeof quote_used_pb.QuoteUsedList;
};

type QuoteUsedServiceList = {
  readonly methodName: string;
  readonly service: typeof QuoteUsedService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof quote_used_pb.QuoteUsed;
  readonly responseType: typeof quote_used_pb.QuoteUsed;
};

type QuoteUsedServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof QuoteUsedService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_used_pb.QuoteUsed;
  readonly responseType: typeof quote_used_pb.QuoteUsed;
};

type QuoteUsedServiceDelete = {
  readonly methodName: string;
  readonly service: typeof QuoteUsedService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_used_pb.QuoteUsed;
  readonly responseType: typeof quote_used_pb.QuoteUsed;
};

export class QuoteUsedService {
  static readonly serviceName: string;
  static readonly Create: QuoteUsedServiceCreate;
  static readonly Get: QuoteUsedServiceGet;
  static readonly BatchGet: QuoteUsedServiceBatchGet;
  static readonly List: QuoteUsedServiceList;
  static readonly Update: QuoteUsedServiceUpdate;
  static readonly Delete: QuoteUsedServiceDelete;
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

export class QuoteUsedServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: quote_used_pb.QuoteUsed,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_used_pb.QuoteUsed|null) => void
  ): UnaryResponse;
  create(
    requestMessage: quote_used_pb.QuoteUsed,
    callback: (error: ServiceError|null, responseMessage: quote_used_pb.QuoteUsed|null) => void
  ): UnaryResponse;
  get(
    requestMessage: quote_used_pb.QuoteUsed,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_used_pb.QuoteUsed|null) => void
  ): UnaryResponse;
  get(
    requestMessage: quote_used_pb.QuoteUsed,
    callback: (error: ServiceError|null, responseMessage: quote_used_pb.QuoteUsed|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: quote_used_pb.QuoteUsed,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_used_pb.QuoteUsedList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: quote_used_pb.QuoteUsed,
    callback: (error: ServiceError|null, responseMessage: quote_used_pb.QuoteUsedList|null) => void
  ): UnaryResponse;
  list(requestMessage: quote_used_pb.QuoteUsed, metadata?: grpc.Metadata): ResponseStream<quote_used_pb.QuoteUsed>;
  update(
    requestMessage: quote_used_pb.QuoteUsed,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_used_pb.QuoteUsed|null) => void
  ): UnaryResponse;
  update(
    requestMessage: quote_used_pb.QuoteUsed,
    callback: (error: ServiceError|null, responseMessage: quote_used_pb.QuoteUsed|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: quote_used_pb.QuoteUsed,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_used_pb.QuoteUsed|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: quote_used_pb.QuoteUsed,
    callback: (error: ServiceError|null, responseMessage: quote_used_pb.QuoteUsed|null) => void
  ): UnaryResponse;
}

