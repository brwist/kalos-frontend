// package: 
// file: transaction_activity.proto

import * as transaction_activity_pb from "./transaction_activity_pb";
import * as common_pb from "./common_pb";
import {grpc} from "@improbable-eng/grpc-web";

type TransactionActivityServiceCreate = {
  readonly methodName: string;
  readonly service: typeof TransactionActivityService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_activity_pb.TransactionActivity;
  readonly responseType: typeof transaction_activity_pb.TransactionActivity;
};

type TransactionActivityServiceGet = {
  readonly methodName: string;
  readonly service: typeof TransactionActivityService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_activity_pb.TransactionActivity;
  readonly responseType: typeof transaction_activity_pb.TransactionActivity;
};

type TransactionActivityServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof TransactionActivityService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_activity_pb.TransactionActivity;
  readonly responseType: typeof transaction_activity_pb.TransactionActivityList;
};

type TransactionActivityServiceList = {
  readonly methodName: string;
  readonly service: typeof TransactionActivityService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof transaction_activity_pb.TransactionActivity;
  readonly responseType: typeof transaction_activity_pb.TransactionActivity;
};

type TransactionActivityServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof TransactionActivityService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_activity_pb.TransactionActivity;
  readonly responseType: typeof transaction_activity_pb.TransactionActivity;
};

type TransactionActivityServiceDelete = {
  readonly methodName: string;
  readonly service: typeof TransactionActivityService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_activity_pb.TransactionActivity;
  readonly responseType: typeof transaction_activity_pb.TransactionActivity;
};

type TransactionActivityServiceMergeTransactionActivityLogs = {
  readonly methodName: string;
  readonly service: typeof TransactionActivityService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_activity_pb.MergeTransactionIds;
  readonly responseType: typeof common_pb.Empty;
};

export class TransactionActivityService {
  static readonly serviceName: string;
  static readonly Create: TransactionActivityServiceCreate;
  static readonly Get: TransactionActivityServiceGet;
  static readonly BatchGet: TransactionActivityServiceBatchGet;
  static readonly List: TransactionActivityServiceList;
  static readonly Update: TransactionActivityServiceUpdate;
  static readonly Delete: TransactionActivityServiceDelete;
  static readonly MergeTransactionActivityLogs: TransactionActivityServiceMergeTransactionActivityLogs;
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

export class TransactionActivityServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: transaction_activity_pb.TransactionActivity,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_activity_pb.TransactionActivity|null) => void
  ): UnaryResponse;
  create(
    requestMessage: transaction_activity_pb.TransactionActivity,
    callback: (error: ServiceError|null, responseMessage: transaction_activity_pb.TransactionActivity|null) => void
  ): UnaryResponse;
  get(
    requestMessage: transaction_activity_pb.TransactionActivity,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_activity_pb.TransactionActivity|null) => void
  ): UnaryResponse;
  get(
    requestMessage: transaction_activity_pb.TransactionActivity,
    callback: (error: ServiceError|null, responseMessage: transaction_activity_pb.TransactionActivity|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: transaction_activity_pb.TransactionActivity,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_activity_pb.TransactionActivityList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: transaction_activity_pb.TransactionActivity,
    callback: (error: ServiceError|null, responseMessage: transaction_activity_pb.TransactionActivityList|null) => void
  ): UnaryResponse;
  list(requestMessage: transaction_activity_pb.TransactionActivity, metadata?: grpc.Metadata): ResponseStream<transaction_activity_pb.TransactionActivity>;
  update(
    requestMessage: transaction_activity_pb.TransactionActivity,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_activity_pb.TransactionActivity|null) => void
  ): UnaryResponse;
  update(
    requestMessage: transaction_activity_pb.TransactionActivity,
    callback: (error: ServiceError|null, responseMessage: transaction_activity_pb.TransactionActivity|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: transaction_activity_pb.TransactionActivity,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_activity_pb.TransactionActivity|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: transaction_activity_pb.TransactionActivity,
    callback: (error: ServiceError|null, responseMessage: transaction_activity_pb.TransactionActivity|null) => void
  ): UnaryResponse;
  mergeTransactionActivityLogs(
    requestMessage: transaction_activity_pb.MergeTransactionIds,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  mergeTransactionActivityLogs(
    requestMessage: transaction_activity_pb.MergeTransactionIds,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
}

