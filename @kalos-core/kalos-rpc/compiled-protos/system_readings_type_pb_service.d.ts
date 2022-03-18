// package: 
// file: system_readings_type.proto

import * as system_readings_type_pb from "./system_readings_type_pb";
import {grpc} from "@improbable-eng/grpc-web";

type SystemReadingsTypeServiceCreate = {
  readonly methodName: string;
  readonly service: typeof SystemReadingsTypeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof system_readings_type_pb.SystemReadingsType;
  readonly responseType: typeof system_readings_type_pb.SystemReadingsType;
};

type SystemReadingsTypeServiceGet = {
  readonly methodName: string;
  readonly service: typeof SystemReadingsTypeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof system_readings_type_pb.SystemReadingsType;
  readonly responseType: typeof system_readings_type_pb.SystemReadingsType;
};

type SystemReadingsTypeServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof SystemReadingsTypeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof system_readings_type_pb.SystemReadingsType;
  readonly responseType: typeof system_readings_type_pb.SystemReadingsTypeList;
};

type SystemReadingsTypeServiceList = {
  readonly methodName: string;
  readonly service: typeof SystemReadingsTypeService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof system_readings_type_pb.SystemReadingsType;
  readonly responseType: typeof system_readings_type_pb.SystemReadingsType;
};

type SystemReadingsTypeServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof SystemReadingsTypeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof system_readings_type_pb.SystemReadingsType;
  readonly responseType: typeof system_readings_type_pb.SystemReadingsType;
};

type SystemReadingsTypeServiceDelete = {
  readonly methodName: string;
  readonly service: typeof SystemReadingsTypeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof system_readings_type_pb.SystemReadingsType;
  readonly responseType: typeof system_readings_type_pb.SystemReadingsType;
};

export class SystemReadingsTypeService {
  static readonly serviceName: string;
  static readonly Create: SystemReadingsTypeServiceCreate;
  static readonly Get: SystemReadingsTypeServiceGet;
  static readonly BatchGet: SystemReadingsTypeServiceBatchGet;
  static readonly List: SystemReadingsTypeServiceList;
  static readonly Update: SystemReadingsTypeServiceUpdate;
  static readonly Delete: SystemReadingsTypeServiceDelete;
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

export class SystemReadingsTypeServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: system_readings_type_pb.SystemReadingsType,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: system_readings_type_pb.SystemReadingsType|null) => void
  ): UnaryResponse;
  create(
    requestMessage: system_readings_type_pb.SystemReadingsType,
    callback: (error: ServiceError|null, responseMessage: system_readings_type_pb.SystemReadingsType|null) => void
  ): UnaryResponse;
  get(
    requestMessage: system_readings_type_pb.SystemReadingsType,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: system_readings_type_pb.SystemReadingsType|null) => void
  ): UnaryResponse;
  get(
    requestMessage: system_readings_type_pb.SystemReadingsType,
    callback: (error: ServiceError|null, responseMessage: system_readings_type_pb.SystemReadingsType|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: system_readings_type_pb.SystemReadingsType,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: system_readings_type_pb.SystemReadingsTypeList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: system_readings_type_pb.SystemReadingsType,
    callback: (error: ServiceError|null, responseMessage: system_readings_type_pb.SystemReadingsTypeList|null) => void
  ): UnaryResponse;
  list(requestMessage: system_readings_type_pb.SystemReadingsType, metadata?: grpc.Metadata): ResponseStream<system_readings_type_pb.SystemReadingsType>;
  update(
    requestMessage: system_readings_type_pb.SystemReadingsType,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: system_readings_type_pb.SystemReadingsType|null) => void
  ): UnaryResponse;
  update(
    requestMessage: system_readings_type_pb.SystemReadingsType,
    callback: (error: ServiceError|null, responseMessage: system_readings_type_pb.SystemReadingsType|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: system_readings_type_pb.SystemReadingsType,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: system_readings_type_pb.SystemReadingsType|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: system_readings_type_pb.SystemReadingsType,
    callback: (error: ServiceError|null, responseMessage: system_readings_type_pb.SystemReadingsType|null) => void
  ): UnaryResponse;
}

