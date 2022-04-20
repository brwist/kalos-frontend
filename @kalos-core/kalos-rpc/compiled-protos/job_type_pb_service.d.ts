// package: 
// file: job_type.proto

import * as job_type_pb from "./job_type_pb";
import {grpc} from "@improbable-eng/grpc-web";

type JobTypeServiceGet = {
  readonly methodName: string;
  readonly service: typeof JobTypeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof job_type_pb.JobType;
  readonly responseType: typeof job_type_pb.JobType;
};

type JobTypeServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof JobTypeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof job_type_pb.JobType;
  readonly responseType: typeof job_type_pb.JobTypeList;
};

type JobTypeServiceList = {
  readonly methodName: string;
  readonly service: typeof JobTypeService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof job_type_pb.JobType;
  readonly responseType: typeof job_type_pb.JobType;
};

export class JobTypeService {
  static readonly serviceName: string;
  static readonly Get: JobTypeServiceGet;
  static readonly BatchGet: JobTypeServiceBatchGet;
  static readonly List: JobTypeServiceList;
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

export class JobTypeServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  get(
    requestMessage: job_type_pb.JobType,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: job_type_pb.JobType|null) => void
  ): UnaryResponse;
  get(
    requestMessage: job_type_pb.JobType,
    callback: (error: ServiceError|null, responseMessage: job_type_pb.JobType|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: job_type_pb.JobType,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: job_type_pb.JobTypeList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: job_type_pb.JobType,
    callback: (error: ServiceError|null, responseMessage: job_type_pb.JobTypeList|null) => void
  ): UnaryResponse;
  list(requestMessage: job_type_pb.JobType, metadata?: grpc.Metadata): ResponseStream<job_type_pb.JobType>;
}

