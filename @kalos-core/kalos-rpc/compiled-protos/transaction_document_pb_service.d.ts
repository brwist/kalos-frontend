// package: 
// file: transaction_document.proto

import * as transaction_document_pb from "./transaction_document_pb";
import {grpc} from "@improbable-eng/grpc-web";

type TransactionDocumentServiceCreate = {
  readonly methodName: string;
  readonly service: typeof TransactionDocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_document_pb.TransactionDocument;
  readonly responseType: typeof transaction_document_pb.TransactionDocument;
};

type TransactionDocumentServiceGet = {
  readonly methodName: string;
  readonly service: typeof TransactionDocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_document_pb.TransactionDocument;
  readonly responseType: typeof transaction_document_pb.TransactionDocument;
};

type TransactionDocumentServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof TransactionDocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_document_pb.TransactionDocument;
  readonly responseType: typeof transaction_document_pb.TransactionDocumentList;
};

type TransactionDocumentServiceList = {
  readonly methodName: string;
  readonly service: typeof TransactionDocumentService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof transaction_document_pb.TransactionDocument;
  readonly responseType: typeof transaction_document_pb.TransactionDocument;
};

type TransactionDocumentServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof TransactionDocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_document_pb.TransactionDocument;
  readonly responseType: typeof transaction_document_pb.TransactionDocument;
};

type TransactionDocumentServiceDelete = {
  readonly methodName: string;
  readonly service: typeof TransactionDocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_document_pb.TransactionDocument;
  readonly responseType: typeof transaction_document_pb.TransactionDocument;
};

export class TransactionDocumentService {
  static readonly serviceName: string;
  static readonly Create: TransactionDocumentServiceCreate;
  static readonly Get: TransactionDocumentServiceGet;
  static readonly BatchGet: TransactionDocumentServiceBatchGet;
  static readonly List: TransactionDocumentServiceList;
  static readonly Update: TransactionDocumentServiceUpdate;
  static readonly Delete: TransactionDocumentServiceDelete;
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

export class TransactionDocumentServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: transaction_document_pb.TransactionDocument,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_document_pb.TransactionDocument|null) => void
  ): UnaryResponse;
  create(
    requestMessage: transaction_document_pb.TransactionDocument,
    callback: (error: ServiceError|null, responseMessage: transaction_document_pb.TransactionDocument|null) => void
  ): UnaryResponse;
  get(
    requestMessage: transaction_document_pb.TransactionDocument,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_document_pb.TransactionDocument|null) => void
  ): UnaryResponse;
  get(
    requestMessage: transaction_document_pb.TransactionDocument,
    callback: (error: ServiceError|null, responseMessage: transaction_document_pb.TransactionDocument|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: transaction_document_pb.TransactionDocument,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_document_pb.TransactionDocumentList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: transaction_document_pb.TransactionDocument,
    callback: (error: ServiceError|null, responseMessage: transaction_document_pb.TransactionDocumentList|null) => void
  ): UnaryResponse;
  list(requestMessage: transaction_document_pb.TransactionDocument, metadata?: grpc.Metadata): ResponseStream<transaction_document_pb.TransactionDocument>;
  update(
    requestMessage: transaction_document_pb.TransactionDocument,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_document_pb.TransactionDocument|null) => void
  ): UnaryResponse;
  update(
    requestMessage: transaction_document_pb.TransactionDocument,
    callback: (error: ServiceError|null, responseMessage: transaction_document_pb.TransactionDocument|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: transaction_document_pb.TransactionDocument,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_document_pb.TransactionDocument|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: transaction_document_pb.TransactionDocument,
    callback: (error: ServiceError|null, responseMessage: transaction_document_pb.TransactionDocument|null) => void
  ): UnaryResponse;
}

