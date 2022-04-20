// package: 
// file: quote_part.proto

import * as quote_part_pb from "./quote_part_pb";
import {grpc} from "@improbable-eng/grpc-web";

type QuotePartServiceCreate = {
  readonly methodName: string;
  readonly service: typeof QuotePartService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_part_pb.QuotePart;
  readonly responseType: typeof quote_part_pb.QuotePart;
};

type QuotePartServiceGet = {
  readonly methodName: string;
  readonly service: typeof QuotePartService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_part_pb.QuotePart;
  readonly responseType: typeof quote_part_pb.QuotePart;
};

type QuotePartServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof QuotePartService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_part_pb.QuotePart;
  readonly responseType: typeof quote_part_pb.QuotePartList;
};

type QuotePartServiceList = {
  readonly methodName: string;
  readonly service: typeof QuotePartService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof quote_part_pb.QuotePart;
  readonly responseType: typeof quote_part_pb.QuotePart;
};

type QuotePartServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof QuotePartService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_part_pb.QuotePart;
  readonly responseType: typeof quote_part_pb.QuotePart;
};

type QuotePartServiceDelete = {
  readonly methodName: string;
  readonly service: typeof QuotePartService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_part_pb.QuotePart;
  readonly responseType: typeof quote_part_pb.QuotePart;
};

export class QuotePartService {
  static readonly serviceName: string;
  static readonly Create: QuotePartServiceCreate;
  static readonly Get: QuotePartServiceGet;
  static readonly BatchGet: QuotePartServiceBatchGet;
  static readonly List: QuotePartServiceList;
  static readonly Update: QuotePartServiceUpdate;
  static readonly Delete: QuotePartServiceDelete;
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

export class QuotePartServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: quote_part_pb.QuotePart,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_part_pb.QuotePart|null) => void
  ): UnaryResponse;
  create(
    requestMessage: quote_part_pb.QuotePart,
    callback: (error: ServiceError|null, responseMessage: quote_part_pb.QuotePart|null) => void
  ): UnaryResponse;
  get(
    requestMessage: quote_part_pb.QuotePart,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_part_pb.QuotePart|null) => void
  ): UnaryResponse;
  get(
    requestMessage: quote_part_pb.QuotePart,
    callback: (error: ServiceError|null, responseMessage: quote_part_pb.QuotePart|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: quote_part_pb.QuotePart,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_part_pb.QuotePartList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: quote_part_pb.QuotePart,
    callback: (error: ServiceError|null, responseMessage: quote_part_pb.QuotePartList|null) => void
  ): UnaryResponse;
  list(requestMessage: quote_part_pb.QuotePart, metadata?: grpc.Metadata): ResponseStream<quote_part_pb.QuotePart>;
  update(
    requestMessage: quote_part_pb.QuotePart,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_part_pb.QuotePart|null) => void
  ): UnaryResponse;
  update(
    requestMessage: quote_part_pb.QuotePart,
    callback: (error: ServiceError|null, responseMessage: quote_part_pb.QuotePart|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: quote_part_pb.QuotePart,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_part_pb.QuotePart|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: quote_part_pb.QuotePart,
    callback: (error: ServiceError|null, responseMessage: quote_part_pb.QuotePart|null) => void
  ): UnaryResponse;
}

