// package: 
// file: phone_call_log.proto

import * as phone_call_log_pb from "./phone_call_log_pb";
import {grpc} from "@improbable-eng/grpc-web";

type PhoneCallLogServiceCreate = {
  readonly methodName: string;
  readonly service: typeof PhoneCallLogService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof phone_call_log_pb.PhoneCallLog;
  readonly responseType: typeof phone_call_log_pb.PhoneCallLog;
};

type PhoneCallLogServiceGet = {
  readonly methodName: string;
  readonly service: typeof PhoneCallLogService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof phone_call_log_pb.PhoneCallLog;
  readonly responseType: typeof phone_call_log_pb.PhoneCallLog;
};

type PhoneCallLogServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof PhoneCallLogService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof phone_call_log_pb.PhoneCallLog;
  readonly responseType: typeof phone_call_log_pb.PhoneCallLogList;
};

type PhoneCallLogServiceList = {
  readonly methodName: string;
  readonly service: typeof PhoneCallLogService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof phone_call_log_pb.PhoneCallLog;
  readonly responseType: typeof phone_call_log_pb.PhoneCallLog;
};

type PhoneCallLogServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof PhoneCallLogService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof phone_call_log_pb.PhoneCallLog;
  readonly responseType: typeof phone_call_log_pb.PhoneCallLog;
};

type PhoneCallLogServiceDelete = {
  readonly methodName: string;
  readonly service: typeof PhoneCallLogService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof phone_call_log_pb.PhoneCallLog;
  readonly responseType: typeof phone_call_log_pb.PhoneCallLog;
};

export class PhoneCallLogService {
  static readonly serviceName: string;
  static readonly Create: PhoneCallLogServiceCreate;
  static readonly Get: PhoneCallLogServiceGet;
  static readonly BatchGet: PhoneCallLogServiceBatchGet;
  static readonly List: PhoneCallLogServiceList;
  static readonly Update: PhoneCallLogServiceUpdate;
  static readonly Delete: PhoneCallLogServiceDelete;
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

export class PhoneCallLogServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: phone_call_log_pb.PhoneCallLog,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: phone_call_log_pb.PhoneCallLog|null) => void
  ): UnaryResponse;
  create(
    requestMessage: phone_call_log_pb.PhoneCallLog,
    callback: (error: ServiceError|null, responseMessage: phone_call_log_pb.PhoneCallLog|null) => void
  ): UnaryResponse;
  get(
    requestMessage: phone_call_log_pb.PhoneCallLog,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: phone_call_log_pb.PhoneCallLog|null) => void
  ): UnaryResponse;
  get(
    requestMessage: phone_call_log_pb.PhoneCallLog,
    callback: (error: ServiceError|null, responseMessage: phone_call_log_pb.PhoneCallLog|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: phone_call_log_pb.PhoneCallLog,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: phone_call_log_pb.PhoneCallLogList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: phone_call_log_pb.PhoneCallLog,
    callback: (error: ServiceError|null, responseMessage: phone_call_log_pb.PhoneCallLogList|null) => void
  ): UnaryResponse;
  list(requestMessage: phone_call_log_pb.PhoneCallLog, metadata?: grpc.Metadata): ResponseStream<phone_call_log_pb.PhoneCallLog>;
  update(
    requestMessage: phone_call_log_pb.PhoneCallLog,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: phone_call_log_pb.PhoneCallLog|null) => void
  ): UnaryResponse;
  update(
    requestMessage: phone_call_log_pb.PhoneCallLog,
    callback: (error: ServiceError|null, responseMessage: phone_call_log_pb.PhoneCallLog|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: phone_call_log_pb.PhoneCallLog,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: phone_call_log_pb.PhoneCallLog|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: phone_call_log_pb.PhoneCallLog,
    callback: (error: ServiceError|null, responseMessage: phone_call_log_pb.PhoneCallLog|null) => void
  ): UnaryResponse;
}

