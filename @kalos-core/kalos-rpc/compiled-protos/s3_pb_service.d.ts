// package: 
// file: s3.proto

import * as s3_pb from "./s3_pb";
import * as common_pb from "./common_pb";
import {grpc} from "@improbable-eng/grpc-web";

type S3ServiceCreate = {
  readonly methodName: string;
  readonly service: typeof S3Service;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof s3_pb.FileObject;
  readonly responseType: typeof s3_pb.FileObject;
};

type S3ServiceGet = {
  readonly methodName: string;
  readonly service: typeof S3Service;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof s3_pb.FileObject;
  readonly responseType: typeof s3_pb.FileObject;
};

type S3ServiceDelete = {
  readonly methodName: string;
  readonly service: typeof S3Service;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof s3_pb.FileObject;
  readonly responseType: typeof s3_pb.FileObject;
};

type S3ServiceMove = {
  readonly methodName: string;
  readonly service: typeof S3Service;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof s3_pb.MoveConfig;
  readonly responseType: typeof common_pb.Empty;
};

type S3ServiceGetUploadURL = {
  readonly methodName: string;
  readonly service: typeof S3Service;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof s3_pb.URLObject;
  readonly responseType: typeof s3_pb.URLObject;
};

type S3ServiceGetDownloadURL = {
  readonly methodName: string;
  readonly service: typeof S3Service;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof s3_pb.URLObject;
  readonly responseType: typeof s3_pb.URLObject;
};

export class S3Service {
  static readonly serviceName: string;
  static readonly Create: S3ServiceCreate;
  static readonly Get: S3ServiceGet;
  static readonly Delete: S3ServiceDelete;
  static readonly Move: S3ServiceMove;
  static readonly GetUploadURL: S3ServiceGetUploadURL;
  static readonly GetDownloadURL: S3ServiceGetDownloadURL;
}

type BucketServiceCreate = {
  readonly methodName: string;
  readonly service: typeof BucketService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof s3_pb.BucketObject;
  readonly responseType: typeof s3_pb.BucketObject;
};

type BucketServiceGet = {
  readonly methodName: string;
  readonly service: typeof BucketService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof s3_pb.BucketObject;
  readonly responseType: typeof s3_pb.FileObjects;
};

type BucketServiceDelete = {
  readonly methodName: string;
  readonly service: typeof BucketService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof s3_pb.BucketObject;
  readonly responseType: typeof s3_pb.BucketObject;
};

export class BucketService {
  static readonly serviceName: string;
  static readonly Create: BucketServiceCreate;
  static readonly Get: BucketServiceGet;
  static readonly Delete: BucketServiceDelete;
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

export class S3ServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: s3_pb.FileObject,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: s3_pb.FileObject|null) => void
  ): UnaryResponse;
  create(
    requestMessage: s3_pb.FileObject,
    callback: (error: ServiceError|null, responseMessage: s3_pb.FileObject|null) => void
  ): UnaryResponse;
  get(
    requestMessage: s3_pb.FileObject,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: s3_pb.FileObject|null) => void
  ): UnaryResponse;
  get(
    requestMessage: s3_pb.FileObject,
    callback: (error: ServiceError|null, responseMessage: s3_pb.FileObject|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: s3_pb.FileObject,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: s3_pb.FileObject|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: s3_pb.FileObject,
    callback: (error: ServiceError|null, responseMessage: s3_pb.FileObject|null) => void
  ): UnaryResponse;
  move(
    requestMessage: s3_pb.MoveConfig,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  move(
    requestMessage: s3_pb.MoveConfig,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  getUploadURL(
    requestMessage: s3_pb.URLObject,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: s3_pb.URLObject|null) => void
  ): UnaryResponse;
  getUploadURL(
    requestMessage: s3_pb.URLObject,
    callback: (error: ServiceError|null, responseMessage: s3_pb.URLObject|null) => void
  ): UnaryResponse;
  getDownloadURL(
    requestMessage: s3_pb.URLObject,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: s3_pb.URLObject|null) => void
  ): UnaryResponse;
  getDownloadURL(
    requestMessage: s3_pb.URLObject,
    callback: (error: ServiceError|null, responseMessage: s3_pb.URLObject|null) => void
  ): UnaryResponse;
}

export class BucketServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: s3_pb.BucketObject,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: s3_pb.BucketObject|null) => void
  ): UnaryResponse;
  create(
    requestMessage: s3_pb.BucketObject,
    callback: (error: ServiceError|null, responseMessage: s3_pb.BucketObject|null) => void
  ): UnaryResponse;
  get(
    requestMessage: s3_pb.BucketObject,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: s3_pb.FileObjects|null) => void
  ): UnaryResponse;
  get(
    requestMessage: s3_pb.BucketObject,
    callback: (error: ServiceError|null, responseMessage: s3_pb.FileObjects|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: s3_pb.BucketObject,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: s3_pb.BucketObject|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: s3_pb.BucketObject,
    callback: (error: ServiceError|null, responseMessage: s3_pb.BucketObject|null) => void
  ): UnaryResponse;
}

