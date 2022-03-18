// package: 
// file: invoice.proto

import * as invoice_pb from "./invoice_pb";
import {grpc} from "@improbable-eng/grpc-web";

type InvoiceServiceCreate = {
  readonly methodName: string;
  readonly service: typeof InvoiceService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof invoice_pb.Invoice;
  readonly responseType: typeof invoice_pb.Invoice;
};

type InvoiceServiceGet = {
  readonly methodName: string;
  readonly service: typeof InvoiceService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof invoice_pb.Invoice;
  readonly responseType: typeof invoice_pb.Invoice;
};

type InvoiceServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof InvoiceService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof invoice_pb.Invoice;
  readonly responseType: typeof invoice_pb.InvoiceList;
};

type InvoiceServiceList = {
  readonly methodName: string;
  readonly service: typeof InvoiceService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof invoice_pb.Invoice;
  readonly responseType: typeof invoice_pb.Invoice;
};

type InvoiceServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof InvoiceService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof invoice_pb.Invoice;
  readonly responseType: typeof invoice_pb.Invoice;
};

type InvoiceServiceDelete = {
  readonly methodName: string;
  readonly service: typeof InvoiceService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof invoice_pb.Invoice;
  readonly responseType: typeof invoice_pb.Invoice;
};

export class InvoiceService {
  static readonly serviceName: string;
  static readonly Create: InvoiceServiceCreate;
  static readonly Get: InvoiceServiceGet;
  static readonly BatchGet: InvoiceServiceBatchGet;
  static readonly List: InvoiceServiceList;
  static readonly Update: InvoiceServiceUpdate;
  static readonly Delete: InvoiceServiceDelete;
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

export class InvoiceServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: invoice_pb.Invoice,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: invoice_pb.Invoice|null) => void
  ): UnaryResponse;
  create(
    requestMessage: invoice_pb.Invoice,
    callback: (error: ServiceError|null, responseMessage: invoice_pb.Invoice|null) => void
  ): UnaryResponse;
  get(
    requestMessage: invoice_pb.Invoice,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: invoice_pb.Invoice|null) => void
  ): UnaryResponse;
  get(
    requestMessage: invoice_pb.Invoice,
    callback: (error: ServiceError|null, responseMessage: invoice_pb.Invoice|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: invoice_pb.Invoice,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: invoice_pb.InvoiceList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: invoice_pb.Invoice,
    callback: (error: ServiceError|null, responseMessage: invoice_pb.InvoiceList|null) => void
  ): UnaryResponse;
  list(requestMessage: invoice_pb.Invoice, metadata?: grpc.Metadata): ResponseStream<invoice_pb.Invoice>;
  update(
    requestMessage: invoice_pb.Invoice,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: invoice_pb.Invoice|null) => void
  ): UnaryResponse;
  update(
    requestMessage: invoice_pb.Invoice,
    callback: (error: ServiceError|null, responseMessage: invoice_pb.Invoice|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: invoice_pb.Invoice,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: invoice_pb.Invoice|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: invoice_pb.Invoice,
    callback: (error: ServiceError|null, responseMessage: invoice_pb.Invoice|null) => void
  ): UnaryResponse;
}

