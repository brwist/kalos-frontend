// package: 
// file: service_item_unit.proto

import * as service_item_unit_pb from "./service_item_unit_pb";
import {grpc} from "@improbable-eng/grpc-web";

type ServiceItemUnitServiceCreate = {
  readonly methodName: string;
  readonly service: typeof ServiceItemUnitService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_item_unit_pb.ServiceItemUnit;
  readonly responseType: typeof service_item_unit_pb.ServiceItemUnit;
};

type ServiceItemUnitServiceGet = {
  readonly methodName: string;
  readonly service: typeof ServiceItemUnitService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_item_unit_pb.ServiceItemUnit;
  readonly responseType: typeof service_item_unit_pb.ServiceItemUnit;
};

type ServiceItemUnitServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof ServiceItemUnitService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_item_unit_pb.ServiceItemUnit;
  readonly responseType: typeof service_item_unit_pb.ServiceItemUnitList;
};

type ServiceItemUnitServiceList = {
  readonly methodName: string;
  readonly service: typeof ServiceItemUnitService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof service_item_unit_pb.ServiceItemUnit;
  readonly responseType: typeof service_item_unit_pb.ServiceItemUnit;
};

type ServiceItemUnitServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof ServiceItemUnitService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_item_unit_pb.ServiceItemUnit;
  readonly responseType: typeof service_item_unit_pb.ServiceItemUnit;
};

type ServiceItemUnitServiceDelete = {
  readonly methodName: string;
  readonly service: typeof ServiceItemUnitService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_item_unit_pb.ServiceItemUnit;
  readonly responseType: typeof service_item_unit_pb.ServiceItemUnit;
};

export class ServiceItemUnitService {
  static readonly serviceName: string;
  static readonly Create: ServiceItemUnitServiceCreate;
  static readonly Get: ServiceItemUnitServiceGet;
  static readonly BatchGet: ServiceItemUnitServiceBatchGet;
  static readonly List: ServiceItemUnitServiceList;
  static readonly Update: ServiceItemUnitServiceUpdate;
  static readonly Delete: ServiceItemUnitServiceDelete;
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

export class ServiceItemUnitServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: service_item_unit_pb.ServiceItemUnit,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_item_unit_pb.ServiceItemUnit|null) => void
  ): UnaryResponse;
  create(
    requestMessage: service_item_unit_pb.ServiceItemUnit,
    callback: (error: ServiceError|null, responseMessage: service_item_unit_pb.ServiceItemUnit|null) => void
  ): UnaryResponse;
  get(
    requestMessage: service_item_unit_pb.ServiceItemUnit,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_item_unit_pb.ServiceItemUnit|null) => void
  ): UnaryResponse;
  get(
    requestMessage: service_item_unit_pb.ServiceItemUnit,
    callback: (error: ServiceError|null, responseMessage: service_item_unit_pb.ServiceItemUnit|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: service_item_unit_pb.ServiceItemUnit,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_item_unit_pb.ServiceItemUnitList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: service_item_unit_pb.ServiceItemUnit,
    callback: (error: ServiceError|null, responseMessage: service_item_unit_pb.ServiceItemUnitList|null) => void
  ): UnaryResponse;
  list(requestMessage: service_item_unit_pb.ServiceItemUnit, metadata?: grpc.Metadata): ResponseStream<service_item_unit_pb.ServiceItemUnit>;
  update(
    requestMessage: service_item_unit_pb.ServiceItemUnit,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_item_unit_pb.ServiceItemUnit|null) => void
  ): UnaryResponse;
  update(
    requestMessage: service_item_unit_pb.ServiceItemUnit,
    callback: (error: ServiceError|null, responseMessage: service_item_unit_pb.ServiceItemUnit|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: service_item_unit_pb.ServiceItemUnit,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_item_unit_pb.ServiceItemUnit|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: service_item_unit_pb.ServiceItemUnit,
    callback: (error: ServiceError|null, responseMessage: service_item_unit_pb.ServiceItemUnit|null) => void
  ): UnaryResponse;
}

