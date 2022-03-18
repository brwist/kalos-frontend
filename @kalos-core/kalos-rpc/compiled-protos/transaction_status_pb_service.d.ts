// package: 
// file: transaction_status.proto

import * as transaction_status_pb from "./transaction_status_pb";
import {grpc} from "@improbable-eng/grpc-web";

type TransactionStatusServiceGet = {
  readonly methodName: string;
  readonly service: typeof TransactionStatusService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_status_pb.TransactionStatus;
  readonly responseType: typeof transaction_status_pb.TransactionStatus;
};

type TransactionStatusServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof TransactionStatusService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof transaction_status_pb.TransactionStatus;
  readonly responseType: typeof transaction_status_pb.TransactionStatusList;
};

type TransactionStatusServiceList = {
  readonly methodName: string;
  readonly service: typeof TransactionStatusService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof transaction_status_pb.TransactionStatus;
  readonly responseType: typeof transaction_status_pb.TransactionStatus;
};

export class TransactionStatusService {
  static readonly serviceName: string;
  static readonly Get: TransactionStatusServiceGet;
  static readonly BatchGet: TransactionStatusServiceBatchGet;
  static readonly List: TransactionStatusServiceList;
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

export class TransactionStatusServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  get(
    requestMessage: transaction_status_pb.TransactionStatus,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_status_pb.TransactionStatus|null) => void
  ): UnaryResponse;
  get(
    requestMessage: transaction_status_pb.TransactionStatus,
    callback: (error: ServiceError|null, responseMessage: transaction_status_pb.TransactionStatus|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: transaction_status_pb.TransactionStatus,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: transaction_status_pb.TransactionStatusList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: transaction_status_pb.TransactionStatus,
    callback: (error: ServiceError|null, responseMessage: transaction_status_pb.TransactionStatusList|null) => void
  ): UnaryResponse;
  list(requestMessage: transaction_status_pb.TransactionStatus, metadata?: grpc.Metadata): ResponseStream<transaction_status_pb.TransactionStatus>;
}

