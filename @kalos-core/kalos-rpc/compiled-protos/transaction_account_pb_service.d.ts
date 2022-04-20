// package: 
// file: transaction_account.proto

import * as transaction_account_pb from "./transaction_account_pb";
import {grpc} from "@improbable-eng/grpc-web";

type TransactionAccountServiceCreate = {
  readonly methodName: string;
  readonly service: typeof TransactionAccountService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_account_pb.TransactionAccount;
  readonly responseType: typeof transaction_account_pb.TransactionAccount;
};

type TransactionAccountServiceGet = {
  readonly methodName: string;
  readonly service: typeof TransactionAccountService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_account_pb.TransactionAccount;
  readonly responseType: typeof transaction_account_pb.TransactionAccount;
};

type TransactionAccountServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof TransactionAccountService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_account_pb.TransactionAccount;
  readonly responseType: typeof transaction_account_pb.TransactionAccountList;
};

type TransactionAccountServiceList = {
  readonly methodName: string;
  readonly service: typeof TransactionAccountService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof transaction_account_pb.TransactionAccount;
  readonly responseType: typeof transaction_account_pb.TransactionAccount;
};

type TransactionAccountServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof TransactionAccountService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_account_pb.TransactionAccount;
  readonly responseType: typeof transaction_account_pb.TransactionAccount;
};

type TransactionAccountServiceDelete = {
  readonly methodName: string;
  readonly service: typeof TransactionAccountService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_account_pb.TransactionAccount;
  readonly responseType: typeof transaction_account_pb.TransactionAccount;
};

export class TransactionAccountService {
  static readonly serviceName: string;
  static readonly Create: TransactionAccountServiceCreate;
  static readonly Get: TransactionAccountServiceGet;
  static readonly BatchGet: TransactionAccountServiceBatchGet;
  static readonly List: TransactionAccountServiceList;
  static readonly Update: TransactionAccountServiceUpdate;
  static readonly Delete: TransactionAccountServiceDelete;
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

export class TransactionAccountServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: transaction_account_pb.TransactionAccount,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_account_pb.TransactionAccount|null) => void
  ): UnaryResponse;
  create(
    requestMessage: transaction_account_pb.TransactionAccount,
    callback: (error: ServiceError|null, responseMessage: transaction_account_pb.TransactionAccount|null) => void
  ): UnaryResponse;
  get(
    requestMessage: transaction_account_pb.TransactionAccount,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_account_pb.TransactionAccount|null) => void
  ): UnaryResponse;
  get(
    requestMessage: transaction_account_pb.TransactionAccount,
    callback: (error: ServiceError|null, responseMessage: transaction_account_pb.TransactionAccount|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: transaction_account_pb.TransactionAccount,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_account_pb.TransactionAccountList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: transaction_account_pb.TransactionAccount,
    callback: (error: ServiceError|null, responseMessage: transaction_account_pb.TransactionAccountList|null) => void
  ): UnaryResponse;
  list(requestMessage: transaction_account_pb.TransactionAccount, metadata?: grpc.Metadata): ResponseStream<transaction_account_pb.TransactionAccount>;
  update(
    requestMessage: transaction_account_pb.TransactionAccount,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_account_pb.TransactionAccount|null) => void
  ): UnaryResponse;
  update(
    requestMessage: transaction_account_pb.TransactionAccount,
    callback: (error: ServiceError|null, responseMessage: transaction_account_pb.TransactionAccount|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: transaction_account_pb.TransactionAccount,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_account_pb.TransactionAccount|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: transaction_account_pb.TransactionAccount,
    callback: (error: ServiceError|null, responseMessage: transaction_account_pb.TransactionAccount|null) => void
  ): UnaryResponse;
}

