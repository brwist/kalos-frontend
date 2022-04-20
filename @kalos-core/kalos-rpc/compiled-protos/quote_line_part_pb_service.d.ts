// package: 
// file: quote_line_part.proto

import * as quote_line_part_pb from "./quote_line_part_pb";
import {grpc} from "@improbable-eng/grpc-web";

type QuoteLinePartServiceCreate = {
  readonly methodName: string;
  readonly service: typeof QuoteLinePartService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_line_part_pb.QuoteLinePart;
  readonly responseType: typeof quote_line_part_pb.QuoteLinePart;
};

type QuoteLinePartServiceGet = {
  readonly methodName: string;
  readonly service: typeof QuoteLinePartService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_line_part_pb.QuoteLinePart;
  readonly responseType: typeof quote_line_part_pb.QuoteLinePart;
};

type QuoteLinePartServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof QuoteLinePartService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_line_part_pb.QuoteLinePart;
  readonly responseType: typeof quote_line_part_pb.QuoteLinePartList;
};

type QuoteLinePartServiceList = {
  readonly methodName: string;
  readonly service: typeof QuoteLinePartService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof quote_line_part_pb.QuoteLinePart;
  readonly responseType: typeof quote_line_part_pb.QuoteLinePart;
};

type QuoteLinePartServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof QuoteLinePartService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_line_part_pb.QuoteLinePart;
  readonly responseType: typeof quote_line_part_pb.QuoteLinePart;
};

type QuoteLinePartServiceDelete = {
  readonly methodName: string;
  readonly service: typeof QuoteLinePartService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_line_part_pb.QuoteLinePart;
  readonly responseType: typeof quote_line_part_pb.QuoteLinePart;
};

export class QuoteLinePartService {
  static readonly serviceName: string;
  static readonly Create: QuoteLinePartServiceCreate;
  static readonly Get: QuoteLinePartServiceGet;
  static readonly BatchGet: QuoteLinePartServiceBatchGet;
  static readonly List: QuoteLinePartServiceList;
  static readonly Update: QuoteLinePartServiceUpdate;
  static readonly Delete: QuoteLinePartServiceDelete;
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

export class QuoteLinePartServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: quote_line_part_pb.QuoteLinePart,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_line_part_pb.QuoteLinePart|null) => void
  ): UnaryResponse;
  create(
    requestMessage: quote_line_part_pb.QuoteLinePart,
    callback: (error: ServiceError|null, responseMessage: quote_line_part_pb.QuoteLinePart|null) => void
  ): UnaryResponse;
  get(
    requestMessage: quote_line_part_pb.QuoteLinePart,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_line_part_pb.QuoteLinePart|null) => void
  ): UnaryResponse;
  get(
    requestMessage: quote_line_part_pb.QuoteLinePart,
    callback: (error: ServiceError|null, responseMessage: quote_line_part_pb.QuoteLinePart|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: quote_line_part_pb.QuoteLinePart,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_line_part_pb.QuoteLinePartList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: quote_line_part_pb.QuoteLinePart,
    callback: (error: ServiceError|null, responseMessage: quote_line_part_pb.QuoteLinePartList|null) => void
  ): UnaryResponse;
  list(requestMessage: quote_line_part_pb.QuoteLinePart, metadata?: grpc.Metadata): ResponseStream<quote_line_part_pb.QuoteLinePart>;
  update(
    requestMessage: quote_line_part_pb.QuoteLinePart,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_line_part_pb.QuoteLinePart|null) => void
  ): UnaryResponse;
  update(
    requestMessage: quote_line_part_pb.QuoteLinePart,
    callback: (error: ServiceError|null, responseMessage: quote_line_part_pb.QuoteLinePart|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: quote_line_part_pb.QuoteLinePart,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_line_part_pb.QuoteLinePart|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: quote_line_part_pb.QuoteLinePart,
    callback: (error: ServiceError|null, responseMessage: quote_line_part_pb.QuoteLinePart|null) => void
  ): UnaryResponse;
}

