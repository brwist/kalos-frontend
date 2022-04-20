// package: 
// file: pending_invoice_transaction.proto

import * as pending_invoice_transaction_pb from "./pending_invoice_transaction_pb";
import {grpc} from "@improbable-eng/grpc-web";

type PendingInvoiceTransactionServiceCreate = {
  readonly methodName: string;
  readonly service: typeof PendingInvoiceTransactionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof pending_invoice_transaction_pb.PendingInvoiceTransaction;
  readonly responseType: typeof pending_invoice_transaction_pb.PendingInvoiceTransaction;
};

type PendingInvoiceTransactionServiceGet = {
  readonly methodName: string;
  readonly service: typeof PendingInvoiceTransactionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof pending_invoice_transaction_pb.PendingInvoiceTransaction;
  readonly responseType: typeof pending_invoice_transaction_pb.PendingInvoiceTransaction;
};

type PendingInvoiceTransactionServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof PendingInvoiceTransactionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof pending_invoice_transaction_pb.PendingInvoiceTransaction;
  readonly responseType: typeof pending_invoice_transaction_pb.PendingInvoiceTransactionList;
};

type PendingInvoiceTransactionServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof PendingInvoiceTransactionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof pending_invoice_transaction_pb.PendingInvoiceTransaction;
  readonly responseType: typeof pending_invoice_transaction_pb.PendingInvoiceTransaction;
};

type PendingInvoiceTransactionServiceDelete = {
  readonly methodName: string;
  readonly service: typeof PendingInvoiceTransactionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof pending_invoice_transaction_pb.PendingInvoiceTransaction;
  readonly responseType: typeof pending_invoice_transaction_pb.PendingInvoiceTransaction;
};

export class PendingInvoiceTransactionService {
  static readonly serviceName: string;
  static readonly Create: PendingInvoiceTransactionServiceCreate;
  static readonly Get: PendingInvoiceTransactionServiceGet;
  static readonly BatchGet: PendingInvoiceTransactionServiceBatchGet;
  static readonly Update: PendingInvoiceTransactionServiceUpdate;
  static readonly Delete: PendingInvoiceTransactionServiceDelete;
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

export class PendingInvoiceTransactionServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: pending_invoice_transaction_pb.PendingInvoiceTransaction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: pending_invoice_transaction_pb.PendingInvoiceTransaction|null) => void
  ): UnaryResponse;
  create(
    requestMessage: pending_invoice_transaction_pb.PendingInvoiceTransaction,
    callback: (error: ServiceError|null, responseMessage: pending_invoice_transaction_pb.PendingInvoiceTransaction|null) => void
  ): UnaryResponse;
  get(
    requestMessage: pending_invoice_transaction_pb.PendingInvoiceTransaction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: pending_invoice_transaction_pb.PendingInvoiceTransaction|null) => void
  ): UnaryResponse;
  get(
    requestMessage: pending_invoice_transaction_pb.PendingInvoiceTransaction,
    callback: (error: ServiceError|null, responseMessage: pending_invoice_transaction_pb.PendingInvoiceTransaction|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: pending_invoice_transaction_pb.PendingInvoiceTransaction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: pending_invoice_transaction_pb.PendingInvoiceTransactionList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: pending_invoice_transaction_pb.PendingInvoiceTransaction,
    callback: (error: ServiceError|null, responseMessage: pending_invoice_transaction_pb.PendingInvoiceTransactionList|null) => void
  ): UnaryResponse;
  update(
    requestMessage: pending_invoice_transaction_pb.PendingInvoiceTransaction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: pending_invoice_transaction_pb.PendingInvoiceTransaction|null) => void
  ): UnaryResponse;
  update(
    requestMessage: pending_invoice_transaction_pb.PendingInvoiceTransaction,
    callback: (error: ServiceError|null, responseMessage: pending_invoice_transaction_pb.PendingInvoiceTransaction|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: pending_invoice_transaction_pb.PendingInvoiceTransaction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: pending_invoice_transaction_pb.PendingInvoiceTransaction|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: pending_invoice_transaction_pb.PendingInvoiceTransaction,
    callback: (error: ServiceError|null, responseMessage: pending_invoice_transaction_pb.PendingInvoiceTransaction|null) => void
  ): UnaryResponse;
}

