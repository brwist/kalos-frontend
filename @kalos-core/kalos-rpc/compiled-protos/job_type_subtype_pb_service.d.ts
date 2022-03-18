// package: 
// file: job_type_subtype.proto

import * as job_type_subtype_pb from "./job_type_subtype_pb";
import {grpc} from "@improbable-eng/grpc-web";

type JobTypeSubtypeServiceCreate = {
  readonly methodName: string;
  readonly service: typeof JobTypeSubtypeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof job_type_subtype_pb.JobTypeSubtype;
  readonly responseType: typeof job_type_subtype_pb.JobTypeSubtype;
};

type JobTypeSubtypeServiceGet = {
  readonly methodName: string;
  readonly service: typeof JobTypeSubtypeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof job_type_subtype_pb.JobTypeSubtype;
  readonly responseType: typeof job_type_subtype_pb.JobTypeSubtype;
};

type JobTypeSubtypeServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof JobTypeSubtypeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof job_type_subtype_pb.JobTypeSubtype;
  readonly responseType: typeof job_type_subtype_pb.JobTypeSubtypeList;
};

type JobTypeSubtypeServiceList = {
  readonly methodName: string;
  readonly service: typeof JobTypeSubtypeService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof job_type_subtype_pb.JobTypeSubtype;
  readonly responseType: typeof job_type_subtype_pb.JobTypeSubtype;
};

type JobTypeSubtypeServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof JobTypeSubtypeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof job_type_subtype_pb.JobTypeSubtype;
  readonly responseType: typeof job_type_subtype_pb.JobTypeSubtype;
};

type JobTypeSubtypeServiceDelete = {
  readonly methodName: string;
  readonly service: typeof JobTypeSubtypeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof job_type_subtype_pb.JobTypeSubtype;
  readonly responseType: typeof job_type_subtype_pb.JobTypeSubtype;
};

export class JobTypeSubtypeService {
  static readonly serviceName: string;
  static readonly Create: JobTypeSubtypeServiceCreate;
  static readonly Get: JobTypeSubtypeServiceGet;
  static readonly BatchGet: JobTypeSubtypeServiceBatchGet;
  static readonly List: JobTypeSubtypeServiceList;
  static readonly Update: JobTypeSubtypeServiceUpdate;
  static readonly Delete: JobTypeSubtypeServiceDelete;
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

export class JobTypeSubtypeServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: job_type_subtype_pb.JobTypeSubtype,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: job_type_subtype_pb.JobTypeSubtype|null) => void
  ): UnaryResponse;
  create(
    requestMessage: job_type_subtype_pb.JobTypeSubtype,
    callback: (error: ServiceError|null, responseMessage: job_type_subtype_pb.JobTypeSubtype|null) => void
  ): UnaryResponse;
  get(
    requestMessage: job_type_subtype_pb.JobTypeSubtype,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: job_type_subtype_pb.JobTypeSubtype|null) => void
  ): UnaryResponse;
  get(
    requestMessage: job_type_subtype_pb.JobTypeSubtype,
    callback: (error: ServiceError|null, responseMessage: job_type_subtype_pb.JobTypeSubtype|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: job_type_subtype_pb.JobTypeSubtype,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: job_type_subtype_pb.JobTypeSubtypeList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: job_type_subtype_pb.JobTypeSubtype,
    callback: (error: ServiceError|null, responseMessage: job_type_subtype_pb.JobTypeSubtypeList|null) => void
  ): UnaryResponse;
  list(requestMessage: job_type_subtype_pb.JobTypeSubtype, metadata?: grpc.Metadata): ResponseStream<job_type_subtype_pb.JobTypeSubtype>;
  update(
    requestMessage: job_type_subtype_pb.JobTypeSubtype,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: job_type_subtype_pb.JobTypeSubtype|null) => void
  ): UnaryResponse;
  update(
    requestMessage: job_type_subtype_pb.JobTypeSubtype,
    callback: (error: ServiceError|null, responseMessage: job_type_subtype_pb.JobTypeSubtype|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: job_type_subtype_pb.JobTypeSubtype,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: job_type_subtype_pb.JobTypeSubtype|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: job_type_subtype_pb.JobTypeSubtype,
    callback: (error: ServiceError|null, responseMessage: job_type_subtype_pb.JobTypeSubtype|null) => void
  ): UnaryResponse;
}

