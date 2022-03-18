// package: 
// file: system_invoice_type.proto

import * as system_invoice_type_pb from "./system_invoice_type_pb";
import {grpc} from "@improbable-eng/grpc-web";

type SystemInvoiceTypeServiceCreate = {
  readonly methodName: string;
  readonly service: typeof SystemInvoiceTypeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof system_invoice_type_pb.SystemInvoiceType;
  readonly responseType: typeof system_invoice_type_pb.SystemInvoiceType;
};

type SystemInvoiceTypeServiceGet = {
  readonly methodName: string;
  readonly service: typeof SystemInvoiceTypeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof system_invoice_type_pb.SystemInvoiceType;
  readonly responseType: typeof system_invoice_type_pb.SystemInvoiceType;
};

type SystemInvoiceTypeServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof SystemInvoiceTypeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof system_invoice_type_pb.SystemInvoiceType;
  readonly responseType: typeof system_invoice_type_pb.SystemInvoiceTypeList;
};

type SystemInvoiceTypeServiceList = {
  readonly methodName: string;
  readonly service: typeof SystemInvoiceTypeService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof system_invoice_type_pb.SystemInvoiceType;
  readonly responseType: typeof system_invoice_type_pb.SystemInvoiceType;
};

type SystemInvoiceTypeServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof SystemInvoiceTypeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof system_invoice_type_pb.SystemInvoiceType;
  readonly responseType: typeof system_invoice_type_pb.SystemInvoiceType;
};

type SystemInvoiceTypeServiceDelete = {
  readonly methodName: string;
  readonly service: typeof SystemInvoiceTypeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof system_invoice_type_pb.SystemInvoiceType;
  readonly responseType: typeof system_invoice_type_pb.SystemInvoiceType;
};

export class SystemInvoiceTypeService {
  static readonly serviceName: string;
  static readonly Create: SystemInvoiceTypeServiceCreate;
  static readonly Get: SystemInvoiceTypeServiceGet;
  static readonly BatchGet: SystemInvoiceTypeServiceBatchGet;
  static readonly List: SystemInvoiceTypeServiceList;
  static readonly Update: SystemInvoiceTypeServiceUpdate;
  static readonly Delete: SystemInvoiceTypeServiceDelete;
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

export class SystemInvoiceTypeServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: system_invoice_type_pb.SystemInvoiceType,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: system_invoice_type_pb.SystemInvoiceType|null) => void
  ): UnaryResponse;
  create(
    requestMessage: system_invoice_type_pb.SystemInvoiceType,
    callback: (error: ServiceError|null, responseMessage: system_invoice_type_pb.SystemInvoiceType|null) => void
  ): UnaryResponse;
  get(
    requestMessage: system_invoice_type_pb.SystemInvoiceType,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: system_invoice_type_pb.SystemInvoiceType|null) => void
  ): UnaryResponse;
  get(
    requestMessage: system_invoice_type_pb.SystemInvoiceType,
    callback: (error: ServiceError|null, responseMessage: system_invoice_type_pb.SystemInvoiceType|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: system_invoice_type_pb.SystemInvoiceType,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: system_invoice_type_pb.SystemInvoiceTypeList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: system_invoice_type_pb.SystemInvoiceType,
    callback: (error: ServiceError|null, responseMessage: system_invoice_type_pb.SystemInvoiceTypeList|null) => void
  ): UnaryResponse;
  list(requestMessage: system_invoice_type_pb.SystemInvoiceType, metadata?: grpc.Metadata): ResponseStream<system_invoice_type_pb.SystemInvoiceType>;
  update(
    requestMessage: system_invoice_type_pb.SystemInvoiceType,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: system_invoice_type_pb.SystemInvoiceType|null) => void
  ): UnaryResponse;
  update(
    requestMessage: system_invoice_type_pb.SystemInvoiceType,
    callback: (error: ServiceError|null, responseMessage: system_invoice_type_pb.SystemInvoiceType|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: system_invoice_type_pb.SystemInvoiceType,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: system_invoice_type_pb.SystemInvoiceType|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: system_invoice_type_pb.SystemInvoiceType,
    callback: (error: ServiceError|null, responseMessage: system_invoice_type_pb.SystemInvoiceType|null) => void
  ): UnaryResponse;
}

