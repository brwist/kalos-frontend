// package: 
// file: quote.proto

import * as quote_pb from "./quote_pb";
import {grpc} from "@improbable-eng/grpc-web";

type QuoteServiceCreate = {
  readonly methodName: string;
  readonly service: typeof QuoteService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_pb.Quote;
  readonly responseType: typeof quote_pb.Quote;
};

type QuoteServiceGet = {
  readonly methodName: string;
  readonly service: typeof QuoteService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_pb.Quote;
  readonly responseType: typeof quote_pb.Quote;
};

type QuoteServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof QuoteService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_pb.Quote;
  readonly responseType: typeof quote_pb.QuoteList;
};

type QuoteServiceList = {
  readonly methodName: string;
  readonly service: typeof QuoteService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof quote_pb.Quote;
  readonly responseType: typeof quote_pb.Quote;
};

type QuoteServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof QuoteService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_pb.Quote;
  readonly responseType: typeof quote_pb.Quote;
};

type QuoteServiceDelete = {
  readonly methodName: string;
  readonly service: typeof QuoteService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_pb.Quote;
  readonly responseType: typeof quote_pb.Quote;
};

export class QuoteService {
  static readonly serviceName: string;
  static readonly Create: QuoteServiceCreate;
  static readonly Get: QuoteServiceGet;
  static readonly BatchGet: QuoteServiceBatchGet;
  static readonly List: QuoteServiceList;
  static readonly Update: QuoteServiceUpdate;
  static readonly Delete: QuoteServiceDelete;
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

export class QuoteServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: quote_pb.Quote,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_pb.Quote|null) => void
  ): UnaryResponse;
  create(
    requestMessage: quote_pb.Quote,
    callback: (error: ServiceError|null, responseMessage: quote_pb.Quote|null) => void
  ): UnaryResponse;
  get(
    requestMessage: quote_pb.Quote,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_pb.Quote|null) => void
  ): UnaryResponse;
  get(
    requestMessage: quote_pb.Quote,
    callback: (error: ServiceError|null, responseMessage: quote_pb.Quote|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: quote_pb.Quote,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_pb.QuoteList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: quote_pb.Quote,
    callback: (error: ServiceError|null, responseMessage: quote_pb.QuoteList|null) => void
  ): UnaryResponse;
  list(requestMessage: quote_pb.Quote, metadata?: grpc.Metadata): ResponseStream<quote_pb.Quote>;
  update(
    requestMessage: quote_pb.Quote,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_pb.Quote|null) => void
  ): UnaryResponse;
  update(
    requestMessage: quote_pb.Quote,
    callback: (error: ServiceError|null, responseMessage: quote_pb.Quote|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: quote_pb.Quote,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_pb.Quote|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: quote_pb.Quote,
    callback: (error: ServiceError|null, responseMessage: quote_pb.Quote|null) => void
  ): UnaryResponse;
}

