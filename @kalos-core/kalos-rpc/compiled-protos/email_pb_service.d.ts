// package: 
// file: email.proto

import * as email_pb from "./email_pb";
import * as common_pb from "./common_pb";
import {grpc} from "@improbable-eng/grpc-web";

type EmailServiceCreate = {
  readonly methodName: string;
  readonly service: typeof EmailService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof email_pb.Email;
  readonly responseType: typeof email_pb.Email;
};

type EmailServiceSendSQS = {
  readonly methodName: string;
  readonly service: typeof EmailService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof email_pb.SQSEmail;
  readonly responseType: typeof common_pb.Bool;
};

type EmailServiceSendSQSInvoiceEmail = {
  readonly methodName: string;
  readonly service: typeof EmailService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof email_pb.SQSEmailAndDocument;
  readonly responseType: typeof common_pb.Bool;
};

type EmailServiceGetInvoiceBody = {
  readonly methodName: string;
  readonly service: typeof EmailService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof email_pb.InvoiceBodyRequest;
  readonly responseType: typeof common_pb.String;
};

export class EmailService {
  static readonly serviceName: string;
  static readonly Create: EmailServiceCreate;
  static readonly SendSQS: EmailServiceSendSQS;
  static readonly SendSQSInvoiceEmail: EmailServiceSendSQSInvoiceEmail;
  static readonly GetInvoiceBody: EmailServiceGetInvoiceBody;
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

export class EmailServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: email_pb.Email,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: email_pb.Email|null) => void
  ): UnaryResponse;
  create(
    requestMessage: email_pb.Email,
    callback: (error: ServiceError|null, responseMessage: email_pb.Email|null) => void
  ): UnaryResponse;
  sendSQS(
    requestMessage: email_pb.SQSEmail,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Bool|null) => void
  ): UnaryResponse;
  sendSQS(
    requestMessage: email_pb.SQSEmail,
    callback: (error: ServiceError|null, responseMessage: common_pb.Bool|null) => void
  ): UnaryResponse;
  sendSQSInvoiceEmail(
    requestMessage: email_pb.SQSEmailAndDocument,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Bool|null) => void
  ): UnaryResponse;
  sendSQSInvoiceEmail(
    requestMessage: email_pb.SQSEmailAndDocument,
    callback: (error: ServiceError|null, responseMessage: common_pb.Bool|null) => void
  ): UnaryResponse;
  getInvoiceBody(
    requestMessage: email_pb.InvoiceBodyRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.String|null) => void
  ): UnaryResponse;
  getInvoiceBody(
    requestMessage: email_pb.InvoiceBodyRequest,
    callback: (error: ServiceError|null, responseMessage: common_pb.String|null) => void
  ): UnaryResponse;
}

