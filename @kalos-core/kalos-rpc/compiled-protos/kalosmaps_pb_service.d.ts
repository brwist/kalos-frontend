// package: 
// file: kalosmaps.proto

import * as kalosmaps_pb from "./kalosmaps_pb";
import * as common_pb from "./common_pb";
import {grpc} from "@improbable-eng/grpc-web";

type MapServiceGeocode = {
  readonly methodName: string;
  readonly service: typeof MapService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kalosmaps_pb.Place;
  readonly responseType: typeof kalosmaps_pb.Coordinates;
};

type MapServiceDistanceMatrix = {
  readonly methodName: string;
  readonly service: typeof MapService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kalosmaps_pb.MatrixRequest;
  readonly responseType: typeof kalosmaps_pb.DistanceMatrixResponse;
};

type MapServiceElevation = {
  readonly methodName: string;
  readonly service: typeof MapService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kalosmaps_pb.Coordinates;
  readonly responseType: typeof common_pb.Double;
};

export class MapService {
  static readonly serviceName: string;
  static readonly Geocode: MapServiceGeocode;
  static readonly DistanceMatrix: MapServiceDistanceMatrix;
  static readonly Elevation: MapServiceElevation;
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

export class MapServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  geocode(
    requestMessage: kalosmaps_pb.Place,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: kalosmaps_pb.Coordinates|null) => void
  ): UnaryResponse;
  geocode(
    requestMessage: kalosmaps_pb.Place,
    callback: (error: ServiceError|null, responseMessage: kalosmaps_pb.Coordinates|null) => void
  ): UnaryResponse;
  distanceMatrix(
    requestMessage: kalosmaps_pb.MatrixRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: kalosmaps_pb.DistanceMatrixResponse|null) => void
  ): UnaryResponse;
  distanceMatrix(
    requestMessage: kalosmaps_pb.MatrixRequest,
    callback: (error: ServiceError|null, responseMessage: kalosmaps_pb.DistanceMatrixResponse|null) => void
  ): UnaryResponse;
  elevation(
    requestMessage: kalosmaps_pb.Coordinates,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Double|null) => void
  ): UnaryResponse;
  elevation(
    requestMessage: kalosmaps_pb.Coordinates,
    callback: (error: ServiceError|null, responseMessage: common_pb.Double|null) => void
  ): UnaryResponse;
}

