// package: 
// file: call_association.proto

import * as call_association_pb from "./call_association_pb";
import {grpc} from "@improbable-eng/grpc-web";

type CallAssociationServiceCreate = {
  readonly methodName: string;
  readonly service: typeof CallAssociationService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof call_association_pb.CallAssociation;
  readonly responseType: typeof call_association_pb.CallAssociation;
};

type CallAssociationServiceGet = {
  readonly methodName: string;
  readonly service: typeof CallAssociationService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof call_association_pb.CallAssociation;
  readonly responseType: typeof call_association_pb.CallAssociation;
};

type CallAssociationServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof CallAssociationService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof call_association_pb.CallAssociation;
  readonly responseType: typeof call_association_pb.CallAssociationList;
};

type CallAssociationServiceList = {
  readonly methodName: string;
  readonly service: typeof CallAssociationService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof call_association_pb.CallAssociation;
  readonly responseType: typeof call_association_pb.CallAssociation;
};

type CallAssociationServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof CallAssociationService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof call_association_pb.CallAssociation;
  readonly responseType: typeof call_association_pb.CallAssociation;
};

type CallAssociationServiceDelete = {
  readonly methodName: string;
  readonly service: typeof CallAssociationService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof call_association_pb.CallAssociation;
  readonly responseType: typeof call_association_pb.CallAssociation;
};

export class CallAssociationService {
  static readonly serviceName: string;
  static readonly Create: CallAssociationServiceCreate;
  static readonly Get: CallAssociationServiceGet;
  static readonly BatchGet: CallAssociationServiceBatchGet;
  static readonly List: CallAssociationServiceList;
  static readonly Update: CallAssociationServiceUpdate;
  static readonly Delete: CallAssociationServiceDelete;
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

export class CallAssociationServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: call_association_pb.CallAssociation,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: call_association_pb.CallAssociation|null) => void
  ): UnaryResponse;
  create(
    requestMessage: call_association_pb.CallAssociation,
    callback: (error: ServiceError|null, responseMessage: call_association_pb.CallAssociation|null) => void
  ): UnaryResponse;
  get(
    requestMessage: call_association_pb.CallAssociation,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: call_association_pb.CallAssociation|null) => void
  ): UnaryResponse;
  get(
    requestMessage: call_association_pb.CallAssociation,
    callback: (error: ServiceError|null, responseMessage: call_association_pb.CallAssociation|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: call_association_pb.CallAssociation,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: call_association_pb.CallAssociationList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: call_association_pb.CallAssociation,
    callback: (error: ServiceError|null, responseMessage: call_association_pb.CallAssociationList|null) => void
  ): UnaryResponse;
  list(requestMessage: call_association_pb.CallAssociation, metadata?: grpc.Metadata): ResponseStream<call_association_pb.CallAssociation>;
  update(
    requestMessage: call_association_pb.CallAssociation,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: call_association_pb.CallAssociation|null) => void
  ): UnaryResponse;
  update(
    requestMessage: call_association_pb.CallAssociation,
    callback: (error: ServiceError|null, responseMessage: call_association_pb.CallAssociation|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: call_association_pb.CallAssociation,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: call_association_pb.CallAssociation|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: call_association_pb.CallAssociation,
    callback: (error: ServiceError|null, responseMessage: call_association_pb.CallAssociation|null) => void
  ): UnaryResponse;
}

