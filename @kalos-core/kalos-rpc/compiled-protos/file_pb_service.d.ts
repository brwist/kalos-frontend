// package: 
// file: file.proto

import * as file_pb from "./file_pb";
import {grpc} from "@improbable-eng/grpc-web";

type FileServiceCreate = {
  readonly methodName: string;
  readonly service: typeof FileService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof file_pb.File;
  readonly responseType: typeof file_pb.File;
};

type FileServiceGet = {
  readonly methodName: string;
  readonly service: typeof FileService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof file_pb.File;
  readonly responseType: typeof file_pb.File;
};

type FileServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof FileService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof file_pb.File;
  readonly responseType: typeof file_pb.FileList;
};

type FileServiceList = {
  readonly methodName: string;
  readonly service: typeof FileService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof file_pb.File;
  readonly responseType: typeof file_pb.File;
};

type FileServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof FileService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof file_pb.File;
  readonly responseType: typeof file_pb.File;
};

type FileServiceDelete = {
  readonly methodName: string;
  readonly service: typeof FileService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof file_pb.File;
  readonly responseType: typeof file_pb.File;
};

export class FileService {
  static readonly serviceName: string;
  static readonly Create: FileServiceCreate;
  static readonly Get: FileServiceGet;
  static readonly BatchGet: FileServiceBatchGet;
  static readonly List: FileServiceList;
  static readonly Update: FileServiceUpdate;
  static readonly Delete: FileServiceDelete;
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

export class FileServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: file_pb.File,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: file_pb.File|null) => void
  ): UnaryResponse;
  create(
    requestMessage: file_pb.File,
    callback: (error: ServiceError|null, responseMessage: file_pb.File|null) => void
  ): UnaryResponse;
  get(
    requestMessage: file_pb.File,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: file_pb.File|null) => void
  ): UnaryResponse;
  get(
    requestMessage: file_pb.File,
    callback: (error: ServiceError|null, responseMessage: file_pb.File|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: file_pb.File,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: file_pb.FileList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: file_pb.File,
    callback: (error: ServiceError|null, responseMessage: file_pb.FileList|null) => void
  ): UnaryResponse;
  list(requestMessage: file_pb.File, metadata?: grpc.Metadata): ResponseStream<file_pb.File>;
  update(
    requestMessage: file_pb.File,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: file_pb.File|null) => void
  ): UnaryResponse;
  update(
    requestMessage: file_pb.File,
    callback: (error: ServiceError|null, responseMessage: file_pb.File|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: file_pb.File,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: file_pb.File|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: file_pb.File,
    callback: (error: ServiceError|null, responseMessage: file_pb.File|null) => void
  ): UnaryResponse;
}

