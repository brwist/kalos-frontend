// package: 
// file: quote_line.proto

import * as quote_line_pb from "./quote_line_pb";
import {grpc} from "@improbable-eng/grpc-web";

type QuoteLineServiceCreate = {
  readonly methodName: string;
  readonly service: typeof QuoteLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_line_pb.QuoteLine;
  readonly responseType: typeof quote_line_pb.QuoteLine;
};

type QuoteLineServiceGet = {
  readonly methodName: string;
  readonly service: typeof QuoteLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_line_pb.QuoteLine;
  readonly responseType: typeof quote_line_pb.QuoteLine;
};

type QuoteLineServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof QuoteLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_line_pb.QuoteLine;
  readonly responseType: typeof quote_line_pb.QuoteLineList;
};

type QuoteLineServiceList = {
  readonly methodName: string;
  readonly service: typeof QuoteLineService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof quote_line_pb.QuoteLine;
  readonly responseType: typeof quote_line_pb.QuoteLine;
};

type QuoteLineServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof QuoteLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_line_pb.QuoteLine;
  readonly responseType: typeof quote_line_pb.QuoteLine;
};

type QuoteLineServiceDelete = {
  readonly methodName: string;
  readonly service: typeof QuoteLineService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_line_pb.QuoteLine;
  readonly responseType: typeof quote_line_pb.QuoteLine;
};

export class QuoteLineService {
  static readonly serviceName: string;
  static readonly Create: QuoteLineServiceCreate;
  static readonly Get: QuoteLineServiceGet;
  static readonly BatchGet: QuoteLineServiceBatchGet;
  static readonly List: QuoteLineServiceList;
  static readonly Update: QuoteLineServiceUpdate;
  static readonly Delete: QuoteLineServiceDelete;
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

export class QuoteLineServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: quote_line_pb.QuoteLine,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_line_pb.QuoteLine|null) => void
  ): UnaryResponse;
  create(
    requestMessage: quote_line_pb.QuoteLine,
    callback: (error: ServiceError|null, responseMessage: quote_line_pb.QuoteLine|null) => void
  ): UnaryResponse;
  get(
    requestMessage: quote_line_pb.QuoteLine,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_line_pb.QuoteLine|null) => void
  ): UnaryResponse;
  get(
    requestMessage: quote_line_pb.QuoteLine,
    callback: (error: ServiceError|null, responseMessage: quote_line_pb.QuoteLine|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: quote_line_pb.QuoteLine,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_line_pb.QuoteLineList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: quote_line_pb.QuoteLine,
    callback: (error: ServiceError|null, responseMessage: quote_line_pb.QuoteLineList|null) => void
  ): UnaryResponse;
  list(requestMessage: quote_line_pb.QuoteLine, metadata?: grpc.Metadata): ResponseStream<quote_line_pb.QuoteLine>;
  update(
    requestMessage: quote_line_pb.QuoteLine,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_line_pb.QuoteLine|null) => void
  ): UnaryResponse;
  update(
    requestMessage: quote_line_pb.QuoteLine,
    callback: (error: ServiceError|null, responseMessage: quote_line_pb.QuoteLine|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: quote_line_pb.QuoteLine,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_line_pb.QuoteLine|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: quote_line_pb.QuoteLine,
    callback: (error: ServiceError|null, responseMessage: quote_line_pb.QuoteLine|null) => void
  ): UnaryResponse;
}

