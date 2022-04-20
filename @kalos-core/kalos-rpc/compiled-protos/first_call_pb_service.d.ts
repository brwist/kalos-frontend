// package: 
// file: first_call.proto

import * as first_call_pb from "./first_call_pb";
import {grpc} from "@improbable-eng/grpc-web";

type FirstCallServiceCreate = {
  readonly methodName: string;
  readonly service: typeof FirstCallService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof first_call_pb.FirstCall;
  readonly responseType: typeof first_call_pb.FirstCall;
};

type FirstCallServiceGet = {
  readonly methodName: string;
  readonly service: typeof FirstCallService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof first_call_pb.FirstCall;
  readonly responseType: typeof first_call_pb.FirstCall;
};

type FirstCallServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof FirstCallService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof first_call_pb.FirstCall;
  readonly responseType: typeof first_call_pb.FirstCallList;
};

type FirstCallServiceList = {
  readonly methodName: string;
  readonly service: typeof FirstCallService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof first_call_pb.FirstCall;
  readonly responseType: typeof first_call_pb.FirstCall;
};

type FirstCallServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof FirstCallService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof first_call_pb.FirstCall;
  readonly responseType: typeof first_call_pb.FirstCall;
};

type FirstCallServiceDelete = {
  readonly methodName: string;
  readonly service: typeof FirstCallService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof first_call_pb.FirstCall;
  readonly responseType: typeof first_call_pb.FirstCall;
};

export class FirstCallService {
  static readonly serviceName: string;
  static readonly Create: FirstCallServiceCreate;
  static readonly Get: FirstCallServiceGet;
  static readonly BatchGet: FirstCallServiceBatchGet;
  static readonly List: FirstCallServiceList;
  static readonly Update: FirstCallServiceUpdate;
  static readonly Delete: FirstCallServiceDelete;
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

export class FirstCallServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: first_call_pb.FirstCall,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: first_call_pb.FirstCall|null) => void
  ): UnaryResponse;
  create(
    requestMessage: first_call_pb.FirstCall,
    callback: (error: ServiceError|null, responseMessage: first_call_pb.FirstCall|null) => void
  ): UnaryResponse;
  get(
    requestMessage: first_call_pb.FirstCall,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: first_call_pb.FirstCall|null) => void
  ): UnaryResponse;
  get(
    requestMessage: first_call_pb.FirstCall,
    callback: (error: ServiceError|null, responseMessage: first_call_pb.FirstCall|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: first_call_pb.FirstCall,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: first_call_pb.FirstCallList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: first_call_pb.FirstCall,
    callback: (error: ServiceError|null, responseMessage: first_call_pb.FirstCallList|null) => void
  ): UnaryResponse;
  list(requestMessage: first_call_pb.FirstCall, metadata?: grpc.Metadata): ResponseStream<first_call_pb.FirstCall>;
  update(
    requestMessage: first_call_pb.FirstCall,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: first_call_pb.FirstCall|null) => void
  ): UnaryResponse;
  update(
    requestMessage: first_call_pb.FirstCall,
    callback: (error: ServiceError|null, responseMessage: first_call_pb.FirstCall|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: first_call_pb.FirstCall,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: first_call_pb.FirstCall|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: first_call_pb.FirstCall,
    callback: (error: ServiceError|null, responseMessage: first_call_pb.FirstCall|null) => void
  ): UnaryResponse;
}

