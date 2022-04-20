// package: 
// file: service_item_material.proto

import * as service_item_material_pb from "./service_item_material_pb";
import {grpc} from "@improbable-eng/grpc-web";

type ServiceItemMaterialServiceCreate = {
  readonly methodName: string;
  readonly service: typeof ServiceItemMaterialService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_item_material_pb.ServiceItemMaterial;
  readonly responseType: typeof service_item_material_pb.ServiceItemMaterial;
};

type ServiceItemMaterialServiceGet = {
  readonly methodName: string;
  readonly service: typeof ServiceItemMaterialService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_item_material_pb.ServiceItemMaterial;
  readonly responseType: typeof service_item_material_pb.ServiceItemMaterial;
};

type ServiceItemMaterialServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof ServiceItemMaterialService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_item_material_pb.ServiceItemMaterial;
  readonly responseType: typeof service_item_material_pb.ServiceItemMaterialList;
};

type ServiceItemMaterialServiceList = {
  readonly methodName: string;
  readonly service: typeof ServiceItemMaterialService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof service_item_material_pb.ServiceItemMaterial;
  readonly responseType: typeof service_item_material_pb.ServiceItemMaterial;
};

type ServiceItemMaterialServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof ServiceItemMaterialService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_item_material_pb.ServiceItemMaterial;
  readonly responseType: typeof service_item_material_pb.ServiceItemMaterial;
};

type ServiceItemMaterialServiceDelete = {
  readonly methodName: string;
  readonly service: typeof ServiceItemMaterialService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_item_material_pb.ServiceItemMaterial;
  readonly responseType: typeof service_item_material_pb.ServiceItemMaterial;
};

export class ServiceItemMaterialService {
  static readonly serviceName: string;
  static readonly Create: ServiceItemMaterialServiceCreate;
  static readonly Get: ServiceItemMaterialServiceGet;
  static readonly BatchGet: ServiceItemMaterialServiceBatchGet;
  static readonly List: ServiceItemMaterialServiceList;
  static readonly Update: ServiceItemMaterialServiceUpdate;
  static readonly Delete: ServiceItemMaterialServiceDelete;
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

export class ServiceItemMaterialServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: service_item_material_pb.ServiceItemMaterial,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_item_material_pb.ServiceItemMaterial|null) => void
  ): UnaryResponse;
  create(
    requestMessage: service_item_material_pb.ServiceItemMaterial,
    callback: (error: ServiceError|null, responseMessage: service_item_material_pb.ServiceItemMaterial|null) => void
  ): UnaryResponse;
  get(
    requestMessage: service_item_material_pb.ServiceItemMaterial,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_item_material_pb.ServiceItemMaterial|null) => void
  ): UnaryResponse;
  get(
    requestMessage: service_item_material_pb.ServiceItemMaterial,
    callback: (error: ServiceError|null, responseMessage: service_item_material_pb.ServiceItemMaterial|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: service_item_material_pb.ServiceItemMaterial,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_item_material_pb.ServiceItemMaterialList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: service_item_material_pb.ServiceItemMaterial,
    callback: (error: ServiceError|null, responseMessage: service_item_material_pb.ServiceItemMaterialList|null) => void
  ): UnaryResponse;
  list(requestMessage: service_item_material_pb.ServiceItemMaterial, metadata?: grpc.Metadata): ResponseStream<service_item_material_pb.ServiceItemMaterial>;
  update(
    requestMessage: service_item_material_pb.ServiceItemMaterial,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_item_material_pb.ServiceItemMaterial|null) => void
  ): UnaryResponse;
  update(
    requestMessage: service_item_material_pb.ServiceItemMaterial,
    callback: (error: ServiceError|null, responseMessage: service_item_material_pb.ServiceItemMaterial|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: service_item_material_pb.ServiceItemMaterial,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_item_material_pb.ServiceItemMaterial|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: service_item_material_pb.ServiceItemMaterial,
    callback: (error: ServiceError|null, responseMessage: service_item_material_pb.ServiceItemMaterial|null) => void
  ): UnaryResponse;
}

