// package: 
// file: internal_document.proto

import * as internal_document_pb from "./internal_document_pb";
import * as common_pb from "./common_pb";
import {grpc} from "@improbable-eng/grpc-web";

type InternalDocumentServiceCreate = {
  readonly methodName: string;
  readonly service: typeof InternalDocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof internal_document_pb.InternalDocument;
  readonly responseType: typeof internal_document_pb.InternalDocument;
};

type InternalDocumentServiceGet = {
  readonly methodName: string;
  readonly service: typeof InternalDocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof internal_document_pb.InternalDocument;
  readonly responseType: typeof internal_document_pb.InternalDocument;
};

type InternalDocumentServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof InternalDocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof internal_document_pb.InternalDocument;
  readonly responseType: typeof internal_document_pb.InternalDocumentList;
};

type InternalDocumentServiceList = {
  readonly methodName: string;
  readonly service: typeof InternalDocumentService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof internal_document_pb.InternalDocument;
  readonly responseType: typeof internal_document_pb.InternalDocument;
};

type InternalDocumentServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof InternalDocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof internal_document_pb.InternalDocument;
  readonly responseType: typeof internal_document_pb.InternalDocument;
};

type InternalDocumentServiceDelete = {
  readonly methodName: string;
  readonly service: typeof InternalDocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof internal_document_pb.InternalDocument;
  readonly responseType: typeof internal_document_pb.InternalDocument;
};

type InternalDocumentServiceGetDocumentKeys = {
  readonly methodName: string;
  readonly service: typeof InternalDocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof internal_document_pb.DocumentKey;
  readonly responseType: typeof internal_document_pb.DocumentKeyList;
};

type InternalDocumentServiceWriteDocumentKey = {
  readonly methodName: string;
  readonly service: typeof InternalDocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof internal_document_pb.DocumentKey;
  readonly responseType: typeof internal_document_pb.DocumentKey;
};

type InternalDocumentServiceDeleteDocumentKey = {
  readonly methodName: string;
  readonly service: typeof InternalDocumentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof internal_document_pb.DocumentKey;
  readonly responseType: typeof common_pb.Empty;
};

export class InternalDocumentService {
  static readonly serviceName: string;
  static readonly Create: InternalDocumentServiceCreate;
  static readonly Get: InternalDocumentServiceGet;
  static readonly BatchGet: InternalDocumentServiceBatchGet;
  static readonly List: InternalDocumentServiceList;
  static readonly Update: InternalDocumentServiceUpdate;
  static readonly Delete: InternalDocumentServiceDelete;
  static readonly GetDocumentKeys: InternalDocumentServiceGetDocumentKeys;
  static readonly WriteDocumentKey: InternalDocumentServiceWriteDocumentKey;
  static readonly DeleteDocumentKey: InternalDocumentServiceDeleteDocumentKey;
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

export class InternalDocumentServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: internal_document_pb.InternalDocument,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: internal_document_pb.InternalDocument|null) => void
  ): UnaryResponse;
  create(
    requestMessage: internal_document_pb.InternalDocument,
    callback: (error: ServiceError|null, responseMessage: internal_document_pb.InternalDocument|null) => void
  ): UnaryResponse;
  get(
    requestMessage: internal_document_pb.InternalDocument,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: internal_document_pb.InternalDocument|null) => void
  ): UnaryResponse;
  get(
    requestMessage: internal_document_pb.InternalDocument,
    callback: (error: ServiceError|null, responseMessage: internal_document_pb.InternalDocument|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: internal_document_pb.InternalDocument,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: internal_document_pb.InternalDocumentList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: internal_document_pb.InternalDocument,
    callback: (error: ServiceError|null, responseMessage: internal_document_pb.InternalDocumentList|null) => void
  ): UnaryResponse;
  list(requestMessage: internal_document_pb.InternalDocument, metadata?: grpc.Metadata): ResponseStream<internal_document_pb.InternalDocument>;
  update(
    requestMessage: internal_document_pb.InternalDocument,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: internal_document_pb.InternalDocument|null) => void
  ): UnaryResponse;
  update(
    requestMessage: internal_document_pb.InternalDocument,
    callback: (error: ServiceError|null, responseMessage: internal_document_pb.InternalDocument|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: internal_document_pb.InternalDocument,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: internal_document_pb.InternalDocument|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: internal_document_pb.InternalDocument,
    callback: (error: ServiceError|null, responseMessage: internal_document_pb.InternalDocument|null) => void
  ): UnaryResponse;
  getDocumentKeys(
    requestMessage: internal_document_pb.DocumentKey,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: internal_document_pb.DocumentKeyList|null) => void
  ): UnaryResponse;
  getDocumentKeys(
    requestMessage: internal_document_pb.DocumentKey,
    callback: (error: ServiceError|null, responseMessage: internal_document_pb.DocumentKeyList|null) => void
  ): UnaryResponse;
  writeDocumentKey(
    requestMessage: internal_document_pb.DocumentKey,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: internal_document_pb.DocumentKey|null) => void
  ): UnaryResponse;
  writeDocumentKey(
    requestMessage: internal_document_pb.DocumentKey,
    callback: (error: ServiceError|null, responseMessage: internal_document_pb.DocumentKey|null) => void
  ): UnaryResponse;
  deleteDocumentKey(
    requestMessage: internal_document_pb.DocumentKey,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  deleteDocumentKey(
    requestMessage: internal_document_pb.DocumentKey,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
}

