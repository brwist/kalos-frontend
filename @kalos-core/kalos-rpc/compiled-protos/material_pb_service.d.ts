// package: 
// file: material.proto

import * as material_pb from "./material_pb";
import {grpc} from "@improbable-eng/grpc-web";

type MaterialServiceCreate = {
  readonly methodName: string;
  readonly service: typeof MaterialService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof material_pb.Material;
  readonly responseType: typeof material_pb.Material;
};

type MaterialServiceGet = {
  readonly methodName: string;
  readonly service: typeof MaterialService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof material_pb.Material;
  readonly responseType: typeof material_pb.Material;
};

type MaterialServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof MaterialService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof material_pb.Material;
  readonly responseType: typeof material_pb.MaterialList;
};

type MaterialServiceList = {
  readonly methodName: string;
  readonly service: typeof MaterialService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof material_pb.Material;
  readonly responseType: typeof material_pb.Material;
};

type MaterialServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof MaterialService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof material_pb.Material;
  readonly responseType: typeof material_pb.Material;
};

type MaterialServiceDelete = {
  readonly methodName: string;
  readonly service: typeof MaterialService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof material_pb.Material;
  readonly responseType: typeof material_pb.Material;
};

export class MaterialService {
  static readonly serviceName: string;
  static readonly Create: MaterialServiceCreate;
  static readonly Get: MaterialServiceGet;
  static readonly BatchGet: MaterialServiceBatchGet;
  static readonly List: MaterialServiceList;
  static readonly Update: MaterialServiceUpdate;
  static readonly Delete: MaterialServiceDelete;
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

export class MaterialServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: material_pb.Material,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: material_pb.Material|null) => void
  ): UnaryResponse;
  create(
    requestMessage: material_pb.Material,
    callback: (error: ServiceError|null, responseMessage: material_pb.Material|null) => void
  ): UnaryResponse;
  get(
    requestMessage: material_pb.Material,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: material_pb.Material|null) => void
  ): UnaryResponse;
  get(
    requestMessage: material_pb.Material,
    callback: (error: ServiceError|null, responseMessage: material_pb.Material|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: material_pb.Material,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: material_pb.MaterialList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: material_pb.Material,
    callback: (error: ServiceError|null, responseMessage: material_pb.MaterialList|null) => void
  ): UnaryResponse;
  list(requestMessage: material_pb.Material, metadata?: grpc.Metadata): ResponseStream<material_pb.Material>;
  update(
    requestMessage: material_pb.Material,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: material_pb.Material|null) => void
  ): UnaryResponse;
  update(
    requestMessage: material_pb.Material,
    callback: (error: ServiceError|null, responseMessage: material_pb.Material|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: material_pb.Material,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: material_pb.Material|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: material_pb.Material,
    callback: (error: ServiceError|null, responseMessage: material_pb.Material|null) => void
  ): UnaryResponse;
}

