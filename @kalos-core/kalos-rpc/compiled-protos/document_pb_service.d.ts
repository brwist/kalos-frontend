// package: 
// file: document.proto

import * as document_pb from "./document_pb";
import {grpc} from "@improbable-eng/grpc-web";

type DocumentServiceCreate = {
  readonly methodName: string;
  readonly service: typeof DocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof document_pb.Document;
  readonly responseType: typeof document_pb.Document;
};

type DocumentServiceGet = {
  readonly methodName: string;
  readonly service: typeof DocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof document_pb.Document;
  readonly responseType: typeof document_pb.Document;
};

type DocumentServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof DocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof document_pb.Document;
  readonly responseType: typeof document_pb.DocumentList;
};

type DocumentServiceList = {
  readonly methodName: string;
  readonly service: typeof DocumentService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof document_pb.Document;
  readonly responseType: typeof document_pb.Document;
};

type DocumentServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof DocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof document_pb.Document;
  readonly responseType: typeof document_pb.Document;
};

type DocumentServiceDelete = {
  readonly methodName: string;
  readonly service: typeof DocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof document_pb.Document;
  readonly responseType: typeof document_pb.Document;
};

export class DocumentService {
  static readonly serviceName: string;
  static readonly Create: DocumentServiceCreate;
  static readonly Get: DocumentServiceGet;
  static readonly BatchGet: DocumentServiceBatchGet;
  static readonly List: DocumentServiceList;
  static readonly Update: DocumentServiceUpdate;
  static readonly Delete: DocumentServiceDelete;
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

export class DocumentServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: document_pb.Document,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: document_pb.Document|null) => void
  ): UnaryResponse;
  create(
    requestMessage: document_pb.Document,
    callback: (error: ServiceError|null, responseMessage: document_pb.Document|null) => void
  ): UnaryResponse;
  get(
    requestMessage: document_pb.Document,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: document_pb.Document|null) => void
  ): UnaryResponse;
  get(
    requestMessage: document_pb.Document,
    callback: (error: ServiceError|null, responseMessage: document_pb.Document|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: document_pb.Document,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: document_pb.DocumentList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: document_pb.Document,
    callback: (error: ServiceError|null, responseMessage: document_pb.DocumentList|null) => void
  ): UnaryResponse;
  list(requestMessage: document_pb.Document, metadata?: grpc.Metadata): ResponseStream<document_pb.Document>;
  update(
    requestMessage: document_pb.Document,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: document_pb.Document|null) => void
  ): UnaryResponse;
  update(
    requestMessage: document_pb.Document,
    callback: (error: ServiceError|null, responseMessage: document_pb.Document|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: document_pb.Document,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: document_pb.Document|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: document_pb.Document,
    callback: (error: ServiceError|null, responseMessage: document_pb.Document|null) => void
  ): UnaryResponse;
}

