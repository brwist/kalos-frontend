// package: 
// file: stock_vendor.proto

import * as stock_vendor_pb from "./stock_vendor_pb";
import {grpc} from "@improbable-eng/grpc-web";

type StockVendorServiceCreate = {
  readonly methodName: string;
  readonly service: typeof StockVendorService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof stock_vendor_pb.StockVendor;
  readonly responseType: typeof stock_vendor_pb.StockVendor;
};

type StockVendorServiceGet = {
  readonly methodName: string;
  readonly service: typeof StockVendorService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof stock_vendor_pb.StockVendor;
  readonly responseType: typeof stock_vendor_pb.StockVendor;
};

type StockVendorServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof StockVendorService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof stock_vendor_pb.StockVendor;
  readonly responseType: typeof stock_vendor_pb.StockVendorList;
};

type StockVendorServiceList = {
  readonly methodName: string;
  readonly service: typeof StockVendorService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof stock_vendor_pb.StockVendor;
  readonly responseType: typeof stock_vendor_pb.StockVendor;
};

type StockVendorServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof StockVendorService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof stock_vendor_pb.StockVendor;
  readonly responseType: typeof stock_vendor_pb.StockVendor;
};

type StockVendorServiceDelete = {
  readonly methodName: string;
  readonly service: typeof StockVendorService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof stock_vendor_pb.StockVendor;
  readonly responseType: typeof stock_vendor_pb.StockVendor;
};

export class StockVendorService {
  static readonly serviceName: string;
  static readonly Create: StockVendorServiceCreate;
  static readonly Get: StockVendorServiceGet;
  static readonly BatchGet: StockVendorServiceBatchGet;
  static readonly List: StockVendorServiceList;
  static readonly Update: StockVendorServiceUpdate;
  static readonly Delete: StockVendorServiceDelete;
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

export class StockVendorServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: stock_vendor_pb.StockVendor,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: stock_vendor_pb.StockVendor|null) => void
  ): UnaryResponse;
  create(
    requestMessage: stock_vendor_pb.StockVendor,
    callback: (error: ServiceError|null, responseMessage: stock_vendor_pb.StockVendor|null) => void
  ): UnaryResponse;
  get(
    requestMessage: stock_vendor_pb.StockVendor,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: stock_vendor_pb.StockVendor|null) => void
  ): UnaryResponse;
  get(
    requestMessage: stock_vendor_pb.StockVendor,
    callback: (error: ServiceError|null, responseMessage: stock_vendor_pb.StockVendor|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: stock_vendor_pb.StockVendor,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: stock_vendor_pb.StockVendorList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: stock_vendor_pb.StockVendor,
    callback: (error: ServiceError|null, responseMessage: stock_vendor_pb.StockVendorList|null) => void
  ): UnaryResponse;
  list(requestMessage: stock_vendor_pb.StockVendor, metadata?: grpc.Metadata): ResponseStream<stock_vendor_pb.StockVendor>;
  update(
    requestMessage: stock_vendor_pb.StockVendor,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: stock_vendor_pb.StockVendor|null) => void
  ): UnaryResponse;
  update(
    requestMessage: stock_vendor_pb.StockVendor,
    callback: (error: ServiceError|null, responseMessage: stock_vendor_pb.StockVendor|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: stock_vendor_pb.StockVendor,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: stock_vendor_pb.StockVendor|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: stock_vendor_pb.StockVendor,
    callback: (error: ServiceError|null, responseMessage: stock_vendor_pb.StockVendor|null) => void
  ): UnaryResponse;
}

