// package: 
// file: trello.proto

import * as trello_pb from "./trello_pb";
import * as common_pb from "./common_pb";
import {grpc} from "@improbable-eng/grpc-web";

type TrelloServiceGetBoardById = {
  readonly methodName: string;
  readonly service: typeof TrelloService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof common_pb.String;
  readonly responseType: typeof trello_pb.Board;
};

type TrelloServiceBatchGetBoardsById = {
  readonly methodName: string;
  readonly service: typeof TrelloService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof trello_pb.BoardIdList;
  readonly responseType: typeof trello_pb.BoardList;
};

type TrelloServiceCreateBoard = {
  readonly methodName: string;
  readonly service: typeof TrelloService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof trello_pb.Board;
  readonly responseType: typeof trello_pb.Board;
};

type TrelloServiceUpdateBoard = {
  readonly methodName: string;
  readonly service: typeof TrelloService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof trello_pb.Board;
  readonly responseType: typeof trello_pb.Board;
};

type TrelloServiceDeleteBoardById = {
  readonly methodName: string;
  readonly service: typeof TrelloService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof common_pb.String;
  readonly responseType: typeof common_pb.Empty;
};

export class TrelloService {
  static readonly serviceName: string;
  static readonly GetBoardById: TrelloServiceGetBoardById;
  static readonly BatchGetBoardsById: TrelloServiceBatchGetBoardsById;
  static readonly CreateBoard: TrelloServiceCreateBoard;
  static readonly UpdateBoard: TrelloServiceUpdateBoard;
  static readonly DeleteBoardById: TrelloServiceDeleteBoardById;
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

export class TrelloServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getBoardById(
    requestMessage: common_pb.String,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: trello_pb.Board|null) => void
  ): UnaryResponse;
  getBoardById(
    requestMessage: common_pb.String,
    callback: (error: ServiceError|null, responseMessage: trello_pb.Board|null) => void
  ): UnaryResponse;
  batchGetBoardsById(
    requestMessage: trello_pb.BoardIdList,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: trello_pb.BoardList|null) => void
  ): UnaryResponse;
  batchGetBoardsById(
    requestMessage: trello_pb.BoardIdList,
    callback: (error: ServiceError|null, responseMessage: trello_pb.BoardList|null) => void
  ): UnaryResponse;
  createBoard(
    requestMessage: trello_pb.Board,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: trello_pb.Board|null) => void
  ): UnaryResponse;
  createBoard(
    requestMessage: trello_pb.Board,
    callback: (error: ServiceError|null, responseMessage: trello_pb.Board|null) => void
  ): UnaryResponse;
  updateBoard(
    requestMessage: trello_pb.Board,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: trello_pb.Board|null) => void
  ): UnaryResponse;
  updateBoard(
    requestMessage: trello_pb.Board,
    callback: (error: ServiceError|null, responseMessage: trello_pb.Board|null) => void
  ): UnaryResponse;
  deleteBoardById(
    requestMessage: common_pb.String,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  deleteBoardById(
    requestMessage: common_pb.String,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
}

