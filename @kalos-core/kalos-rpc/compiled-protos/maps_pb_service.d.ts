// package: 
// file: maps.proto

import * as maps_pb from "./maps_pb";
import {grpc} from "@improbable-eng/grpc-web";

type MapServiceGeocode = {
  readonly methodName: string;
  readonly service: typeof MapService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof maps_pb.Place;
  readonly responseType: typeof maps_pb.Coordinates;
};

export class MapService {
  static readonly serviceName: string;
  static readonly Geocode: MapServiceGeocode;
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
    requestMessage: maps_pb.Place,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: maps_pb.Coordinates|null) => void
  ): UnaryResponse;
  geocode(
    requestMessage: maps_pb.Place,
    callback: (error: ServiceError|null, responseMessage: maps_pb.Coordinates|null) => void
  ): UnaryResponse;
}

