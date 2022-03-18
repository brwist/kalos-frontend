// package: 
// file: job_subtype.proto

import * as job_subtype_pb from "./job_subtype_pb";
import {grpc} from "@improbable-eng/grpc-web";

type JobSubtypeServiceGet = {
  readonly methodName: string;
  readonly service: typeof JobSubtypeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof job_subtype_pb.JobSubtype;
  readonly responseType: typeof job_subtype_pb.JobSubtype;
};

type JobSubtypeServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof JobSubtypeService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof job_subtype_pb.JobSubtype;
  readonly responseType: typeof job_subtype_pb.JobSubtypeList;
};

type JobSubtypeServiceList = {
  readonly methodName: string;
  readonly service: typeof JobSubtypeService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof job_subtype_pb.JobSubtype;
  readonly responseType: typeof job_subtype_pb.JobSubtype;
};

export class JobSubtypeService {
  static readonly serviceName: string;
  static readonly Get: JobSubtypeServiceGet;
  static readonly BatchGet: JobSubtypeServiceBatchGet;
  static readonly List: JobSubtypeServiceList;
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

export class JobSubtypeServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  get(
    requestMessage: job_subtype_pb.JobSubtype,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: job_subtype_pb.JobSubtype|null) => void
  ): UnaryResponse;
  get(
    requestMessage: job_subtype_pb.JobSubtype,
    callback: (error: ServiceError|null, responseMessage: job_subtype_pb.JobSubtype|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: job_subtype_pb.JobSubtype,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: job_subtype_pb.JobSubtypeList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: job_subtype_pb.JobSubtype,
    callback: (error: ServiceError|null, responseMessage: job_subtype_pb.JobSubtypeList|null) => void
  ): UnaryResponse;
  list(requestMessage: job_subtype_pb.JobSubtype, metadata?: grpc.Metadata): ResponseStream<job_subtype_pb.JobSubtype>;
}

