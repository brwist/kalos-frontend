// package: 
// file: samsara.proto

import * as samsara_pb from "./samsara_pb";
import * as common_pb from "./common_pb";
import {grpc} from "@improbable-eng/grpc-web";

type SamsaraServiceBatchGetDrivers = {
  readonly methodName: string;
  readonly service: typeof SamsaraService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof common_pb.Empty;
  readonly responseType: typeof samsara_pb.SamsaraDriversResponse;
};

type SamsaraServiceBatchGetLocations = {
  readonly methodName: string;
  readonly service: typeof SamsaraService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof common_pb.Empty;
  readonly responseType: typeof samsara_pb.SamsaraLocationResponse;
};

type SamsaraServiceCreateAddress = {
  readonly methodName: string;
  readonly service: typeof SamsaraService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof samsara_pb.SamsaraAddress;
  readonly responseType: typeof common_pb.String;
};

export class SamsaraService {
  static readonly serviceName: string;
  static readonly BatchGetDrivers: SamsaraServiceBatchGetDrivers;
  static readonly BatchGetLocations: SamsaraServiceBatchGetLocations;
  static readonly CreateAddress: SamsaraServiceCreateAddress;
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

export class SamsaraServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  batchGetDrivers(
    requestMessage: common_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: samsara_pb.SamsaraDriversResponse|null) => void
  ): UnaryResponse;
  batchGetDrivers(
    requestMessage: common_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: samsara_pb.SamsaraDriversResponse|null) => void
  ): UnaryResponse;
  batchGetLocations(
    requestMessage: common_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: samsara_pb.SamsaraLocationResponse|null) => void
  ): UnaryResponse;
  batchGetLocations(
    requestMessage: common_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: samsara_pb.SamsaraLocationResponse|null) => void
  ): UnaryResponse;
  createAddress(
    requestMessage: samsara_pb.SamsaraAddress,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.String|null) => void
  ): UnaryResponse;
  createAddress(
    requestMessage: samsara_pb.SamsaraAddress,
    callback: (error: ServiceError|null, responseMessage: common_pb.String|null) => void
  ): UnaryResponse;
}

