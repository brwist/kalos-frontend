// package: 
// file: predict.proto

import * as predict_pb from "./predict_pb";
import {grpc} from "@improbable-eng/grpc-web";

type PredictServicePredictCostCenter = {
  readonly methodName: string;
  readonly service: typeof PredictService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof predict_pb.TransactionData;
  readonly responseType: typeof predict_pb.Prediction;
};

export class PredictService {
  static readonly serviceName: string;
  static readonly PredictCostCenter: PredictServicePredictCostCenter;
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

export class PredictServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  predictCostCenter(
    requestMessage: predict_pb.TransactionData,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: predict_pb.Prediction|null) => void
  ): UnaryResponse;
  predictCostCenter(
    requestMessage: predict_pb.TransactionData,
    callback: (error: ServiceError|null, responseMessage: predict_pb.Prediction|null) => void
  ): UnaryResponse;
}

