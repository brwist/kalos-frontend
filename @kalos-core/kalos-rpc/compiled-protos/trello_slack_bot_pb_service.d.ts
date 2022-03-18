// package: 
// file: trello_slack_bot.proto

import * as trello_slack_bot_pb from "./trello_slack_bot_pb";
import * as common_pb from "./common_pb";
import {grpc} from "@improbable-eng/grpc-web";

type TrelloSlackBotStatus = {
  readonly methodName: string;
  readonly service: typeof TrelloSlackBot;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof common_pb.Empty;
  readonly responseType: typeof common_pb.String;
};

type TrelloSlackBotHelp = {
  readonly methodName: string;
  readonly service: typeof TrelloSlackBot;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof trello_slack_bot_pb.Request;
  readonly responseType: typeof common_pb.String;
};

export class TrelloSlackBot {
  static readonly serviceName: string;
  static readonly Status: TrelloSlackBotStatus;
  static readonly Help: TrelloSlackBotHelp;
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

export class TrelloSlackBotClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  status(
    requestMessage: common_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.String|null) => void
  ): UnaryResponse;
  status(
    requestMessage: common_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: common_pb.String|null) => void
  ): UnaryResponse;
  help(
    requestMessage: trello_slack_bot_pb.Request,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.String|null) => void
  ): UnaryResponse;
  help(
    requestMessage: trello_slack_bot_pb.Request,
    callback: (error: ServiceError|null, responseMessage: common_pb.String|null) => void
  ): UnaryResponse;
}

