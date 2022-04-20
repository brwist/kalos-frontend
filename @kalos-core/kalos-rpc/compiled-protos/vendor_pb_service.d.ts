// package: 
// file: vendor.proto

import * as vendor_pb from "./vendor_pb";
import {grpc} from "@improbable-eng/grpc-web";

type VendorServiceCreate = {
  readonly methodName: string;
  readonly service: typeof VendorService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof vendor_pb.Vendor;
  readonly responseType: typeof vendor_pb.Vendor;
};

type VendorServiceGet = {
  readonly methodName: string;
  readonly service: typeof VendorService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof vendor_pb.Vendor;
  readonly responseType: typeof vendor_pb.Vendor;
};

type VendorServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof VendorService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof vendor_pb.Vendor;
  readonly responseType: typeof vendor_pb.VendorList;
};

type VendorServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof VendorService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof vendor_pb.Vendor;
  readonly responseType: typeof vendor_pb.Vendor;
};

type VendorServiceDelete = {
  readonly methodName: string;
  readonly service: typeof VendorService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof vendor_pb.Vendor;
  readonly responseType: typeof vendor_pb.Vendor;
};

export class VendorService {
  static readonly serviceName: string;
  static readonly Create: VendorServiceCreate;
  static readonly Get: VendorServiceGet;
  static readonly BatchGet: VendorServiceBatchGet;
  static readonly Update: VendorServiceUpdate;
  static readonly Delete: VendorServiceDelete;
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

export class VendorServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: vendor_pb.Vendor,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: vendor_pb.Vendor|null) => void
  ): UnaryResponse;
  create(
    requestMessage: vendor_pb.Vendor,
    callback: (error: ServiceError|null, responseMessage: vendor_pb.Vendor|null) => void
  ): UnaryResponse;
  get(
    requestMessage: vendor_pb.Vendor,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: vendor_pb.Vendor|null) => void
  ): UnaryResponse;
  get(
    requestMessage: vendor_pb.Vendor,
    callback: (error: ServiceError|null, responseMessage: vendor_pb.Vendor|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: vendor_pb.Vendor,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: vendor_pb.VendorList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: vendor_pb.Vendor,
    callback: (error: ServiceError|null, responseMessage: vendor_pb.VendorList|null) => void
  ): UnaryResponse;
  update(
    requestMessage: vendor_pb.Vendor,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: vendor_pb.Vendor|null) => void
  ): UnaryResponse;
  update(
    requestMessage: vendor_pb.Vendor,
    callback: (error: ServiceError|null, responseMessage: vendor_pb.Vendor|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: vendor_pb.Vendor,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: vendor_pb.Vendor|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: vendor_pb.Vendor,
    callback: (error: ServiceError|null, responseMessage: vendor_pb.Vendor|null) => void
  ): UnaryResponse;
}

