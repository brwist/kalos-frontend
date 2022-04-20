// package: 
// file: transaction.proto

import * as transaction_pb from "./transaction_pb";
import * as transaction_account_pb from "./transaction_account_pb";
import {grpc} from "@improbable-eng/grpc-web";

type TransactionServiceCreate = {
  readonly methodName: string;
  readonly service: typeof TransactionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_pb.Transaction;
  readonly responseType: typeof transaction_pb.Transaction;
};

type TransactionServiceGet = {
  readonly methodName: string;
  readonly service: typeof TransactionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_pb.Transaction;
  readonly responseType: typeof transaction_pb.Transaction;
};

type TransactionServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof TransactionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_pb.Transaction;
  readonly responseType: typeof transaction_pb.TransactionList;
};

type TransactionServiceList = {
  readonly methodName: string;
  readonly service: typeof TransactionService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof transaction_pb.Transaction;
  readonly responseType: typeof transaction_pb.Transaction;
};

type TransactionServiceSearch = {
  readonly methodName: string;
  readonly service: typeof TransactionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_pb.Transaction;
  readonly responseType: typeof transaction_pb.TransactionList;
};

type TransactionServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof TransactionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_pb.Transaction;
  readonly responseType: typeof transaction_pb.Transaction;
};

type TransactionServiceDelete = {
  readonly methodName: string;
  readonly service: typeof TransactionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_pb.Transaction;
  readonly responseType: typeof transaction_pb.Transaction;
};

type TransactionServiceRecordPage = {
  readonly methodName: string;
  readonly service: typeof TransactionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_pb.RecordPageReq;
  readonly responseType: typeof transaction_pb.TransactionList;
};

type TransactionServiceCreateTransactionAccount = {
  readonly methodName: string;
  readonly service: typeof TransactionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_account_pb.TransactionAccount;
  readonly responseType: typeof transaction_account_pb.TransactionAccount;
};

type TransactionServiceGetTransactionAccount = {
  readonly methodName: string;
  readonly service: typeof TransactionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_account_pb.TransactionAccount;
  readonly responseType: typeof transaction_account_pb.TransactionAccount;
};

type TransactionServiceBatchGetTransactionAccount = {
  readonly methodName: string;
  readonly service: typeof TransactionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_account_pb.TransactionAccount;
  readonly responseType: typeof transaction_account_pb.TransactionAccountList;
};

type TransactionServiceUpdateTransactionAccount = {
  readonly methodName: string;
  readonly service: typeof TransactionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_account_pb.TransactionAccount;
  readonly responseType: typeof transaction_account_pb.TransactionAccount;
};

type TransactionServiceDeleteTransactionAccount = {
  readonly methodName: string;
  readonly service: typeof TransactionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_account_pb.TransactionAccount;
  readonly responseType: typeof transaction_account_pb.TransactionAccount;
};

export class TransactionService {
  static readonly serviceName: string;
  static readonly Create: TransactionServiceCreate;
  static readonly Get: TransactionServiceGet;
  static readonly BatchGet: TransactionServiceBatchGet;
  static readonly List: TransactionServiceList;
  static readonly Search: TransactionServiceSearch;
  static readonly Update: TransactionServiceUpdate;
  static readonly Delete: TransactionServiceDelete;
  static readonly RecordPage: TransactionServiceRecordPage;
  static readonly CreateTransactionAccount: TransactionServiceCreateTransactionAccount;
  static readonly GetTransactionAccount: TransactionServiceGetTransactionAccount;
  static readonly BatchGetTransactionAccount: TransactionServiceBatchGetTransactionAccount;
  static readonly UpdateTransactionAccount: TransactionServiceUpdateTransactionAccount;
  static readonly DeleteTransactionAccount: TransactionServiceDeleteTransactionAccount;
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

export class TransactionServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: transaction_pb.Transaction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_pb.Transaction|null) => void
  ): UnaryResponse;
  create(
    requestMessage: transaction_pb.Transaction,
    callback: (error: ServiceError|null, responseMessage: transaction_pb.Transaction|null) => void
  ): UnaryResponse;
  get(
    requestMessage: transaction_pb.Transaction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_pb.Transaction|null) => void
  ): UnaryResponse;
  get(
    requestMessage: transaction_pb.Transaction,
    callback: (error: ServiceError|null, responseMessage: transaction_pb.Transaction|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: transaction_pb.Transaction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_pb.TransactionList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: transaction_pb.Transaction,
    callback: (error: ServiceError|null, responseMessage: transaction_pb.TransactionList|null) => void
  ): UnaryResponse;
  list(requestMessage: transaction_pb.Transaction, metadata?: grpc.Metadata): ResponseStream<transaction_pb.Transaction>;
  search(
    requestMessage: transaction_pb.Transaction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_pb.TransactionList|null) => void
  ): UnaryResponse;
  search(
    requestMessage: transaction_pb.Transaction,
    callback: (error: ServiceError|null, responseMessage: transaction_pb.TransactionList|null) => void
  ): UnaryResponse;
  update(
    requestMessage: transaction_pb.Transaction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_pb.Transaction|null) => void
  ): UnaryResponse;
  update(
    requestMessage: transaction_pb.Transaction,
    callback: (error: ServiceError|null, responseMessage: transaction_pb.Transaction|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: transaction_pb.Transaction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_pb.Transaction|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: transaction_pb.Transaction,
    callback: (error: ServiceError|null, responseMessage: transaction_pb.Transaction|null) => void
  ): UnaryResponse;
  recordPage(
    requestMessage: transaction_pb.RecordPageReq,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_pb.TransactionList|null) => void
  ): UnaryResponse;
  recordPage(
    requestMessage: transaction_pb.RecordPageReq,
    callback: (error: ServiceError|null, responseMessage: transaction_pb.TransactionList|null) => void
  ): UnaryResponse;
  createTransactionAccount(
    requestMessage: transaction_account_pb.TransactionAccount,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_account_pb.TransactionAccount|null) => void
  ): UnaryResponse;
  createTransactionAccount(
    requestMessage: transaction_account_pb.TransactionAccount,
    callback: (error: ServiceError|null, responseMessage: transaction_account_pb.TransactionAccount|null) => void
  ): UnaryResponse;
  getTransactionAccount(
    requestMessage: transaction_account_pb.TransactionAccount,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_account_pb.TransactionAccount|null) => void
  ): UnaryResponse;
  getTransactionAccount(
    requestMessage: transaction_account_pb.TransactionAccount,
    callback: (error: ServiceError|null, responseMessage: transaction_account_pb.TransactionAccount|null) => void
  ): UnaryResponse;
  batchGetTransactionAccount(
    requestMessage: transaction_account_pb.TransactionAccount,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_account_pb.TransactionAccountList|null) => void
  ): UnaryResponse;
  batchGetTransactionAccount(
    requestMessage: transaction_account_pb.TransactionAccount,
    callback: (error: ServiceError|null, responseMessage: transaction_account_pb.TransactionAccountList|null) => void
  ): UnaryResponse;
  updateTransactionAccount(
    requestMessage: transaction_account_pb.TransactionAccount,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_account_pb.TransactionAccount|null) => void
  ): UnaryResponse;
  updateTransactionAccount(
    requestMessage: transaction_account_pb.TransactionAccount,
    callback: (error: ServiceError|null, responseMessage: transaction_account_pb.TransactionAccount|null) => void
  ): UnaryResponse;
  deleteTransactionAccount(
    requestMessage: transaction_account_pb.TransactionAccount,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_account_pb.TransactionAccount|null) => void
  ): UnaryResponse;
  deleteTransactionAccount(
    requestMessage: transaction_account_pb.TransactionAccount,
    callback: (error: ServiceError|null, responseMessage: transaction_account_pb.TransactionAccount|null) => void
  ): UnaryResponse;
}

