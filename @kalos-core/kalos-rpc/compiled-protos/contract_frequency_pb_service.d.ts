// package: 
// file: contract_frequency.proto

import * as contract_frequency_pb from "./contract_frequency_pb";
import {grpc} from "@improbable-eng/grpc-web";

type ContractFrequencyServiceCreate = {
  readonly methodName: string;
  readonly service: typeof ContractFrequencyService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof contract_frequency_pb.ContractFrequency;
  readonly responseType: typeof contract_frequency_pb.ContractFrequency;
};

type ContractFrequencyServiceGet = {
  readonly methodName: string;
  readonly service: typeof ContractFrequencyService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof contract_frequency_pb.ContractFrequency;
  readonly responseType: typeof contract_frequency_pb.ContractFrequency;
};

type ContractFrequencyServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof ContractFrequencyService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof contract_frequency_pb.ContractFrequency;
  readonly responseType: typeof contract_frequency_pb.ContractFrequencyList;
};

type ContractFrequencyServiceList = {
  readonly methodName: string;
  readonly service: typeof ContractFrequencyService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof contract_frequency_pb.ContractFrequency;
  readonly responseType: typeof contract_frequency_pb.ContractFrequency;
};

type ContractFrequencyServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof ContractFrequencyService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof contract_frequency_pb.ContractFrequency;
  readonly responseType: typeof contract_frequency_pb.ContractFrequency;
};

type ContractFrequencyServiceDelete = {
  readonly methodName: string;
  readonly service: typeof ContractFrequencyService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof contract_frequency_pb.ContractFrequency;
  readonly responseType: typeof contract_frequency_pb.ContractFrequency;
};

export class ContractFrequencyService {
  static readonly serviceName: string;
  static readonly Create: ContractFrequencyServiceCreate;
  static readonly Get: ContractFrequencyServiceGet;
  static readonly BatchGet: ContractFrequencyServiceBatchGet;
  static readonly List: ContractFrequencyServiceList;
  static readonly Update: ContractFrequencyServiceUpdate;
  static readonly Delete: ContractFrequencyServiceDelete;
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

export class ContractFrequencyServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: contract_frequency_pb.ContractFrequency,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: contract_frequency_pb.ContractFrequency|null) => void
  ): UnaryResponse;
  create(
    requestMessage: contract_frequency_pb.ContractFrequency,
    callback: (error: ServiceError|null, responseMessage: contract_frequency_pb.ContractFrequency|null) => void
  ): UnaryResponse;
  get(
    requestMessage: contract_frequency_pb.ContractFrequency,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: contract_frequency_pb.ContractFrequency|null) => void
  ): UnaryResponse;
  get(
    requestMessage: contract_frequency_pb.ContractFrequency,
    callback: (error: ServiceError|null, responseMessage: contract_frequency_pb.ContractFrequency|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: contract_frequency_pb.ContractFrequency,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: contract_frequency_pb.ContractFrequencyList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: contract_frequency_pb.ContractFrequency,
    callback: (error: ServiceError|null, responseMessage: contract_frequency_pb.ContractFrequencyList|null) => void
  ): UnaryResponse;
  list(requestMessage: contract_frequency_pb.ContractFrequency, metadata?: grpc.Metadata): ResponseStream<contract_frequency_pb.ContractFrequency>;
  update(
    requestMessage: contract_frequency_pb.ContractFrequency,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: contract_frequency_pb.ContractFrequency|null) => void
  ): UnaryResponse;
  update(
    requestMessage: contract_frequency_pb.ContractFrequency,
    callback: (error: ServiceError|null, responseMessage: contract_frequency_pb.ContractFrequency|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: contract_frequency_pb.ContractFrequency,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: contract_frequency_pb.ContractFrequency|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: contract_frequency_pb.ContractFrequency,
    callback: (error: ServiceError|null, responseMessage: contract_frequency_pb.ContractFrequency|null) => void
  ): UnaryResponse;
}

