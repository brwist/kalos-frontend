// package: 
// file: spiff_tool_admin_action.proto

import * as spiff_tool_admin_action_pb from "./spiff_tool_admin_action_pb";
import {grpc} from "@improbable-eng/grpc-web";

type SpiffToolAdminActionServiceCreate = {
  readonly methodName: string;
  readonly service: typeof SpiffToolAdminActionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof spiff_tool_admin_action_pb.SpiffToolAdminAction;
  readonly responseType: typeof spiff_tool_admin_action_pb.SpiffToolAdminAction;
};

type SpiffToolAdminActionServiceGet = {
  readonly methodName: string;
  readonly service: typeof SpiffToolAdminActionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof spiff_tool_admin_action_pb.SpiffToolAdminAction;
  readonly responseType: typeof spiff_tool_admin_action_pb.SpiffToolAdminAction;
};

type SpiffToolAdminActionServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof SpiffToolAdminActionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof spiff_tool_admin_action_pb.SpiffToolAdminAction;
  readonly responseType: typeof spiff_tool_admin_action_pb.SpiffToolAdminActionList;
};

type SpiffToolAdminActionServiceList = {
  readonly methodName: string;
  readonly service: typeof SpiffToolAdminActionService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof spiff_tool_admin_action_pb.SpiffToolAdminAction;
  readonly responseType: typeof spiff_tool_admin_action_pb.SpiffToolAdminAction;
};

type SpiffToolAdminActionServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof SpiffToolAdminActionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof spiff_tool_admin_action_pb.SpiffToolAdminAction;
  readonly responseType: typeof spiff_tool_admin_action_pb.SpiffToolAdminAction;
};

type SpiffToolAdminActionServiceDelete = {
  readonly methodName: string;
  readonly service: typeof SpiffToolAdminActionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof spiff_tool_admin_action_pb.SpiffToolAdminAction;
  readonly responseType: typeof spiff_tool_admin_action_pb.SpiffToolAdminAction;
};

export class SpiffToolAdminActionService {
  static readonly serviceName: string;
  static readonly Create: SpiffToolAdminActionServiceCreate;
  static readonly Get: SpiffToolAdminActionServiceGet;
  static readonly BatchGet: SpiffToolAdminActionServiceBatchGet;
  static readonly List: SpiffToolAdminActionServiceList;
  static readonly Update: SpiffToolAdminActionServiceUpdate;
  static readonly Delete: SpiffToolAdminActionServiceDelete;
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

export class SpiffToolAdminActionServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: spiff_tool_admin_action_pb.SpiffToolAdminAction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: spiff_tool_admin_action_pb.SpiffToolAdminAction|null) => void
  ): UnaryResponse;
  create(
    requestMessage: spiff_tool_admin_action_pb.SpiffToolAdminAction,
    callback: (error: ServiceError|null, responseMessage: spiff_tool_admin_action_pb.SpiffToolAdminAction|null) => void
  ): UnaryResponse;
  get(
    requestMessage: spiff_tool_admin_action_pb.SpiffToolAdminAction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: spiff_tool_admin_action_pb.SpiffToolAdminAction|null) => void
  ): UnaryResponse;
  get(
    requestMessage: spiff_tool_admin_action_pb.SpiffToolAdminAction,
    callback: (error: ServiceError|null, responseMessage: spiff_tool_admin_action_pb.SpiffToolAdminAction|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: spiff_tool_admin_action_pb.SpiffToolAdminAction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: spiff_tool_admin_action_pb.SpiffToolAdminActionList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: spiff_tool_admin_action_pb.SpiffToolAdminAction,
    callback: (error: ServiceError|null, responseMessage: spiff_tool_admin_action_pb.SpiffToolAdminActionList|null) => void
  ): UnaryResponse;
  list(requestMessage: spiff_tool_admin_action_pb.SpiffToolAdminAction, metadata?: grpc.Metadata): ResponseStream<spiff_tool_admin_action_pb.SpiffToolAdminAction>;
  update(
    requestMessage: spiff_tool_admin_action_pb.SpiffToolAdminAction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: spiff_tool_admin_action_pb.SpiffToolAdminAction|null) => void
  ): UnaryResponse;
  update(
    requestMessage: spiff_tool_admin_action_pb.SpiffToolAdminAction,
    callback: (error: ServiceError|null, responseMessage: spiff_tool_admin_action_pb.SpiffToolAdminAction|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: spiff_tool_admin_action_pb.SpiffToolAdminAction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: spiff_tool_admin_action_pb.SpiffToolAdminAction|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: spiff_tool_admin_action_pb.SpiffToolAdminAction,
    callback: (error: ServiceError|null, responseMessage: spiff_tool_admin_action_pb.SpiffToolAdminAction|null) => void
  ): UnaryResponse;
}

