// package: 
// file: service_item.proto

import * as service_item_pb from "./service_item_pb";
import {grpc} from "@improbable-eng/grpc-web";

type ServiceItemServiceCreate = {
  readonly methodName: string;
  readonly service: typeof ServiceItemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_item_pb.ServiceItem;
  readonly responseType: typeof service_item_pb.ServiceItem;
};

type ServiceItemServiceGet = {
  readonly methodName: string;
  readonly service: typeof ServiceItemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_item_pb.ServiceItem;
  readonly responseType: typeof service_item_pb.ServiceItem;
};

type ServiceItemServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof ServiceItemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_item_pb.ServiceItem;
  readonly responseType: typeof service_item_pb.ServiceItemList;
};

type ServiceItemServiceList = {
  readonly methodName: string;
  readonly service: typeof ServiceItemService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof service_item_pb.ServiceItem;
  readonly responseType: typeof service_item_pb.ServiceItem;
};

type ServiceItemServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof ServiceItemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_item_pb.ServiceItem;
  readonly responseType: typeof service_item_pb.ServiceItem;
};

type ServiceItemServiceDelete = {
  readonly methodName: string;
  readonly service: typeof ServiceItemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_item_pb.ServiceItem;
  readonly responseType: typeof service_item_pb.ServiceItem;
};

export class ServiceItemService {
  static readonly serviceName: string;
  static readonly Create: ServiceItemServiceCreate;
  static readonly Get: ServiceItemServiceGet;
  static readonly BatchGet: ServiceItemServiceBatchGet;
  static readonly List: ServiceItemServiceList;
  static readonly Update: ServiceItemServiceUpdate;
  static readonly Delete: ServiceItemServiceDelete;
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

export class ServiceItemServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: service_item_pb.ServiceItem,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_item_pb.ServiceItem|null) => void
  ): UnaryResponse;
  create(
    requestMessage: service_item_pb.ServiceItem,
    callback: (error: ServiceError|null, responseMessage: service_item_pb.ServiceItem|null) => void
  ): UnaryResponse;
  get(
    requestMessage: service_item_pb.ServiceItem,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_item_pb.ServiceItem|null) => void
  ): UnaryResponse;
  get(
    requestMessage: service_item_pb.ServiceItem,
    callback: (error: ServiceError|null, responseMessage: service_item_pb.ServiceItem|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: service_item_pb.ServiceItem,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_item_pb.ServiceItemList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: service_item_pb.ServiceItem,
    callback: (error: ServiceError|null, responseMessage: service_item_pb.ServiceItemList|null) => void
  ): UnaryResponse;
  list(requestMessage: service_item_pb.ServiceItem, metadata?: grpc.Metadata): ResponseStream<service_item_pb.ServiceItem>;
  update(
    requestMessage: service_item_pb.ServiceItem,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_item_pb.ServiceItem|null) => void
  ): UnaryResponse;
  update(
    requestMessage: service_item_pb.ServiceItem,
    callback: (error: ServiceError|null, responseMessage: service_item_pb.ServiceItem|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: service_item_pb.ServiceItem,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_item_pb.ServiceItem|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: service_item_pb.ServiceItem,
    callback: (error: ServiceError|null, responseMessage: service_item_pb.ServiceItem|null) => void
  ): UnaryResponse;
}

