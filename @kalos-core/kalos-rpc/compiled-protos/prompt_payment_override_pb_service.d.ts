// package: 
// file: prompt_payment_override.proto

import * as prompt_payment_override_pb from "./prompt_payment_override_pb";
import {grpc} from "@improbable-eng/grpc-web";

type PromptPaymentOverrideServiceCreate = {
  readonly methodName: string;
  readonly service: typeof PromptPaymentOverrideService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof prompt_payment_override_pb.PromptPaymentOverride;
  readonly responseType: typeof prompt_payment_override_pb.PromptPaymentOverride;
};

type PromptPaymentOverrideServiceGet = {
  readonly methodName: string;
  readonly service: typeof PromptPaymentOverrideService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof prompt_payment_override_pb.PromptPaymentOverride;
  readonly responseType: typeof prompt_payment_override_pb.PromptPaymentOverride;
};

type PromptPaymentOverrideServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof PromptPaymentOverrideService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof prompt_payment_override_pb.PromptPaymentOverride;
  readonly responseType: typeof prompt_payment_override_pb.PromptPaymentOverrideList;
};

type PromptPaymentOverrideServiceList = {
  readonly methodName: string;
  readonly service: typeof PromptPaymentOverrideService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof prompt_payment_override_pb.PromptPaymentOverride;
  readonly responseType: typeof prompt_payment_override_pb.PromptPaymentOverride;
};

type PromptPaymentOverrideServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof PromptPaymentOverrideService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof prompt_payment_override_pb.PromptPaymentOverride;
  readonly responseType: typeof prompt_payment_override_pb.PromptPaymentOverride;
};

type PromptPaymentOverrideServiceDelete = {
  readonly methodName: string;
  readonly service: typeof PromptPaymentOverrideService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof prompt_payment_override_pb.PromptPaymentOverride;
  readonly responseType: typeof prompt_payment_override_pb.PromptPaymentOverride;
};

export class PromptPaymentOverrideService {
  static readonly serviceName: string;
  static readonly Create: PromptPaymentOverrideServiceCreate;
  static readonly Get: PromptPaymentOverrideServiceGet;
  static readonly BatchGet: PromptPaymentOverrideServiceBatchGet;
  static readonly List: PromptPaymentOverrideServiceList;
  static readonly Update: PromptPaymentOverrideServiceUpdate;
  static readonly Delete: PromptPaymentOverrideServiceDelete;
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

export class PromptPaymentOverrideServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: prompt_payment_override_pb.PromptPaymentOverride,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: prompt_payment_override_pb.PromptPaymentOverride|null) => void
  ): UnaryResponse;
  create(
    requestMessage: prompt_payment_override_pb.PromptPaymentOverride,
    callback: (error: ServiceError|null, responseMessage: prompt_payment_override_pb.PromptPaymentOverride|null) => void
  ): UnaryResponse;
  get(
    requestMessage: prompt_payment_override_pb.PromptPaymentOverride,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: prompt_payment_override_pb.PromptPaymentOverride|null) => void
  ): UnaryResponse;
  get(
    requestMessage: prompt_payment_override_pb.PromptPaymentOverride,
    callback: (error: ServiceError|null, responseMessage: prompt_payment_override_pb.PromptPaymentOverride|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: prompt_payment_override_pb.PromptPaymentOverride,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: prompt_payment_override_pb.PromptPaymentOverrideList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: prompt_payment_override_pb.PromptPaymentOverride,
    callback: (error: ServiceError|null, responseMessage: prompt_payment_override_pb.PromptPaymentOverrideList|null) => void
  ): UnaryResponse;
  list(requestMessage: prompt_payment_override_pb.PromptPaymentOverride, metadata?: grpc.Metadata): ResponseStream<prompt_payment_override_pb.PromptPaymentOverride>;
  update(
    requestMessage: prompt_payment_override_pb.PromptPaymentOverride,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: prompt_payment_override_pb.PromptPaymentOverride|null) => void
  ): UnaryResponse;
  update(
    requestMessage: prompt_payment_override_pb.PromptPaymentOverride,
    callback: (error: ServiceError|null, responseMessage: prompt_payment_override_pb.PromptPaymentOverride|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: prompt_payment_override_pb.PromptPaymentOverride,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: prompt_payment_override_pb.PromptPaymentOverride|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: prompt_payment_override_pb.PromptPaymentOverride,
    callback: (error: ServiceError|null, responseMessage: prompt_payment_override_pb.PromptPaymentOverride|null) => void
  ): UnaryResponse;
}

