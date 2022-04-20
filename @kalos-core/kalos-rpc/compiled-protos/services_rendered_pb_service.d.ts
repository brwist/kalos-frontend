// package: 
// file: services_rendered.proto

import * as services_rendered_pb from "./services_rendered_pb";
import {grpc} from "@improbable-eng/grpc-web";

type ServicesRenderedServiceCreate = {
  readonly methodName: string;
  readonly service: typeof ServicesRenderedService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof services_rendered_pb.ServicesRendered;
  readonly responseType: typeof services_rendered_pb.ServicesRendered;
};

type ServicesRenderedServiceGet = {
  readonly methodName: string;
  readonly service: typeof ServicesRenderedService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof services_rendered_pb.ServicesRendered;
  readonly responseType: typeof services_rendered_pb.ServicesRendered;
};

type ServicesRenderedServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof ServicesRenderedService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof services_rendered_pb.ServicesRendered;
  readonly responseType: typeof services_rendered_pb.ServicesRenderedList;
};

type ServicesRenderedServiceList = {
  readonly methodName: string;
  readonly service: typeof ServicesRenderedService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof services_rendered_pb.ServicesRendered;
  readonly responseType: typeof services_rendered_pb.ServicesRendered;
};

type ServicesRenderedServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof ServicesRenderedService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof services_rendered_pb.ServicesRendered;
  readonly responseType: typeof services_rendered_pb.ServicesRendered;
};

type ServicesRenderedServiceDelete = {
  readonly methodName: string;
  readonly service: typeof ServicesRenderedService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof services_rendered_pb.ServicesRendered;
  readonly responseType: typeof services_rendered_pb.ServicesRendered;
};

export class ServicesRenderedService {
  static readonly serviceName: string;
  static readonly Create: ServicesRenderedServiceCreate;
  static readonly Get: ServicesRenderedServiceGet;
  static readonly BatchGet: ServicesRenderedServiceBatchGet;
  static readonly List: ServicesRenderedServiceList;
  static readonly Update: ServicesRenderedServiceUpdate;
  static readonly Delete: ServicesRenderedServiceDelete;
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

export class ServicesRenderedServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: services_rendered_pb.ServicesRendered,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: services_rendered_pb.ServicesRendered|null) => void
  ): UnaryResponse;
  create(
    requestMessage: services_rendered_pb.ServicesRendered,
    callback: (error: ServiceError|null, responseMessage: services_rendered_pb.ServicesRendered|null) => void
  ): UnaryResponse;
  get(
    requestMessage: services_rendered_pb.ServicesRendered,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: services_rendered_pb.ServicesRendered|null) => void
  ): UnaryResponse;
  get(
    requestMessage: services_rendered_pb.ServicesRendered,
    callback: (error: ServiceError|null, responseMessage: services_rendered_pb.ServicesRendered|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: services_rendered_pb.ServicesRendered,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: services_rendered_pb.ServicesRenderedList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: services_rendered_pb.ServicesRendered,
    callback: (error: ServiceError|null, responseMessage: services_rendered_pb.ServicesRenderedList|null) => void
  ): UnaryResponse;
  list(requestMessage: services_rendered_pb.ServicesRendered, metadata?: grpc.Metadata): ResponseStream<services_rendered_pb.ServicesRendered>;
  update(
    requestMessage: services_rendered_pb.ServicesRendered,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: services_rendered_pb.ServicesRendered|null) => void
  ): UnaryResponse;
  update(
    requestMessage: services_rendered_pb.ServicesRendered,
    callback: (error: ServiceError|null, responseMessage: services_rendered_pb.ServicesRendered|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: services_rendered_pb.ServicesRendered,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: services_rendered_pb.ServicesRendered|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: services_rendered_pb.ServicesRendered,
    callback: (error: ServiceError|null, responseMessage: services_rendered_pb.ServicesRendered|null) => void
  ): UnaryResponse;
}

