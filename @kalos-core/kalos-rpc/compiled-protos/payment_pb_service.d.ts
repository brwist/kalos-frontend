// package: 
// file: payment.proto

import * as payment_pb from "./payment_pb";
import {grpc} from "@improbable-eng/grpc-web";

type PaymentServiceCreate = {
  readonly methodName: string;
  readonly service: typeof PaymentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof payment_pb.Payment;
  readonly responseType: typeof payment_pb.Payment;
};

type PaymentServiceGet = {
  readonly methodName: string;
  readonly service: typeof PaymentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof payment_pb.Payment;
  readonly responseType: typeof payment_pb.Payment;
};

type PaymentServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof PaymentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof payment_pb.Payment;
  readonly responseType: typeof payment_pb.PaymentList;
};

type PaymentServiceList = {
  readonly methodName: string;
  readonly service: typeof PaymentService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof payment_pb.Payment;
  readonly responseType: typeof payment_pb.Payment;
};

type PaymentServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof PaymentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof payment_pb.Payment;
  readonly responseType: typeof payment_pb.Payment;
};

type PaymentServiceDelete = {
  readonly methodName: string;
  readonly service: typeof PaymentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof payment_pb.Payment;
  readonly responseType: typeof payment_pb.Payment;
};

export class PaymentService {
  static readonly serviceName: string;
  static readonly Create: PaymentServiceCreate;
  static readonly Get: PaymentServiceGet;
  static readonly BatchGet: PaymentServiceBatchGet;
  static readonly List: PaymentServiceList;
  static readonly Update: PaymentServiceUpdate;
  static readonly Delete: PaymentServiceDelete;
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

export class PaymentServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: payment_pb.Payment,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: payment_pb.Payment|null) => void
  ): UnaryResponse;
  create(
    requestMessage: payment_pb.Payment,
    callback: (error: ServiceError|null, responseMessage: payment_pb.Payment|null) => void
  ): UnaryResponse;
  get(
    requestMessage: payment_pb.Payment,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: payment_pb.Payment|null) => void
  ): UnaryResponse;
  get(
    requestMessage: payment_pb.Payment,
    callback: (error: ServiceError|null, responseMessage: payment_pb.Payment|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: payment_pb.Payment,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: payment_pb.PaymentList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: payment_pb.Payment,
    callback: (error: ServiceError|null, responseMessage: payment_pb.PaymentList|null) => void
  ): UnaryResponse;
  list(requestMessage: payment_pb.Payment, metadata?: grpc.Metadata): ResponseStream<payment_pb.Payment>;
  update(
    requestMessage: payment_pb.Payment,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: payment_pb.Payment|null) => void
  ): UnaryResponse;
  update(
    requestMessage: payment_pb.Payment,
    callback: (error: ServiceError|null, responseMessage: payment_pb.Payment|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: payment_pb.Payment,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: payment_pb.Payment|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: payment_pb.Payment,
    callback: (error: ServiceError|null, responseMessage: payment_pb.Payment|null) => void
  ): UnaryResponse;
}

