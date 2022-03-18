// package: 
// file: maintenance_question.proto

import * as maintenance_question_pb from "./maintenance_question_pb";
import {grpc} from "@improbable-eng/grpc-web";

type MaintenanceQuestionServiceCreate = {
  readonly methodName: string;
  readonly service: typeof MaintenanceQuestionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof maintenance_question_pb.MaintenanceQuestion;
  readonly responseType: typeof maintenance_question_pb.MaintenanceQuestion;
};

type MaintenanceQuestionServiceGet = {
  readonly methodName: string;
  readonly service: typeof MaintenanceQuestionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof maintenance_question_pb.MaintenanceQuestion;
  readonly responseType: typeof maintenance_question_pb.MaintenanceQuestion;
};

type MaintenanceQuestionServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof MaintenanceQuestionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof maintenance_question_pb.MaintenanceQuestion;
  readonly responseType: typeof maintenance_question_pb.MaintenanceQuestionList;
};

type MaintenanceQuestionServiceList = {
  readonly methodName: string;
  readonly service: typeof MaintenanceQuestionService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof maintenance_question_pb.MaintenanceQuestion;
  readonly responseType: typeof maintenance_question_pb.MaintenanceQuestion;
};

type MaintenanceQuestionServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof MaintenanceQuestionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof maintenance_question_pb.MaintenanceQuestion;
  readonly responseType: typeof maintenance_question_pb.MaintenanceQuestion;
};

type MaintenanceQuestionServiceDelete = {
  readonly methodName: string;
  readonly service: typeof MaintenanceQuestionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof maintenance_question_pb.MaintenanceQuestion;
  readonly responseType: typeof maintenance_question_pb.MaintenanceQuestion;
};

export class MaintenanceQuestionService {
  static readonly serviceName: string;
  static readonly Create: MaintenanceQuestionServiceCreate;
  static readonly Get: MaintenanceQuestionServiceGet;
  static readonly BatchGet: MaintenanceQuestionServiceBatchGet;
  static readonly List: MaintenanceQuestionServiceList;
  static readonly Update: MaintenanceQuestionServiceUpdate;
  static readonly Delete: MaintenanceQuestionServiceDelete;
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

export class MaintenanceQuestionServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: maintenance_question_pb.MaintenanceQuestion,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: maintenance_question_pb.MaintenanceQuestion|null) => void
  ): UnaryResponse;
  create(
    requestMessage: maintenance_question_pb.MaintenanceQuestion,
    callback: (error: ServiceError|null, responseMessage: maintenance_question_pb.MaintenanceQuestion|null) => void
  ): UnaryResponse;
  get(
    requestMessage: maintenance_question_pb.MaintenanceQuestion,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: maintenance_question_pb.MaintenanceQuestion|null) => void
  ): UnaryResponse;
  get(
    requestMessage: maintenance_question_pb.MaintenanceQuestion,
    callback: (error: ServiceError|null, responseMessage: maintenance_question_pb.MaintenanceQuestion|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: maintenance_question_pb.MaintenanceQuestion,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: maintenance_question_pb.MaintenanceQuestionList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: maintenance_question_pb.MaintenanceQuestion,
    callback: (error: ServiceError|null, responseMessage: maintenance_question_pb.MaintenanceQuestionList|null) => void
  ): UnaryResponse;
  list(requestMessage: maintenance_question_pb.MaintenanceQuestion, metadata?: grpc.Metadata): ResponseStream<maintenance_question_pb.MaintenanceQuestion>;
  update(
    requestMessage: maintenance_question_pb.MaintenanceQuestion,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: maintenance_question_pb.MaintenanceQuestion|null) => void
  ): UnaryResponse;
  update(
    requestMessage: maintenance_question_pb.MaintenanceQuestion,
    callback: (error: ServiceError|null, responseMessage: maintenance_question_pb.MaintenanceQuestion|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: maintenance_question_pb.MaintenanceQuestion,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: maintenance_question_pb.MaintenanceQuestion|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: maintenance_question_pb.MaintenanceQuestion,
    callback: (error: ServiceError|null, responseMessage: maintenance_question_pb.MaintenanceQuestion|null) => void
  ): UnaryResponse;
}

