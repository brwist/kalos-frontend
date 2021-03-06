import { grpc } from '@improbable-eng/grpc-web';
import { ReportService } from '../compiled-protos/reports_pb_service';
import {
  SpiffReport,
  SpiffReportLine,
  PromptPaymentReport,
  PromptPaymentReportLine,
  TransactionReportLine,
  TransactionDumpReport,
  TimeoffReportLine,
  TimeoffReportRequest,
  TimeoffReport,
  ReceiptJournalReportLine,
  ReceiptJournalReport,
} from '../compiled-protos/reports_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { BaseClient } from '../BaseClient';

class ReportClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async GetPromptPaymentData(req: PromptPaymentReportLine) {
    return new Promise<PromptPaymentReport>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        PromptPaymentReportLine,
        PromptPaymentReport
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<PromptPaymentReport>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(ReportService.GetPromptPaymentData, opts);
    });
  }

  public async GetSpiffReportData(req: SpiffReportLine) {
    return new Promise<SpiffReport>((resolve, reject) => {
      const opts: UnaryRpcOptions<SpiffReportLine, SpiffReport> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<SpiffReport>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(ReportService.GetSpiffReportData, opts);
    });
  }

  public async GetTransactionDumpData(req: TransactionReportLine) {
    return new Promise<TransactionDumpReport>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        TransactionReportLine,
        TransactionDumpReport
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TransactionDumpReport>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(ReportService.GetTransactionDumpData, opts);
    });
  }

  public async GetTimeOffReport(req: TimeoffReportRequest) {
    return new Promise<TimeoffReport>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimeoffReportRequest, TimeoffReport> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TimeoffReport>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(ReportService.GetTimeoffReportData, opts);
    });
  }

  public async GetReceiptJournalReport(req: ReceiptJournalReportLine) {
    return new Promise<ReceiptJournalReport>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        ReceiptJournalReportLine,
        ReceiptJournalReport
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<ReceiptJournalReport>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(ReportService.GetReceiptJournalReport, opts);
    });
  }
}
export {
  SpiffReport,
  SpiffReportLine,
  PromptPaymentReport,
  PromptPaymentReportLine,
  TransactionDumpReport,
  TimeoffReport,
  TimeoffReportRequest,
  TimeoffReportLine,
  TransactionReportLine,
  ReportClient,
  ReceiptJournalReport,
  ReceiptJournalReportLine,
};
