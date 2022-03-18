import { grpc } from '@improbable-eng/grpc-web';
import { ReportService } from '../compiled-protos/reports_pb_service';
import {
  SpiffReport,
  SpiffReportLine,
  PromptPaymentReport,
  PromptPaymentReportLine,
  TransactionReportLine,
  TransactionDumpReport,
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
}
export {
  SpiffReport,
  SpiffReportLine,
  PromptPaymentReport,
  PromptPaymentReportLine,
  TransactionDumpReport,
  TransactionReportLine,
  ReportClient,
};
