// package: 
// file: api_key.proto

import * as api_key_pb from "./api_key_pb";
import {grpc} from "@improbable-eng/grpc-web";

type ApiKeyServiceCreate = {
  readonly methodName: string;
  readonly service: typeof ApiKeyService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof api_key_pb.ApiKey;
  readonly responseType: typeof api_key_pb.ApiKey;
};

type ApiKeyServiceGet = {
  readonly methodName: string;
  readonly service: typeof ApiKeyService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof api_key_pb.ApiKey;
  readonly responseType: typeof api_key_pb.ApiKey;
};

type ApiKeyServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof ApiKeyService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof api_key_pb.ApiKey;
  readonly responseType: typeof api_key_pb.ApiKeyList;
};

type ApiKeyServiceList = {
  readonly methodName: string;
  readonly service: typeof ApiKeyService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof api_key_pb.ApiKey;
  readonly responseType: typeof api_key_pb.ApiKey;
};

type ApiKeyServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof ApiKeyService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof api_key_pb.ApiKey;
  readonly responseType: typeof api_key_pb.ApiKey;
};

type ApiKeyServiceDelete = {
  readonly methodName: string;
  readonly service: typeof ApiKeyService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof api_key_pb.ApiKey;
  readonly responseType: typeof api_key_pb.ApiKey;
};

export class ApiKeyService {
  static readonly serviceName: string;
  static readonly Create: ApiKeyServiceCreate;
  static readonly Get: ApiKeyServiceGet;
  static readonly BatchGet: ApiKeyServiceBatchGet;
  static readonly List: ApiKeyServiceList;
  static readonly Update: ApiKeyServiceUpdate;
  static readonly Delete: ApiKeyServiceDelete;
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

export class ApiKeyServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: api_key_pb.ApiKey,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: api_key_pb.ApiKey|null) => void
  ): UnaryResponse;
  create(
    requestMessage: api_key_pb.ApiKey,
    callback: (error: ServiceError|null, responseMessage: api_key_pb.ApiKey|null) => void
  ): UnaryResponse;
  get(
    requestMessage: api_key_pb.ApiKey,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: api_key_pb.ApiKey|null) => void
  ): UnaryResponse;
  get(
    requestMessage: api_key_pb.ApiKey,
    callback: (error: ServiceError|null, responseMessage: api_key_pb.ApiKey|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: api_key_pb.ApiKey,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: api_key_pb.ApiKeyList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: api_key_pb.ApiKey,
    callback: (error: ServiceError|null, responseMessage: api_key_pb.ApiKeyList|null) => void
  ): UnaryResponse;
  list(requestMessage: api_key_pb.ApiKey, metadata?: grpc.Metadata): ResponseStream<api_key_pb.ApiKey>;
  update(
    requestMessage: api_key_pb.ApiKey,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: api_key_pb.ApiKey|null) => void
  ): UnaryResponse;
  update(
    requestMessage: api_key_pb.ApiKey,
    callback: (error: ServiceError|null, responseMessage: api_key_pb.ApiKey|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: api_key_pb.ApiKey,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: api_key_pb.ApiKey|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: api_key_pb.ApiKey,
    callback: (error: ServiceError|null, responseMessage: api_key_pb.ApiKey|null) => void
  ): UnaryResponse;
}

