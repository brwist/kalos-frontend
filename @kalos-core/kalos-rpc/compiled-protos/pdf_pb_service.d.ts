// package: 
// file: pdf.proto

import * as pdf_pb from "./pdf_pb";
import * as s3_pb from "./s3_pb";
import {grpc} from "@improbable-eng/grpc-web";

type PDFServiceCreate = {
  readonly methodName: string;
  readonly service: typeof PDFService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof pdf_pb.HTML;
  readonly responseType: typeof s3_pb.URLObject;
};

export class PDFService {
  static readonly serviceName: string;
  static readonly Create: PDFServiceCreate;
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

export class PDFServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: pdf_pb.HTML,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: s3_pb.URLObject|null) => void
  ): UnaryResponse;
  create(
    requestMessage: pdf_pb.HTML,
    callback: (error: ServiceError|null, responseMessage: s3_pb.URLObject|null) => void
  ): UnaryResponse;
}

