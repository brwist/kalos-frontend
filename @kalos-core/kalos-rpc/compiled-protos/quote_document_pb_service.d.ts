// package: 
// file: quote_document.proto

import * as quote_document_pb from "./quote_document_pb";
import {grpc} from "@improbable-eng/grpc-web";

type QuoteDocumentServiceCreate = {
  readonly methodName: string;
  readonly service: typeof QuoteDocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_document_pb.QuoteDocument;
  readonly responseType: typeof quote_document_pb.QuoteDocument;
};

type QuoteDocumentServiceGet = {
  readonly methodName: string;
  readonly service: typeof QuoteDocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_document_pb.QuoteDocument;
  readonly responseType: typeof quote_document_pb.QuoteDocument;
};

type QuoteDocumentServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof QuoteDocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_document_pb.QuoteDocument;
  readonly responseType: typeof quote_document_pb.QuoteDocumentList;
};

type QuoteDocumentServiceList = {
  readonly methodName: string;
  readonly service: typeof QuoteDocumentService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof quote_document_pb.QuoteDocument;
  readonly responseType: typeof quote_document_pb.QuoteDocument;
};

type QuoteDocumentServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof QuoteDocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_document_pb.QuoteDocument;
  readonly responseType: typeof quote_document_pb.QuoteDocument;
};

type QuoteDocumentServiceDelete = {
  readonly methodName: string;
  readonly service: typeof QuoteDocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof quote_document_pb.QuoteDocument;
  readonly responseType: typeof quote_document_pb.QuoteDocument;
};

export class QuoteDocumentService {
  static readonly serviceName: string;
  static readonly Create: QuoteDocumentServiceCreate;
  static readonly Get: QuoteDocumentServiceGet;
  static readonly BatchGet: QuoteDocumentServiceBatchGet;
  static readonly List: QuoteDocumentServiceList;
  static readonly Update: QuoteDocumentServiceUpdate;
  static readonly Delete: QuoteDocumentServiceDelete;
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

export class QuoteDocumentServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: quote_document_pb.QuoteDocument,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_document_pb.QuoteDocument|null) => void
  ): UnaryResponse;
  create(
    requestMessage: quote_document_pb.QuoteDocument,
    callback: (error: ServiceError|null, responseMessage: quote_document_pb.QuoteDocument|null) => void
  ): UnaryResponse;
  get(
    requestMessage: quote_document_pb.QuoteDocument,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_document_pb.QuoteDocument|null) => void
  ): UnaryResponse;
  get(
    requestMessage: quote_document_pb.QuoteDocument,
    callback: (error: ServiceError|null, responseMessage: quote_document_pb.QuoteDocument|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: quote_document_pb.QuoteDocument,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_document_pb.QuoteDocumentList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: quote_document_pb.QuoteDocument,
    callback: (error: ServiceError|null, responseMessage: quote_document_pb.QuoteDocumentList|null) => void
  ): UnaryResponse;
  list(requestMessage: quote_document_pb.QuoteDocument, metadata?: grpc.Metadata): ResponseStream<quote_document_pb.QuoteDocument>;
  update(
    requestMessage: quote_document_pb.QuoteDocument,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_document_pb.QuoteDocument|null) => void
  ): UnaryResponse;
  update(
    requestMessage: quote_document_pb.QuoteDocument,
    callback: (error: ServiceError|null, responseMessage: quote_document_pb.QuoteDocument|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: quote_document_pb.QuoteDocument,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: quote_document_pb.QuoteDocument|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: quote_document_pb.QuoteDocument,
    callback: (error: ServiceError|null, responseMessage: quote_document_pb.QuoteDocument|null) => void
  ): UnaryResponse;
}

