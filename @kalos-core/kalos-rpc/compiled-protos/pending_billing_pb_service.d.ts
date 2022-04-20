// package: 
// file: pending_billing.proto

import * as pending_billing_pb from "./pending_billing_pb";
import {grpc} from "@improbable-eng/grpc-web";

type PendingBillingServiceGet = {
  readonly methodName: string;
  readonly service: typeof PendingBillingService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof pending_billing_pb.PendingBilling;
  readonly responseType: typeof pending_billing_pb.PendingBilling;
};

type PendingBillingServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof PendingBillingService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof pending_billing_pb.PendingBilling;
  readonly responseType: typeof pending_billing_pb.PendingBillingList;
};

type PendingBillingServiceList = {
  readonly methodName: string;
  readonly service: typeof PendingBillingService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof pending_billing_pb.PendingBilling;
  readonly responseType: typeof pending_billing_pb.PendingBilling;
};

export class PendingBillingService {
  static readonly serviceName: string;
  static readonly Get: PendingBillingServiceGet;
  static readonly BatchGet: PendingBillingServiceBatchGet;
  static readonly List: PendingBillingServiceList;
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

export class PendingBillingServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  get(
    requestMessage: pending_billing_pb.PendingBilling,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: pending_billing_pb.PendingBilling|null) => void
  ): UnaryResponse;
  get(
    requestMessage: pending_billing_pb.PendingBilling,
    callback: (error: ServiceError|null, responseMessage: pending_billing_pb.PendingBilling|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: pending_billing_pb.PendingBilling,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: pending_billing_pb.PendingBillingList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: pending_billing_pb.PendingBilling,
    callback: (error: ServiceError|null, responseMessage: pending_billing_pb.PendingBillingList|null) => void
  ): UnaryResponse;
  list(requestMessage: pending_billing_pb.PendingBilling, metadata?: grpc.Metadata): ResponseStream<pending_billing_pb.PendingBilling>;
}

