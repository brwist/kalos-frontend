// package: 
// file: reports.proto

import * as reports_pb from "./reports_pb";
import {grpc} from "@improbable-eng/grpc-web";

type ReportServiceGetSpiffReportData = {
  readonly methodName: string;
  readonly service: typeof ReportService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof reports_pb.SpiffReportLine;
  readonly responseType: typeof reports_pb.SpiffReport;
};

type ReportServiceGetPromptPaymentData = {
  readonly methodName: string;
  readonly service: typeof ReportService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof reports_pb.PromptPaymentReportLine;
  readonly responseType: typeof reports_pb.PromptPaymentReport;
};

type ReportServiceGetTransactionDumpData = {
  readonly methodName: string;
  readonly service: typeof ReportService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof reports_pb.TransactionReportLine;
  readonly responseType: typeof reports_pb.TransactionDumpReport;
};

type ReportServiceGetTimeoffReportData = {
  readonly methodName: string;
  readonly service: typeof ReportService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof reports_pb.TimeoffReportRequest;
  readonly responseType: typeof reports_pb.TimeoffReport;
};

type ReportServiceGetReceiptJournalReport = {
  readonly methodName: string;
  readonly service: typeof ReportService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof reports_pb.ReceiptJournalReportLine;
  readonly responseType: typeof reports_pb.ReceiptJournalReport;
};

export class ReportService {
  static readonly serviceName: string;
  static readonly GetSpiffReportData: ReportServiceGetSpiffReportData;
  static readonly GetPromptPaymentData: ReportServiceGetPromptPaymentData;
  static readonly GetTransactionDumpData: ReportServiceGetTransactionDumpData;
  static readonly GetTimeoffReportData: ReportServiceGetTimeoffReportData;
  static readonly GetReceiptJournalReport: ReportServiceGetReceiptJournalReport;
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

export class ReportServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getSpiffReportData(
    requestMessage: reports_pb.SpiffReportLine,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: reports_pb.SpiffReport|null) => void
  ): UnaryResponse;
  getSpiffReportData(
    requestMessage: reports_pb.SpiffReportLine,
    callback: (error: ServiceError|null, responseMessage: reports_pb.SpiffReport|null) => void
  ): UnaryResponse;
  getPromptPaymentData(
    requestMessage: reports_pb.PromptPaymentReportLine,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: reports_pb.PromptPaymentReport|null) => void
  ): UnaryResponse;
  getPromptPaymentData(
    requestMessage: reports_pb.PromptPaymentReportLine,
    callback: (error: ServiceError|null, responseMessage: reports_pb.PromptPaymentReport|null) => void
  ): UnaryResponse;
  getTransactionDumpData(
    requestMessage: reports_pb.TransactionReportLine,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: reports_pb.TransactionDumpReport|null) => void
  ): UnaryResponse;
  getTransactionDumpData(
    requestMessage: reports_pb.TransactionReportLine,
    callback: (error: ServiceError|null, responseMessage: reports_pb.TransactionDumpReport|null) => void
  ): UnaryResponse;
  getTimeoffReportData(
    requestMessage: reports_pb.TimeoffReportRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: reports_pb.TimeoffReport|null) => void
  ): UnaryResponse;
  getTimeoffReportData(
    requestMessage: reports_pb.TimeoffReportRequest,
    callback: (error: ServiceError|null, responseMessage: reports_pb.TimeoffReport|null) => void
  ): UnaryResponse;
  getReceiptJournalReport(
    requestMessage: reports_pb.ReceiptJournalReportLine,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: reports_pb.ReceiptJournalReport|null) => void
  ): UnaryResponse;
  getReceiptJournalReport(
    requestMessage: reports_pb.ReceiptJournalReportLine,
    callback: (error: ServiceError|null, responseMessage: reports_pb.ReceiptJournalReport|null) => void
  ): UnaryResponse;
}

