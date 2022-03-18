// package: 
// file: slack.proto

import * as slack_pb from "./slack_pb";
import * as common_pb from "./common_pb";
import {grpc} from "@improbable-eng/grpc-web";

type SlackServiceDirectMessageUserById = {
  readonly methodName: string;
  readonly service: typeof SlackService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof slack_pb.DMReq;
  readonly responseType: typeof common_pb.Bool;
};

type SlackServiceDispatch = {
  readonly methodName: string;
  readonly service: typeof SlackService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof slack_pb.DispatchReq;
  readonly responseType: typeof common_pb.Bool;
};

type SlackServiceFirstCall = {
  readonly methodName: string;
  readonly service: typeof SlackService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof slack_pb.FCReq;
  readonly responseType: typeof common_pb.Bool;
};

export class SlackService {
  static readonly serviceName: string;
  static readonly DirectMessageUserById: SlackServiceDirectMessageUserById;
  static readonly Dispatch: SlackServiceDispatch;
  static readonly FirstCall: SlackServiceFirstCall;
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

export class SlackServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  directMessageUserById(
    requestMessage: slack_pb.DMReq,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Bool|null) => void
  ): UnaryResponse;
  directMessageUserById(
    requestMessage: slack_pb.DMReq,
    callback: (error: ServiceError|null, responseMessage: common_pb.Bool|null) => void
  ): UnaryResponse;
  dispatch(
    requestMessage: slack_pb.DispatchReq,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Bool|null) => void
  ): UnaryResponse;
  dispatch(
    requestMessage: slack_pb.DispatchReq,
    callback: (error: ServiceError|null, responseMessage: common_pb.Bool|null) => void
  ): UnaryResponse;
  firstCall(
    requestMessage: slack_pb.FCReq,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Bool|null) => void
  ): UnaryResponse;
  firstCall(
    requestMessage: slack_pb.FCReq,
    callback: (error: ServiceError|null, responseMessage: common_pb.Bool|null) => void
  ): UnaryResponse;
}

