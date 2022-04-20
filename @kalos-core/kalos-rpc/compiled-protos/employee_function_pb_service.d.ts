// package: 
// file: employee_function.proto

import * as employee_function_pb from "./employee_function_pb";
import {grpc} from "@improbable-eng/grpc-web";

type EmployeeFunctionServiceCreate = {
  readonly methodName: string;
  readonly service: typeof EmployeeFunctionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof employee_function_pb.EmployeeFunction;
  readonly responseType: typeof employee_function_pb.EmployeeFunction;
};

type EmployeeFunctionServiceGet = {
  readonly methodName: string;
  readonly service: typeof EmployeeFunctionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof employee_function_pb.EmployeeFunction;
  readonly responseType: typeof employee_function_pb.EmployeeFunction;
};

type EmployeeFunctionServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof EmployeeFunctionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof employee_function_pb.EmployeeFunction;
  readonly responseType: typeof employee_function_pb.EmployeeFunctionList;
};

type EmployeeFunctionServiceList = {
  readonly methodName: string;
  readonly service: typeof EmployeeFunctionService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof employee_function_pb.EmployeeFunction;
  readonly responseType: typeof employee_function_pb.EmployeeFunction;
};

type EmployeeFunctionServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof EmployeeFunctionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof employee_function_pb.EmployeeFunction;
  readonly responseType: typeof employee_function_pb.EmployeeFunction;
};

type EmployeeFunctionServiceDelete = {
  readonly methodName: string;
  readonly service: typeof EmployeeFunctionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof employee_function_pb.EmployeeFunction;
  readonly responseType: typeof employee_function_pb.EmployeeFunction;
};

export class EmployeeFunctionService {
  static readonly serviceName: string;
  static readonly Create: EmployeeFunctionServiceCreate;
  static readonly Get: EmployeeFunctionServiceGet;
  static readonly BatchGet: EmployeeFunctionServiceBatchGet;
  static readonly List: EmployeeFunctionServiceList;
  static readonly Update: EmployeeFunctionServiceUpdate;
  static readonly Delete: EmployeeFunctionServiceDelete;
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

export class EmployeeFunctionServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: employee_function_pb.EmployeeFunction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: employee_function_pb.EmployeeFunction|null) => void
  ): UnaryResponse;
  create(
    requestMessage: employee_function_pb.EmployeeFunction,
    callback: (error: ServiceError|null, responseMessage: employee_function_pb.EmployeeFunction|null) => void
  ): UnaryResponse;
  get(
    requestMessage: employee_function_pb.EmployeeFunction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: employee_function_pb.EmployeeFunction|null) => void
  ): UnaryResponse;
  get(
    requestMessage: employee_function_pb.EmployeeFunction,
    callback: (error: ServiceError|null, responseMessage: employee_function_pb.EmployeeFunction|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: employee_function_pb.EmployeeFunction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: employee_function_pb.EmployeeFunctionList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: employee_function_pb.EmployeeFunction,
    callback: (error: ServiceError|null, responseMessage: employee_function_pb.EmployeeFunctionList|null) => void
  ): UnaryResponse;
  list(requestMessage: employee_function_pb.EmployeeFunction, metadata?: grpc.Metadata): ResponseStream<employee_function_pb.EmployeeFunction>;
  update(
    requestMessage: employee_function_pb.EmployeeFunction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: employee_function_pb.EmployeeFunction|null) => void
  ): UnaryResponse;
  update(
    requestMessage: employee_function_pb.EmployeeFunction,
    callback: (error: ServiceError|null, responseMessage: employee_function_pb.EmployeeFunction|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: employee_function_pb.EmployeeFunction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: employee_function_pb.EmployeeFunction|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: employee_function_pb.EmployeeFunction,
    callback: (error: ServiceError|null, responseMessage: employee_function_pb.EmployeeFunction|null) => void
  ): UnaryResponse;
}

