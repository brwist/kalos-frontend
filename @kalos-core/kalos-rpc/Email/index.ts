import { grpc } from '@improbable-eng/grpc-web';
import { EmailService } from '../compiled-protos/email_pb_service';
import {
  InvoiceBodyRequest,
  SQSEmail,
  SQSEmailAndDocument,
} from '../compiled-protos/email_pb';
import { Document } from '../compiled-protos/document_pb';
import {
  UnaryOutput,
  UnaryRpcOptions,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { BaseClient } from '../BaseClient';
import { Bool, String } from '../compiled-protos/common_pb';

type EmailConfig = {
  type?: 'receipts' | 'it' | 'office' | 'invoice' | 'timeoff';
  recipient: string;
  body: string;
  subject: string;
  from?: string;
};

class EmailClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async sendMail(config: EmailConfig) {
    const req = new SQSEmail();
    req.setBody(config.body);
    req.setSubject(config.subject);
    req.setTo(config.recipient);
    return await this.SendSQSMail(req);
  }

  public async SendSQSMail(req: SQSEmail) {
    return new Promise<Bool>((resolve, reject) => {
      const opts: UnaryRpcOptions<SQSEmail, Bool> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(EmailService.SendSQS, opts);
    });
  }

  public async SendSQSInvoiceMail(req: SQSEmailAndDocument) {
    return new Promise<Bool>((resolve, reject) => {
      const opts: UnaryRpcOptions<SQSEmailAndDocument, Bool> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(EmailService.SendSQSInvoiceEmail, opts);
    });
  }

  public async GetInvoiceBody(req: InvoiceBodyRequest) {
    return new Promise<String>((resolve, reject) => {
      const opts: UnaryRpcOptions<InvoiceBodyRequest, String> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(EmailService.GetInvoiceBody, opts);
    });
  }

  public async SendSQSInvoiceEmail(req: SQSEmailAndDocument) {
    return new Promise<Bool>((resolve, reject) => {
      const opts: UnaryRpcOptions<SQSEmailAndDocument, Bool> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(EmailService.SendSQSInvoiceEmail, opts);
    });
  }
}

export { EmailConfig, EmailClient, SQSEmail };
