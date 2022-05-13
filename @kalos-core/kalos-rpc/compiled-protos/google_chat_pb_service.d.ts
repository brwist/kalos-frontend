// package: 
// file: google_chat.proto

import * as google_chat_pb from "./google_chat_pb";
import * as common_pb from "./common_pb";
import {grpc} from "@improbable-eng/grpc-web";

type GoogleChatStatus = {
  readonly methodName: string;
  readonly service: typeof GoogleChat;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof common_pb.Empty;
  readonly responseType: typeof common_pb.String;
};

type GoogleChatSendMessageViaPost = {
  readonly methodName: string;
  readonly service: typeof GoogleChat;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof google_chat_pb.InitialRequest;
  readonly responseType: typeof common_pb.String;
};

type GoogleChatMessageInChannel = {
  readonly methodName: string;
  readonly service: typeof GoogleChat;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof google_chat_pb.Message;
  readonly responseType: typeof common_pb.Empty;
};

export class GoogleChat {
  static readonly serviceName: string;
  static readonly Status: GoogleChatStatus;
  static readonly SendMessageViaPost: GoogleChatSendMessageViaPost;
  static readonly MessageInChannel: GoogleChatMessageInChannel;
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

export class GoogleChatClient {
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
  sendMessageViaPost(
    requestMessage: google_chat_pb.InitialRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.String|null) => void
  ): UnaryResponse;
  sendMessageViaPost(
    requestMessage: google_chat_pb.InitialRequest,
    callback: (error: ServiceError|null, responseMessage: common_pb.String|null) => void
  ): UnaryResponse;
  messageInChannel(
    requestMessage: google_chat_pb.Message,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  messageInChannel(
    requestMessage: google_chat_pb.Message,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
}

