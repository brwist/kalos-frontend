// package: 
// file: dispatch.proto

import * as dispatch_pb from "./dispatch_pb";
import * as common_pb from "./common_pb";
import * as timeoff_request_pb from "./timeoff_request_pb";
import {grpc} from "@improbable-eng/grpc-web";

type DispatchServiceGetDispatchableTechnicians = {
  readonly methodName: string;
  readonly service: typeof DispatchService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof dispatch_pb.DispatchableTech;
  readonly responseType: typeof dispatch_pb.DispatchableTechList;
};

type DispatchServiceGetDispatchCalls = {
  readonly methodName: string;
  readonly service: typeof DispatchService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof dispatch_pb.DispatchCall;
  readonly responseType: typeof dispatch_pb.DispatchCallList;
};

type DispatchServiceGetTimeoffData = {
  readonly methodName: string;
  readonly service: typeof DispatchService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof timeoff_request_pb.TimeoffRequest;
  readonly responseType: typeof timeoff_request_pb.TimeoffRequestList;
};

type DispatchServiceGetDispatchCallBacks = {
  readonly methodName: string;
  readonly service: typeof DispatchService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof common_pb.DateRange;
  readonly responseType: typeof dispatch_pb.DispatchCallBacksList;
};

type DispatchServiceGetDispatchCallTimes = {
  readonly methodName: string;
  readonly service: typeof DispatchService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof common_pb.DateRange;
  readonly responseType: typeof dispatch_pb.DispatchCallTimeList;
};

type DispatchServiceGetDispatchCallCount = {
  readonly methodName: string;
  readonly service: typeof DispatchService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof common_pb.DateRange;
  readonly responseType: typeof dispatch_pb.DispatchCallCountList;
};

type DispatchServiceGetDispatchFirstCall = {
  readonly methodName: string;
  readonly service: typeof DispatchService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof common_pb.Empty;
  readonly responseType: typeof dispatch_pb.DispatchFirstCallList;
};

export class DispatchService {
  static readonly serviceName: string;
  static readonly GetDispatchableTechnicians: DispatchServiceGetDispatchableTechnicians;
  static readonly GetDispatchCalls: DispatchServiceGetDispatchCalls;
  static readonly GetTimeoffData: DispatchServiceGetTimeoffData;
  static readonly GetDispatchCallBacks: DispatchServiceGetDispatchCallBacks;
  static readonly GetDispatchCallTimes: DispatchServiceGetDispatchCallTimes;
  static readonly GetDispatchCallCount: DispatchServiceGetDispatchCallCount;
  static readonly GetDispatchFirstCall: DispatchServiceGetDispatchFirstCall;
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

export class DispatchServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getDispatchableTechnicians(
    requestMessage: dispatch_pb.DispatchableTech,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: dispatch_pb.DispatchableTechList|null) => void
  ): UnaryResponse;
  getDispatchableTechnicians(
    requestMessage: dispatch_pb.DispatchableTech,
    callback: (error: ServiceError|null, responseMessage: dispatch_pb.DispatchableTechList|null) => void
  ): UnaryResponse;
  getDispatchCalls(
    requestMessage: dispatch_pb.DispatchCall,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: dispatch_pb.DispatchCallList|null) => void
  ): UnaryResponse;
  getDispatchCalls(
    requestMessage: dispatch_pb.DispatchCall,
    callback: (error: ServiceError|null, responseMessage: dispatch_pb.DispatchCallList|null) => void
  ): UnaryResponse;
  getTimeoffData(
    requestMessage: timeoff_request_pb.TimeoffRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: timeoff_request_pb.TimeoffRequestList|null) => void
  ): UnaryResponse;
  getTimeoffData(
    requestMessage: timeoff_request_pb.TimeoffRequest,
    callback: (error: ServiceError|null, responseMessage: timeoff_request_pb.TimeoffRequestList|null) => void
  ): UnaryResponse;
  getDispatchCallBacks(
    requestMessage: common_pb.DateRange,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: dispatch_pb.DispatchCallBacksList|null) => void
  ): UnaryResponse;
  getDispatchCallBacks(
    requestMessage: common_pb.DateRange,
    callback: (error: ServiceError|null, responseMessage: dispatch_pb.DispatchCallBacksList|null) => void
  ): UnaryResponse;
  getDispatchCallTimes(
    requestMessage: common_pb.DateRange,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: dispatch_pb.DispatchCallTimeList|null) => void
  ): UnaryResponse;
  getDispatchCallTimes(
    requestMessage: common_pb.DateRange,
    callback: (error: ServiceError|null, responseMessage: dispatch_pb.DispatchCallTimeList|null) => void
  ): UnaryResponse;
  getDispatchCallCount(
    requestMessage: common_pb.DateRange,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: dispatch_pb.DispatchCallCountList|null) => void
  ): UnaryResponse;
  getDispatchCallCount(
    requestMessage: common_pb.DateRange,
    callback: (error: ServiceError|null, responseMessage: dispatch_pb.DispatchCallCountList|null) => void
  ): UnaryResponse;
  getDispatchFirstCall(
    requestMessage: common_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: dispatch_pb.DispatchFirstCallList|null) => void
  ): UnaryResponse;
  getDispatchFirstCall(
    requestMessage: common_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: dispatch_pb.DispatchFirstCallList|null) => void
  ): UnaryResponse;
}

