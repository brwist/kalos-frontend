// package: 
// file: perdiem.proto

import * as perdiem_pb from "./perdiem_pb";
import * as common_pb from "./common_pb";
import {grpc} from "@improbable-eng/grpc-web";

type PerDiemServiceCreate = {
  readonly methodName: string;
  readonly service: typeof PerDiemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof perdiem_pb.PerDiem;
  readonly responseType: typeof perdiem_pb.PerDiem;
};

type PerDiemServiceGet = {
  readonly methodName: string;
  readonly service: typeof PerDiemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof perdiem_pb.PerDiem;
  readonly responseType: typeof perdiem_pb.PerDiem;
};

type PerDiemServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof PerDiemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof perdiem_pb.PerDiem;
  readonly responseType: typeof perdiem_pb.PerDiemList;
};

type PerDiemServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof PerDiemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof perdiem_pb.PerDiem;
  readonly responseType: typeof perdiem_pb.PerDiem;
};

type PerDiemServiceDelete = {
  readonly methodName: string;
  readonly service: typeof PerDiemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof perdiem_pb.PerDiem;
  readonly responseType: typeof perdiem_pb.PerDiem;
};

type PerDiemServiceCreateRow = {
  readonly methodName: string;
  readonly service: typeof PerDiemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof perdiem_pb.PerDiemRow;
  readonly responseType: typeof perdiem_pb.PerDiemRow;
};

type PerDiemServiceUpdateRow = {
  readonly methodName: string;
  readonly service: typeof PerDiemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof perdiem_pb.PerDiemRow;
  readonly responseType: typeof perdiem_pb.PerDiemRow;
};

type PerDiemServiceGetRow = {
  readonly methodName: string;
  readonly service: typeof PerDiemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof perdiem_pb.PerDiemRow;
  readonly responseType: typeof perdiem_pb.PerDiemRow;
};

type PerDiemServiceDeleteRow = {
  readonly methodName: string;
  readonly service: typeof PerDiemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof perdiem_pb.PerDiemRow;
  readonly responseType: typeof common_pb.Empty;
};

type PerDiemServiceGetPerDiemReport = {
  readonly methodName: string;
  readonly service: typeof PerDiemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof perdiem_pb.PerDiemReportRequest;
  readonly responseType: typeof perdiem_pb.PerDiemList;
};

type PerDiemServiceCreateTrip = {
  readonly methodName: string;
  readonly service: typeof PerDiemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof perdiem_pb.Trip;
  readonly responseType: typeof perdiem_pb.Trip;
};

type PerDiemServiceUpdateTrip = {
  readonly methodName: string;
  readonly service: typeof PerDiemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof perdiem_pb.Trip;
  readonly responseType: typeof perdiem_pb.Trip;
};

type PerDiemServiceGetTrip = {
  readonly methodName: string;
  readonly service: typeof PerDiemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof perdiem_pb.Trip;
  readonly responseType: typeof perdiem_pb.Trip;
};

type PerDiemServiceDeleteTrip = {
  readonly methodName: string;
  readonly service: typeof PerDiemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof perdiem_pb.Trip;
  readonly responseType: typeof common_pb.Empty;
};

type PerDiemServiceBatchGetTrips = {
  readonly methodName: string;
  readonly service: typeof PerDiemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof perdiem_pb.Trip;
  readonly responseType: typeof perdiem_pb.TripList;
};

type PerDiemServiceGetTotalRowTripDistance = {
  readonly methodName: string;
  readonly service: typeof PerDiemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof common_pb.Int32;
  readonly responseType: typeof common_pb.Double;
};

type PerDiemServiceBatchDeleteTrips = {
  readonly methodName: string;
  readonly service: typeof PerDiemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof perdiem_pb.Trip;
  readonly responseType: typeof perdiem_pb.Trip;
};

type PerDiemServiceBatchGetPerDiemsByIds = {
  readonly methodName: string;
  readonly service: typeof PerDiemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof common_pb.IntArray;
  readonly responseType: typeof perdiem_pb.PerDiemList;
};

type PerDiemServiceGetDebugSQLOutput = {
  readonly methodName: string;
  readonly service: typeof PerDiemService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof perdiem_pb.SQLRequest;
  readonly responseType: typeof common_pb.String;
};

export class PerDiemService {
  static readonly serviceName: string;
  static readonly Create: PerDiemServiceCreate;
  static readonly Get: PerDiemServiceGet;
  static readonly BatchGet: PerDiemServiceBatchGet;
  static readonly Update: PerDiemServiceUpdate;
  static readonly Delete: PerDiemServiceDelete;
  static readonly CreateRow: PerDiemServiceCreateRow;
  static readonly UpdateRow: PerDiemServiceUpdateRow;
  static readonly GetRow: PerDiemServiceGetRow;
  static readonly DeleteRow: PerDiemServiceDeleteRow;
  static readonly GetPerDiemReport: PerDiemServiceGetPerDiemReport;
  static readonly CreateTrip: PerDiemServiceCreateTrip;
  static readonly UpdateTrip: PerDiemServiceUpdateTrip;
  static readonly GetTrip: PerDiemServiceGetTrip;
  static readonly DeleteTrip: PerDiemServiceDeleteTrip;
  static readonly BatchGetTrips: PerDiemServiceBatchGetTrips;
  static readonly GetTotalRowTripDistance: PerDiemServiceGetTotalRowTripDistance;
  static readonly BatchDeleteTrips: PerDiemServiceBatchDeleteTrips;
  static readonly BatchGetPerDiemsByIds: PerDiemServiceBatchGetPerDiemsByIds;
  static readonly GetDebugSQLOutput: PerDiemServiceGetDebugSQLOutput;
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

export class PerDiemServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: perdiem_pb.PerDiem,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.PerDiem|null) => void
  ): UnaryResponse;
  create(
    requestMessage: perdiem_pb.PerDiem,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.PerDiem|null) => void
  ): UnaryResponse;
  get(
    requestMessage: perdiem_pb.PerDiem,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.PerDiem|null) => void
  ): UnaryResponse;
  get(
    requestMessage: perdiem_pb.PerDiem,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.PerDiem|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: perdiem_pb.PerDiem,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.PerDiemList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: perdiem_pb.PerDiem,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.PerDiemList|null) => void
  ): UnaryResponse;
  update(
    requestMessage: perdiem_pb.PerDiem,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.PerDiem|null) => void
  ): UnaryResponse;
  update(
    requestMessage: perdiem_pb.PerDiem,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.PerDiem|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: perdiem_pb.PerDiem,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.PerDiem|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: perdiem_pb.PerDiem,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.PerDiem|null) => void
  ): UnaryResponse;
  createRow(
    requestMessage: perdiem_pb.PerDiemRow,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.PerDiemRow|null) => void
  ): UnaryResponse;
  createRow(
    requestMessage: perdiem_pb.PerDiemRow,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.PerDiemRow|null) => void
  ): UnaryResponse;
  updateRow(
    requestMessage: perdiem_pb.PerDiemRow,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.PerDiemRow|null) => void
  ): UnaryResponse;
  updateRow(
    requestMessage: perdiem_pb.PerDiemRow,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.PerDiemRow|null) => void
  ): UnaryResponse;
  getRow(
    requestMessage: perdiem_pb.PerDiemRow,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.PerDiemRow|null) => void
  ): UnaryResponse;
  getRow(
    requestMessage: perdiem_pb.PerDiemRow,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.PerDiemRow|null) => void
  ): UnaryResponse;
  deleteRow(
    requestMessage: perdiem_pb.PerDiemRow,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  deleteRow(
    requestMessage: perdiem_pb.PerDiemRow,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  getPerDiemReport(
    requestMessage: perdiem_pb.PerDiemReportRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.PerDiemList|null) => void
  ): UnaryResponse;
  getPerDiemReport(
    requestMessage: perdiem_pb.PerDiemReportRequest,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.PerDiemList|null) => void
  ): UnaryResponse;
  createTrip(
    requestMessage: perdiem_pb.Trip,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.Trip|null) => void
  ): UnaryResponse;
  createTrip(
    requestMessage: perdiem_pb.Trip,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.Trip|null) => void
  ): UnaryResponse;
  updateTrip(
    requestMessage: perdiem_pb.Trip,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.Trip|null) => void
  ): UnaryResponse;
  updateTrip(
    requestMessage: perdiem_pb.Trip,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.Trip|null) => void
  ): UnaryResponse;
  getTrip(
    requestMessage: perdiem_pb.Trip,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.Trip|null) => void
  ): UnaryResponse;
  getTrip(
    requestMessage: perdiem_pb.Trip,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.Trip|null) => void
  ): UnaryResponse;
  deleteTrip(
    requestMessage: perdiem_pb.Trip,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  deleteTrip(
    requestMessage: perdiem_pb.Trip,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  batchGetTrips(
    requestMessage: perdiem_pb.Trip,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.TripList|null) => void
  ): UnaryResponse;
  batchGetTrips(
    requestMessage: perdiem_pb.Trip,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.TripList|null) => void
  ): UnaryResponse;
  getTotalRowTripDistance(
    requestMessage: common_pb.Int32,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Double|null) => void
  ): UnaryResponse;
  getTotalRowTripDistance(
    requestMessage: common_pb.Int32,
    callback: (error: ServiceError|null, responseMessage: common_pb.Double|null) => void
  ): UnaryResponse;
  batchDeleteTrips(
    requestMessage: perdiem_pb.Trip,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.Trip|null) => void
  ): UnaryResponse;
  batchDeleteTrips(
    requestMessage: perdiem_pb.Trip,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.Trip|null) => void
  ): UnaryResponse;
  batchGetPerDiemsByIds(
    requestMessage: common_pb.IntArray,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.PerDiemList|null) => void
  ): UnaryResponse;
  batchGetPerDiemsByIds(
    requestMessage: common_pb.IntArray,
    callback: (error: ServiceError|null, responseMessage: perdiem_pb.PerDiemList|null) => void
  ): UnaryResponse;
  getDebugSQLOutput(
    requestMessage: perdiem_pb.SQLRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.String|null) => void
  ): UnaryResponse;
  getDebugSQLOutput(
    requestMessage: perdiem_pb.SQLRequest,
    callback: (error: ServiceError|null, responseMessage: common_pb.String|null) => void
  ): UnaryResponse;
}

