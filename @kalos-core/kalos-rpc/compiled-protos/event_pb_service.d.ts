// package: 
// file: event.proto

import * as event_pb from "./event_pb";
import * as common_pb from "./common_pb";
import * as task_pb from "./task_pb";
import {grpc} from "@improbable-eng/grpc-web";

type EventServiceCreate = {
  readonly methodName: string;
  readonly service: typeof EventService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof event_pb.Event;
  readonly responseType: typeof event_pb.Event;
};

type EventServiceGet = {
  readonly methodName: string;
  readonly service: typeof EventService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof event_pb.Event;
  readonly responseType: typeof event_pb.Event;
};

type EventServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof EventService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof event_pb.Event;
  readonly responseType: typeof event_pb.EventList;
};

type EventServiceList = {
  readonly methodName: string;
  readonly service: typeof EventService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof event_pb.Event;
  readonly responseType: typeof event_pb.Event;
};

type EventServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof EventService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof event_pb.Event;
  readonly responseType: typeof event_pb.Event;
};

type EventServiceDelete = {
  readonly methodName: string;
  readonly service: typeof EventService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof event_pb.Event;
  readonly responseType: typeof event_pb.Event;
};

type EventServiceGetCalendarData = {
  readonly methodName: string;
  readonly service: typeof EventService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof event_pb.Event;
  readonly responseType: typeof event_pb.CalendarData;
};

type EventServiceWriteQuote = {
  readonly methodName: string;
  readonly service: typeof EventService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof event_pb.Quotable;
  readonly responseType: typeof event_pb.Quotable;
};

type EventServiceReadQuotes = {
  readonly methodName: string;
  readonly service: typeof EventService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof event_pb.QuotableRead;
  readonly responseType: typeof event_pb.QuotableList;
};

type EventServiceGetProjectTasks = {
  readonly methodName: string;
  readonly service: typeof EventService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_pb.ProjectTask;
  readonly responseType: typeof task_pb.ProjectTaskList;
};

type EventServiceGetLaborHoursByEventID = {
  readonly methodName: string;
  readonly service: typeof EventService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof common_pb.Int32;
  readonly responseType: typeof common_pb.Double;
};

type EventServiceBatchGetCostReportData = {
  readonly methodName: string;
  readonly service: typeof EventService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof event_pb.CostReportReq;
  readonly responseType: typeof event_pb.CostReportData;
};

export class EventService {
  static readonly serviceName: string;
  static readonly Create: EventServiceCreate;
  static readonly Get: EventServiceGet;
  static readonly BatchGet: EventServiceBatchGet;
  static readonly List: EventServiceList;
  static readonly Update: EventServiceUpdate;
  static readonly Delete: EventServiceDelete;
  static readonly GetCalendarData: EventServiceGetCalendarData;
  static readonly WriteQuote: EventServiceWriteQuote;
  static readonly ReadQuotes: EventServiceReadQuotes;
  static readonly GetProjectTasks: EventServiceGetProjectTasks;
  static readonly GetLaborHoursByEventID: EventServiceGetLaborHoursByEventID;
  static readonly BatchGetCostReportData: EventServiceBatchGetCostReportData;
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

export class EventServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: event_pb.Event,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: event_pb.Event|null) => void
  ): UnaryResponse;
  create(
    requestMessage: event_pb.Event,
    callback: (error: ServiceError|null, responseMessage: event_pb.Event|null) => void
  ): UnaryResponse;
  get(
    requestMessage: event_pb.Event,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: event_pb.Event|null) => void
  ): UnaryResponse;
  get(
    requestMessage: event_pb.Event,
    callback: (error: ServiceError|null, responseMessage: event_pb.Event|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: event_pb.Event,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: event_pb.EventList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: event_pb.Event,
    callback: (error: ServiceError|null, responseMessage: event_pb.EventList|null) => void
  ): UnaryResponse;
  list(requestMessage: event_pb.Event, metadata?: grpc.Metadata): ResponseStream<event_pb.Event>;
  update(
    requestMessage: event_pb.Event,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: event_pb.Event|null) => void
  ): UnaryResponse;
  update(
    requestMessage: event_pb.Event,
    callback: (error: ServiceError|null, responseMessage: event_pb.Event|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: event_pb.Event,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: event_pb.Event|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: event_pb.Event,
    callback: (error: ServiceError|null, responseMessage: event_pb.Event|null) => void
  ): UnaryResponse;
  getCalendarData(
    requestMessage: event_pb.Event,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: event_pb.CalendarData|null) => void
  ): UnaryResponse;
  getCalendarData(
    requestMessage: event_pb.Event,
    callback: (error: ServiceError|null, responseMessage: event_pb.CalendarData|null) => void
  ): UnaryResponse;
  writeQuote(
    requestMessage: event_pb.Quotable,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: event_pb.Quotable|null) => void
  ): UnaryResponse;
  writeQuote(
    requestMessage: event_pb.Quotable,
    callback: (error: ServiceError|null, responseMessage: event_pb.Quotable|null) => void
  ): UnaryResponse;
  readQuotes(
    requestMessage: event_pb.QuotableRead,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: event_pb.QuotableList|null) => void
  ): UnaryResponse;
  readQuotes(
    requestMessage: event_pb.QuotableRead,
    callback: (error: ServiceError|null, responseMessage: event_pb.QuotableList|null) => void
  ): UnaryResponse;
  getProjectTasks(
    requestMessage: task_pb.ProjectTask,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_pb.ProjectTaskList|null) => void
  ): UnaryResponse;
  getProjectTasks(
    requestMessage: task_pb.ProjectTask,
    callback: (error: ServiceError|null, responseMessage: task_pb.ProjectTaskList|null) => void
  ): UnaryResponse;
  getLaborHoursByEventID(
    requestMessage: common_pb.Int32,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Double|null) => void
  ): UnaryResponse;
  getLaborHoursByEventID(
    requestMessage: common_pb.Int32,
    callback: (error: ServiceError|null, responseMessage: common_pb.Double|null) => void
  ): UnaryResponse;
  batchGetCostReportData(
    requestMessage: event_pb.CostReportReq,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: event_pb.CostReportData|null) => void
  ): UnaryResponse;
  batchGetCostReportData(
    requestMessage: event_pb.CostReportReq,
    callback: (error: ServiceError|null, responseMessage: event_pb.CostReportData|null) => void
  ): UnaryResponse;
}

