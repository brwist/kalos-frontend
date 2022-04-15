// package: 
// file: property.proto

import * as property_pb from "./property_pb";
import {grpc} from "@improbable-eng/grpc-web";

type PropertyServiceCreate = {
  readonly methodName: string;
  readonly service: typeof PropertyService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof property_pb.Property;
  readonly responseType: typeof property_pb.Property;
};

type PropertyServiceGet = {
  readonly methodName: string;
  readonly service: typeof PropertyService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof property_pb.Property;
  readonly responseType: typeof property_pb.Property;
};

type PropertyServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof PropertyService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof property_pb.Property;
  readonly responseType: typeof property_pb.PropertyList;
};

type PropertyServiceList = {
  readonly methodName: string;
  readonly service: typeof PropertyService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof property_pb.Property;
  readonly responseType: typeof property_pb.Property;
};

type PropertyServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof PropertyService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof property_pb.Property;
  readonly responseType: typeof property_pb.Property;
};

type PropertyServiceDelete = {
  readonly methodName: string;
  readonly service: typeof PropertyService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof property_pb.Property;
  readonly responseType: typeof property_pb.Property;
};

type PropertyServiceGetPropertyCoordinates = {
  readonly methodName: string;
  readonly service: typeof PropertyService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof property_pb.Property;
  readonly responseType: typeof property_pb.PropertyCoordinates;
};

export class PropertyService {
  static readonly serviceName: string;
  static readonly Create: PropertyServiceCreate;
  static readonly Get: PropertyServiceGet;
  static readonly BatchGet: PropertyServiceBatchGet;
  static readonly List: PropertyServiceList;
  static readonly Update: PropertyServiceUpdate;
  static readonly Delete: PropertyServiceDelete;
  static readonly GetPropertyCoordinates: PropertyServiceGetPropertyCoordinates;
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

export class PropertyServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: property_pb.Property,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: property_pb.Property|null) => void
  ): UnaryResponse;
  create(
    requestMessage: property_pb.Property,
    callback: (error: ServiceError|null, responseMessage: property_pb.Property|null) => void
  ): UnaryResponse;
  get(
    requestMessage: property_pb.Property,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: property_pb.Property|null) => void
  ): UnaryResponse;
  get(
    requestMessage: property_pb.Property,
    callback: (error: ServiceError|null, responseMessage: property_pb.Property|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: property_pb.Property,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: property_pb.PropertyList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: property_pb.Property,
    callback: (error: ServiceError|null, responseMessage: property_pb.PropertyList|null) => void
  ): UnaryResponse;
  list(requestMessage: property_pb.Property, metadata?: grpc.Metadata): ResponseStream<property_pb.Property>;
  update(
    requestMessage: property_pb.Property,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: property_pb.Property|null) => void
  ): UnaryResponse;
  update(
    requestMessage: property_pb.Property,
    callback: (error: ServiceError|null, responseMessage: property_pb.Property|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: property_pb.Property,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: property_pb.Property|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: property_pb.Property,
    callback: (error: ServiceError|null, responseMessage: property_pb.Property|null) => void
  ): UnaryResponse;
  getPropertyCoordinates(
    requestMessage: property_pb.Property,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: property_pb.PropertyCoordinates|null) => void
  ): UnaryResponse;
  getPropertyCoordinates(
    requestMessage: property_pb.Property,
    callback: (error: ServiceError|null, responseMessage: property_pb.PropertyCoordinates|null) => void
  ): UnaryResponse;
}

