// package: 
// file: stored_quote.proto

import * as stored_quote_pb from "./stored_quote_pb";
import {grpc} from "@improbable-eng/grpc-web";

type StoredQuoteServiceCreate = {
  readonly methodName: string;
  readonly service: typeof StoredQuoteService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof stored_quote_pb.StoredQuote;
  readonly responseType: typeof stored_quote_pb.StoredQuote;
};

type StoredQuoteServiceGet = {
  readonly methodName: string;
  readonly service: typeof StoredQuoteService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof stored_quote_pb.StoredQuote;
  readonly responseType: typeof stored_quote_pb.StoredQuote;
};

type StoredQuoteServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof StoredQuoteService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof stored_quote_pb.StoredQuote;
  readonly responseType: typeof stored_quote_pb.StoredQuoteList;
};

type StoredQuoteServiceList = {
  readonly methodName: string;
  readonly service: typeof StoredQuoteService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof stored_quote_pb.StoredQuote;
  readonly responseType: typeof stored_quote_pb.StoredQuote;
};

type StoredQuoteServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof StoredQuoteService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof stored_quote_pb.StoredQuote;
  readonly responseType: typeof stored_quote_pb.StoredQuote;
};

type StoredQuoteServiceDelete = {
  readonly methodName: string;
  readonly service: typeof StoredQuoteService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof stored_quote_pb.StoredQuote;
  readonly responseType: typeof stored_quote_pb.StoredQuote;
};

export class StoredQuoteService {
  static readonly serviceName: string;
  static readonly Create: StoredQuoteServiceCreate;
  static readonly Get: StoredQuoteServiceGet;
  static readonly BatchGet: StoredQuoteServiceBatchGet;
  static readonly List: StoredQuoteServiceList;
  static readonly Update: StoredQuoteServiceUpdate;
  static readonly Delete: StoredQuoteServiceDelete;
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

export class StoredQuoteServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: stored_quote_pb.StoredQuote,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: stored_quote_pb.StoredQuote|null) => void
  ): UnaryResponse;
  create(
    requestMessage: stored_quote_pb.StoredQuote,
    callback: (error: ServiceError|null, responseMessage: stored_quote_pb.StoredQuote|null) => void
  ): UnaryResponse;
  get(
    requestMessage: stored_quote_pb.StoredQuote,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: stored_quote_pb.StoredQuote|null) => void
  ): UnaryResponse;
  get(
    requestMessage: stored_quote_pb.StoredQuote,
    callback: (error: ServiceError|null, responseMessage: stored_quote_pb.StoredQuote|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: stored_quote_pb.StoredQuote,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: stored_quote_pb.StoredQuoteList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: stored_quote_pb.StoredQuote,
    callback: (error: ServiceError|null, responseMessage: stored_quote_pb.StoredQuoteList|null) => void
  ): UnaryResponse;
  list(requestMessage: stored_quote_pb.StoredQuote, metadata?: grpc.Metadata): ResponseStream<stored_quote_pb.StoredQuote>;
  update(
    requestMessage: stored_quote_pb.StoredQuote,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: stored_quote_pb.StoredQuote|null) => void
  ): UnaryResponse;
  update(
    requestMessage: stored_quote_pb.StoredQuote,
    callback: (error: ServiceError|null, responseMessage: stored_quote_pb.StoredQuote|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: stored_quote_pb.StoredQuote,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: stored_quote_pb.StoredQuote|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: stored_quote_pb.StoredQuote,
    callback: (error: ServiceError|null, responseMessage: stored_quote_pb.StoredQuote|null) => void
  ): UnaryResponse;
}

