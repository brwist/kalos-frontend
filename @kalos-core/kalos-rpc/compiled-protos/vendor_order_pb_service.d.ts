// package: 
// file: vendor_order.proto

import * as vendor_order_pb from "./vendor_order_pb";
import {grpc} from "@improbable-eng/grpc-web";

type VendorOrderServiceCreate = {
  readonly methodName: string;
  readonly service: typeof VendorOrderService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof vendor_order_pb.VendorOrder;
  readonly responseType: typeof vendor_order_pb.VendorOrder;
};

type VendorOrderServiceGet = {
  readonly methodName: string;
  readonly service: typeof VendorOrderService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof vendor_order_pb.VendorOrder;
  readonly responseType: typeof vendor_order_pb.VendorOrder;
};

type VendorOrderServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof VendorOrderService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof vendor_order_pb.VendorOrder;
  readonly responseType: typeof vendor_order_pb.VendorOrderList;
};

type VendorOrderServiceList = {
  readonly methodName: string;
  readonly service: typeof VendorOrderService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof vendor_order_pb.VendorOrder;
  readonly responseType: typeof vendor_order_pb.VendorOrder;
};

type VendorOrderServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof VendorOrderService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof vendor_order_pb.VendorOrder;
  readonly responseType: typeof vendor_order_pb.VendorOrder;
};

type VendorOrderServiceDelete = {
  readonly methodName: string;
  readonly service: typeof VendorOrderService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof vendor_order_pb.VendorOrder;
  readonly responseType: typeof vendor_order_pb.VendorOrder;
};

export class VendorOrderService {
  static readonly serviceName: string;
  static readonly Create: VendorOrderServiceCreate;
  static readonly Get: VendorOrderServiceGet;
  static readonly BatchGet: VendorOrderServiceBatchGet;
  static readonly List: VendorOrderServiceList;
  static readonly Update: VendorOrderServiceUpdate;
  static readonly Delete: VendorOrderServiceDelete;
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

export class VendorOrderServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: vendor_order_pb.VendorOrder,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: vendor_order_pb.VendorOrder|null) => void
  ): UnaryResponse;
  create(
    requestMessage: vendor_order_pb.VendorOrder,
    callback: (error: ServiceError|null, responseMessage: vendor_order_pb.VendorOrder|null) => void
  ): UnaryResponse;
  get(
    requestMessage: vendor_order_pb.VendorOrder,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: vendor_order_pb.VendorOrder|null) => void
  ): UnaryResponse;
  get(
    requestMessage: vendor_order_pb.VendorOrder,
    callback: (error: ServiceError|null, responseMessage: vendor_order_pb.VendorOrder|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: vendor_order_pb.VendorOrder,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: vendor_order_pb.VendorOrderList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: vendor_order_pb.VendorOrder,
    callback: (error: ServiceError|null, responseMessage: vendor_order_pb.VendorOrderList|null) => void
  ): UnaryResponse;
  list(requestMessage: vendor_order_pb.VendorOrder, metadata?: grpc.Metadata): ResponseStream<vendor_order_pb.VendorOrder>;
  update(
    requestMessage: vendor_order_pb.VendorOrder,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: vendor_order_pb.VendorOrder|null) => void
  ): UnaryResponse;
  update(
    requestMessage: vendor_order_pb.VendorOrder,
    callback: (error: ServiceError|null, responseMessage: vendor_order_pb.VendorOrder|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: vendor_order_pb.VendorOrder,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: vendor_order_pb.VendorOrder|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: vendor_order_pb.VendorOrder,
    callback: (error: ServiceError|null, responseMessage: vendor_order_pb.VendorOrder|null) => void
  ): UnaryResponse;
}

