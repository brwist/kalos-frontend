// package: 
// file: prompt_payment_rebate.proto

import * as prompt_payment_rebate_pb from "./prompt_payment_rebate_pb";
import {grpc} from "@improbable-eng/grpc-web";

type PromptPaymentRebateServiceCreate = {
  readonly methodName: string;
  readonly service: typeof PromptPaymentRebateService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof prompt_payment_rebate_pb.PromptPaymentRebate;
  readonly responseType: typeof prompt_payment_rebate_pb.PromptPaymentRebate;
};

type PromptPaymentRebateServiceGet = {
  readonly methodName: string;
  readonly service: typeof PromptPaymentRebateService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof prompt_payment_rebate_pb.PromptPaymentRebate;
  readonly responseType: typeof prompt_payment_rebate_pb.PromptPaymentRebate;
};

type PromptPaymentRebateServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof PromptPaymentRebateService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof prompt_payment_rebate_pb.PromptPaymentRebate;
  readonly responseType: typeof prompt_payment_rebate_pb.PromptPaymentRebateList;
};

type PromptPaymentRebateServiceList = {
  readonly methodName: string;
  readonly service: typeof PromptPaymentRebateService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof prompt_payment_rebate_pb.PromptPaymentRebate;
  readonly responseType: typeof prompt_payment_rebate_pb.PromptPaymentRebate;
};

type PromptPaymentRebateServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof PromptPaymentRebateService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof prompt_payment_rebate_pb.PromptPaymentRebate;
  readonly responseType: typeof prompt_payment_rebate_pb.PromptPaymentRebate;
};

type PromptPaymentRebateServiceDelete = {
  readonly methodName: string;
  readonly service: typeof PromptPaymentRebateService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof prompt_payment_rebate_pb.PromptPaymentRebate;
  readonly responseType: typeof prompt_payment_rebate_pb.PromptPaymentRebate;
};

export class PromptPaymentRebateService {
  static readonly serviceName: string;
  static readonly Create: PromptPaymentRebateServiceCreate;
  static readonly Get: PromptPaymentRebateServiceGet;
  static readonly BatchGet: PromptPaymentRebateServiceBatchGet;
  static readonly List: PromptPaymentRebateServiceList;
  static readonly Update: PromptPaymentRebateServiceUpdate;
  static readonly Delete: PromptPaymentRebateServiceDelete;
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

export class PromptPaymentRebateServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: prompt_payment_rebate_pb.PromptPaymentRebate,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: prompt_payment_rebate_pb.PromptPaymentRebate|null) => void
  ): UnaryResponse;
  create(
    requestMessage: prompt_payment_rebate_pb.PromptPaymentRebate,
    callback: (error: ServiceError|null, responseMessage: prompt_payment_rebate_pb.PromptPaymentRebate|null) => void
  ): UnaryResponse;
  get(
    requestMessage: prompt_payment_rebate_pb.PromptPaymentRebate,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: prompt_payment_rebate_pb.PromptPaymentRebate|null) => void
  ): UnaryResponse;
  get(
    requestMessage: prompt_payment_rebate_pb.PromptPaymentRebate,
    callback: (error: ServiceError|null, responseMessage: prompt_payment_rebate_pb.PromptPaymentRebate|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: prompt_payment_rebate_pb.PromptPaymentRebate,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: prompt_payment_rebate_pb.PromptPaymentRebateList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: prompt_payment_rebate_pb.PromptPaymentRebate,
    callback: (error: ServiceError|null, responseMessage: prompt_payment_rebate_pb.PromptPaymentRebateList|null) => void
  ): UnaryResponse;
  list(requestMessage: prompt_payment_rebate_pb.PromptPaymentRebate, metadata?: grpc.Metadata): ResponseStream<prompt_payment_rebate_pb.PromptPaymentRebate>;
  update(
    requestMessage: prompt_payment_rebate_pb.PromptPaymentRebate,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: prompt_payment_rebate_pb.PromptPaymentRebate|null) => void
  ): UnaryResponse;
  update(
    requestMessage: prompt_payment_rebate_pb.PromptPaymentRebate,
    callback: (error: ServiceError|null, responseMessage: prompt_payment_rebate_pb.PromptPaymentRebate|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: prompt_payment_rebate_pb.PromptPaymentRebate,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: prompt_payment_rebate_pb.PromptPaymentRebate|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: prompt_payment_rebate_pb.PromptPaymentRebate,
    callback: (error: ServiceError|null, responseMessage: prompt_payment_rebate_pb.PromptPaymentRebate|null) => void
  ): UnaryResponse;
}

