// package: 
// file: contract.proto

import * as contract_pb from "./contract_pb";
import {grpc} from "@improbable-eng/grpc-web";

type ContractServiceCreate = {
  readonly methodName: string;
  readonly service: typeof ContractService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof contract_pb.Contract;
  readonly responseType: typeof contract_pb.Contract;
};

type ContractServiceGet = {
  readonly methodName: string;
  readonly service: typeof ContractService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof contract_pb.Contract;
  readonly responseType: typeof contract_pb.Contract;
};

type ContractServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof ContractService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof contract_pb.Contract;
  readonly responseType: typeof contract_pb.ContractList;
};

type ContractServiceList = {
  readonly methodName: string;
  readonly service: typeof ContractService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof contract_pb.Contract;
  readonly responseType: typeof contract_pb.Contract;
};

type ContractServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof ContractService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof contract_pb.Contract;
  readonly responseType: typeof contract_pb.Contract;
};

type ContractServiceDelete = {
  readonly methodName: string;
  readonly service: typeof ContractService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof contract_pb.Contract;
  readonly responseType: typeof contract_pb.Contract;
};

export class ContractService {
  static readonly serviceName: string;
  static readonly Create: ContractServiceCreate;
  static readonly Get: ContractServiceGet;
  static readonly BatchGet: ContractServiceBatchGet;
  static readonly List: ContractServiceList;
  static readonly Update: ContractServiceUpdate;
  static readonly Delete: ContractServiceDelete;
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

export class ContractServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: contract_pb.Contract,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: contract_pb.Contract|null) => void
  ): UnaryResponse;
  create(
    requestMessage: contract_pb.Contract,
    callback: (error: ServiceError|null, responseMessage: contract_pb.Contract|null) => void
  ): UnaryResponse;
  get(
    requestMessage: contract_pb.Contract,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: contract_pb.Contract|null) => void
  ): UnaryResponse;
  get(
    requestMessage: contract_pb.Contract,
    callback: (error: ServiceError|null, responseMessage: contract_pb.Contract|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: contract_pb.Contract,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: contract_pb.ContractList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: contract_pb.Contract,
    callback: (error: ServiceError|null, responseMessage: contract_pb.ContractList|null) => void
  ): UnaryResponse;
  list(requestMessage: contract_pb.Contract, metadata?: grpc.Metadata): ResponseStream<contract_pb.Contract>;
  update(
    requestMessage: contract_pb.Contract,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: contract_pb.Contract|null) => void
  ): UnaryResponse;
  update(
    requestMessage: contract_pb.Contract,
    callback: (error: ServiceError|null, responseMessage: contract_pb.Contract|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: contract_pb.Contract,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: contract_pb.Contract|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: contract_pb.Contract,
    callback: (error: ServiceError|null, responseMessage: contract_pb.Contract|null) => void
  ): UnaryResponse;
}

