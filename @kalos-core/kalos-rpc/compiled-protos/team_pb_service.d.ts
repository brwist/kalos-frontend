// package: 
// file: team.proto

import * as team_pb from "./team_pb";
import {grpc} from "@improbable-eng/grpc-web";

type TeamServiceCreate = {
  readonly methodName: string;
  readonly service: typeof TeamService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof team_pb.Team;
  readonly responseType: typeof team_pb.Team;
};

type TeamServiceGet = {
  readonly methodName: string;
  readonly service: typeof TeamService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof team_pb.Team;
  readonly responseType: typeof team_pb.Team;
};

type TeamServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof TeamService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof team_pb.Team;
  readonly responseType: typeof team_pb.TeamList;
};

type TeamServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof TeamService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof team_pb.Team;
  readonly responseType: typeof team_pb.Team;
};

type TeamServiceDelete = {
  readonly methodName: string;
  readonly service: typeof TeamService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof team_pb.Team;
  readonly responseType: typeof team_pb.Team;
};

export class TeamService {
  static readonly serviceName: string;
  static readonly Create: TeamServiceCreate;
  static readonly Get: TeamServiceGet;
  static readonly BatchGet: TeamServiceBatchGet;
  static readonly Update: TeamServiceUpdate;
  static readonly Delete: TeamServiceDelete;
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

export class TeamServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: team_pb.Team,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: team_pb.Team|null) => void
  ): UnaryResponse;
  create(
    requestMessage: team_pb.Team,
    callback: (error: ServiceError|null, responseMessage: team_pb.Team|null) => void
  ): UnaryResponse;
  get(
    requestMessage: team_pb.Team,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: team_pb.Team|null) => void
  ): UnaryResponse;
  get(
    requestMessage: team_pb.Team,
    callback: (error: ServiceError|null, responseMessage: team_pb.Team|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: team_pb.Team,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: team_pb.TeamList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: team_pb.Team,
    callback: (error: ServiceError|null, responseMessage: team_pb.TeamList|null) => void
  ): UnaryResponse;
  update(
    requestMessage: team_pb.Team,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: team_pb.Team|null) => void
  ): UnaryResponse;
  update(
    requestMessage: team_pb.Team,
    callback: (error: ServiceError|null, responseMessage: team_pb.Team|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: team_pb.Team,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: team_pb.Team|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: team_pb.Team,
    callback: (error: ServiceError|null, responseMessage: team_pb.Team|null) => void
  ): UnaryResponse;
}

