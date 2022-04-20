// package: 
// file: metrics.proto

import * as metrics_pb from "./metrics_pb";
import {grpc} from "@improbable-eng/grpc-web";

type MetricsServiceGetBillable = {
  readonly methodName: string;
  readonly service: typeof MetricsService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof metrics_pb.Billable;
  readonly responseType: typeof metrics_pb.Billable;
};

type MetricsServiceListBillable = {
  readonly methodName: string;
  readonly service: typeof MetricsService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof metrics_pb.Billable;
  readonly responseType: typeof metrics_pb.Billable;
};

type MetricsServiceGetAvgTicket = {
  readonly methodName: string;
  readonly service: typeof MetricsService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof metrics_pb.AvgTicket;
  readonly responseType: typeof metrics_pb.AvgTicket;
};

type MetricsServiceListAvgTicket = {
  readonly methodName: string;
  readonly service: typeof MetricsService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof metrics_pb.AvgTicket;
  readonly responseType: typeof metrics_pb.AvgTicket;
};

type MetricsServiceGetCallbacks = {
  readonly methodName: string;
  readonly service: typeof MetricsService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof metrics_pb.Callbacks;
  readonly responseType: typeof metrics_pb.Callbacks;
};

type MetricsServiceListCallbacks = {
  readonly methodName: string;
  readonly service: typeof MetricsService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof metrics_pb.Callbacks;
  readonly responseType: typeof metrics_pb.Callbacks;
};

type MetricsServiceGetRevenue = {
  readonly methodName: string;
  readonly service: typeof MetricsService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof metrics_pb.Revenue;
  readonly responseType: typeof metrics_pb.Revenue;
};

type MetricsServiceListRevenue = {
  readonly methodName: string;
  readonly service: typeof MetricsService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof metrics_pb.Revenue;
  readonly responseType: typeof metrics_pb.Revenue;
};

type MetricsServiceBatchGetMetricReportData = {
  readonly methodName: string;
  readonly service: typeof MetricsService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof metrics_pb.MertricReportDataRequest;
  readonly responseType: typeof metrics_pb.MetricReportDataList;
};

export class MetricsService {
  static readonly serviceName: string;
  static readonly GetBillable: MetricsServiceGetBillable;
  static readonly ListBillable: MetricsServiceListBillable;
  static readonly GetAvgTicket: MetricsServiceGetAvgTicket;
  static readonly ListAvgTicket: MetricsServiceListAvgTicket;
  static readonly GetCallbacks: MetricsServiceGetCallbacks;
  static readonly ListCallbacks: MetricsServiceListCallbacks;
  static readonly GetRevenue: MetricsServiceGetRevenue;
  static readonly ListRevenue: MetricsServiceListRevenue;
  static readonly BatchGetMetricReportData: MetricsServiceBatchGetMetricReportData;
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

export class MetricsServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getBillable(
    requestMessage: metrics_pb.Billable,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: metrics_pb.Billable|null) => void
  ): UnaryResponse;
  getBillable(
    requestMessage: metrics_pb.Billable,
    callback: (error: ServiceError|null, responseMessage: metrics_pb.Billable|null) => void
  ): UnaryResponse;
  listBillable(requestMessage: metrics_pb.Billable, metadata?: grpc.Metadata): ResponseStream<metrics_pb.Billable>;
  getAvgTicket(
    requestMessage: metrics_pb.AvgTicket,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: metrics_pb.AvgTicket|null) => void
  ): UnaryResponse;
  getAvgTicket(
    requestMessage: metrics_pb.AvgTicket,
    callback: (error: ServiceError|null, responseMessage: metrics_pb.AvgTicket|null) => void
  ): UnaryResponse;
  listAvgTicket(requestMessage: metrics_pb.AvgTicket, metadata?: grpc.Metadata): ResponseStream<metrics_pb.AvgTicket>;
  getCallbacks(
    requestMessage: metrics_pb.Callbacks,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: metrics_pb.Callbacks|null) => void
  ): UnaryResponse;
  getCallbacks(
    requestMessage: metrics_pb.Callbacks,
    callback: (error: ServiceError|null, responseMessage: metrics_pb.Callbacks|null) => void
  ): UnaryResponse;
  listCallbacks(requestMessage: metrics_pb.Callbacks, metadata?: grpc.Metadata): ResponseStream<metrics_pb.Callbacks>;
  getRevenue(
    requestMessage: metrics_pb.Revenue,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: metrics_pb.Revenue|null) => void
  ): UnaryResponse;
  getRevenue(
    requestMessage: metrics_pb.Revenue,
    callback: (error: ServiceError|null, responseMessage: metrics_pb.Revenue|null) => void
  ): UnaryResponse;
  listRevenue(requestMessage: metrics_pb.Revenue, metadata?: grpc.Metadata): ResponseStream<metrics_pb.Revenue>;
  batchGetMetricReportData(
    requestMessage: metrics_pb.MertricReportDataRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: metrics_pb.MetricReportDataList|null) => void
  ): UnaryResponse;
  batchGetMetricReportData(
    requestMessage: metrics_pb.MertricReportDataRequest,
    callback: (error: ServiceError|null, responseMessage: metrics_pb.MetricReportDataList|null) => void
  ): UnaryResponse;
}

