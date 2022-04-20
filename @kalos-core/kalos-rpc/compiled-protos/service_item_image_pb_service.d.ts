// package: 
// file: service_item_image.proto

import * as service_item_image_pb from "./service_item_image_pb";
import {grpc} from "@improbable-eng/grpc-web";

type ServiceItemImageServiceCreate = {
  readonly methodName: string;
  readonly service: typeof ServiceItemImageService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_item_image_pb.ServiceItemImage;
  readonly responseType: typeof service_item_image_pb.ServiceItemImage;
};

type ServiceItemImageServiceGet = {
  readonly methodName: string;
  readonly service: typeof ServiceItemImageService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_item_image_pb.ServiceItemImage;
  readonly responseType: typeof service_item_image_pb.ServiceItemImage;
};

type ServiceItemImageServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof ServiceItemImageService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_item_image_pb.ServiceItemImage;
  readonly responseType: typeof service_item_image_pb.ServiceItemImageList;
};

type ServiceItemImageServiceList = {
  readonly methodName: string;
  readonly service: typeof ServiceItemImageService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof service_item_image_pb.ServiceItemImage;
  readonly responseType: typeof service_item_image_pb.ServiceItemImage;
};

type ServiceItemImageServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof ServiceItemImageService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_item_image_pb.ServiceItemImage;
  readonly responseType: typeof service_item_image_pb.ServiceItemImage;
};

type ServiceItemImageServiceDelete = {
  readonly methodName: string;
  readonly service: typeof ServiceItemImageService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_item_image_pb.ServiceItemImage;
  readonly responseType: typeof service_item_image_pb.ServiceItemImage;
};

export class ServiceItemImageService {
  static readonly serviceName: string;
  static readonly Create: ServiceItemImageServiceCreate;
  static readonly Get: ServiceItemImageServiceGet;
  static readonly BatchGet: ServiceItemImageServiceBatchGet;
  static readonly List: ServiceItemImageServiceList;
  static readonly Update: ServiceItemImageServiceUpdate;
  static readonly Delete: ServiceItemImageServiceDelete;
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

export class ServiceItemImageServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: service_item_image_pb.ServiceItemImage,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_item_image_pb.ServiceItemImage|null) => void
  ): UnaryResponse;
  create(
    requestMessage: service_item_image_pb.ServiceItemImage,
    callback: (error: ServiceError|null, responseMessage: service_item_image_pb.ServiceItemImage|null) => void
  ): UnaryResponse;
  get(
    requestMessage: service_item_image_pb.ServiceItemImage,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_item_image_pb.ServiceItemImage|null) => void
  ): UnaryResponse;
  get(
    requestMessage: service_item_image_pb.ServiceItemImage,
    callback: (error: ServiceError|null, responseMessage: service_item_image_pb.ServiceItemImage|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: service_item_image_pb.ServiceItemImage,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_item_image_pb.ServiceItemImageList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: service_item_image_pb.ServiceItemImage,
    callback: (error: ServiceError|null, responseMessage: service_item_image_pb.ServiceItemImageList|null) => void
  ): UnaryResponse;
  list(requestMessage: service_item_image_pb.ServiceItemImage, metadata?: grpc.Metadata): ResponseStream<service_item_image_pb.ServiceItemImage>;
  update(
    requestMessage: service_item_image_pb.ServiceItemImage,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_item_image_pb.ServiceItemImage|null) => void
  ): UnaryResponse;
  update(
    requestMessage: service_item_image_pb.ServiceItemImage,
    callback: (error: ServiceError|null, responseMessage: service_item_image_pb.ServiceItemImage|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: service_item_image_pb.ServiceItemImage,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: service_item_image_pb.ServiceItemImage|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: service_item_image_pb.ServiceItemImage,
    callback: (error: ServiceError|null, responseMessage: service_item_image_pb.ServiceItemImage|null) => void
  ): UnaryResponse;
}

