// package: 
// file: timeoff_request.proto

import * as timeoff_request_pb from "./timeoff_request_pb";
import {grpc} from "@improbable-eng/grpc-web";

type TimeoffRequestServiceCreate = {
  readonly methodName: string;
  readonly service: typeof TimeoffRequestService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timeoff_request_pb.TimeoffRequest;
  readonly responseType: typeof timeoff_request_pb.TimeoffRequest;
};

type TimeoffRequestServiceGet = {
  readonly methodName: string;
  readonly service: typeof TimeoffRequestService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timeoff_request_pb.TimeoffRequest;
  readonly responseType: typeof timeoff_request_pb.TimeoffRequest;
};

type TimeoffRequestServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof TimeoffRequestService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timeoff_request_pb.TimeoffRequest;
  readonly responseType: typeof timeoff_request_pb.TimeoffRequestList;
};

type TimeoffRequestServiceList = {
  readonly methodName: string;
  readonly service: typeof TimeoffRequestService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof timeoff_request_pb.TimeoffRequest;
  readonly responseType: typeof timeoff_request_pb.TimeoffRequest;
};

type TimeoffRequestServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof TimeoffRequestService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timeoff_request_pb.TimeoffRequest;
  readonly responseType: typeof timeoff_request_pb.TimeoffRequest;
};

type TimeoffRequestServiceDelete = {
  readonly methodName: string;
  readonly service: typeof TimeoffRequestService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timeoff_request_pb.TimeoffRequest;
  readonly responseType: typeof timeoff_request_pb.TimeoffRequest;
};

type TimeoffRequestServicePTOInquiry = {
  readonly methodName: string;
  readonly service: typeof TimeoffRequestService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timeoff_request_pb.PTO;
  readonly responseType: typeof timeoff_request_pb.PTO;
};

type TimeoffRequestServiceGetTimeoffRequestTypes = {
  readonly methodName: string;
  readonly service: typeof TimeoffRequestService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timeoff_request_pb.TimeoffRequestType;
  readonly responseType: typeof timeoff_request_pb.TimeoffRequestTypeList;
};

export class TimeoffRequestService {
  static readonly serviceName: string;
  static readonly Create: TimeoffRequestServiceCreate;
  static readonly Get: TimeoffRequestServiceGet;
  static readonly BatchGet: TimeoffRequestServiceBatchGet;
  static readonly List: TimeoffRequestServiceList;
  static readonly Update: TimeoffRequestServiceUpdate;
  static readonly Delete: TimeoffRequestServiceDelete;
  static readonly PTOInquiry: TimeoffRequestServicePTOInquiry;
  static readonly GetTimeoffRequestTypes: TimeoffRequestServiceGetTimeoffRequestTypes;
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

export class TimeoffRequestServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: timeoff_request_pb.TimeoffRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timeoff_request_pb.TimeoffRequest|null) => void
  ): UnaryResponse;
  create(
    requestMessage: timeoff_request_pb.TimeoffRequest,
    callback: (error: ServiceError|null, responseMessage: timeoff_request_pb.TimeoffRequest|null) => void
  ): UnaryResponse;
  get(
    requestMessage: timeoff_request_pb.TimeoffRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timeoff_request_pb.TimeoffRequest|null) => void
  ): UnaryResponse;
  get(
    requestMessage: timeoff_request_pb.TimeoffRequest,
    callback: (error: ServiceError|null, responseMessage: timeoff_request_pb.TimeoffRequest|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: timeoff_request_pb.TimeoffRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timeoff_request_pb.TimeoffRequestList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: timeoff_request_pb.TimeoffRequest,
    callback: (error: ServiceError|null, responseMessage: timeoff_request_pb.TimeoffRequestList|null) => void
  ): UnaryResponse;
  list(requestMessage: timeoff_request_pb.TimeoffRequest, metadata?: grpc.Metadata): ResponseStream<timeoff_request_pb.TimeoffRequest>;
  update(
    requestMessage: timeoff_request_pb.TimeoffRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timeoff_request_pb.TimeoffRequest|null) => void
  ): UnaryResponse;
  update(
    requestMessage: timeoff_request_pb.TimeoffRequest,
    callback: (error: ServiceError|null, responseMessage: timeoff_request_pb.TimeoffRequest|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: timeoff_request_pb.TimeoffRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timeoff_request_pb.TimeoffRequest|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: timeoff_request_pb.TimeoffRequest,
    callback: (error: ServiceError|null, responseMessage: timeoff_request_pb.TimeoffRequest|null) => void
  ): UnaryResponse;
  pTOInquiry(
    requestMessage: timeoff_request_pb.PTO,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timeoff_request_pb.PTO|null) => void
  ): UnaryResponse;
  pTOInquiry(
    requestMessage: timeoff_request_pb.PTO,
    callback: (error: ServiceError|null, responseMessage: timeoff_request_pb.PTO|null) => void
  ): UnaryResponse;
  getTimeoffRequestTypes(
    requestMessage: timeoff_request_pb.TimeoffRequestType,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timeoff_request_pb.TimeoffRequestTypeList|null) => void
  ): UnaryResponse;
  getTimeoffRequestTypes(
    requestMessage: timeoff_request_pb.TimeoffRequestType,
    callback: (error: ServiceError|null, responseMessage: timeoff_request_pb.TimeoffRequestTypeList|null) => void
  ): UnaryResponse;
}

