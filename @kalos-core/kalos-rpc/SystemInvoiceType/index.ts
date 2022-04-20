import { grpc } from '@improbable-eng/grpc-web';
import { SystemInvoiceTypeService } from '../compiled-protos/system_invoice_type_pb_service';
import {
  SystemInvoiceType,
  SystemInvoiceTypeList,
} from '../compiled-protos/system_invoice_type_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class SystemInvoiceTypeClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: SystemInvoiceType) {
    return new Promise<SystemInvoiceType>((resolve, reject) => {
      const opts: UnaryRpcOptions<SystemInvoiceType, SystemInvoiceType> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SystemInvoiceTypeService.Create, opts);
    });
  }

  public async Get(req: SystemInvoiceType) {
    return new Promise<SystemInvoiceType>((resolve, reject) => {
      const opts: UnaryRpcOptions<SystemInvoiceType, SystemInvoiceType> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SystemInvoiceTypeService.Get, opts);
    });
  }

  public async List(
    req: SystemInvoiceType,
    cb: (arg: SystemInvoiceType) => void
  ) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<SystemInvoiceType, SystemInvoiceType> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: SystemInvoiceType) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(SystemInvoiceTypeService.List, opts);
    });
  }

  public async Update(req: SystemInvoiceType) {
    return new Promise<SystemInvoiceType>((resolve, reject) => {
      const opts: UnaryRpcOptions<SystemInvoiceType, SystemInvoiceType> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SystemInvoiceTypeService.Update, opts);
    });
  }

  public async Delete(req: SystemInvoiceType) {
    return new Promise<SystemInvoiceType>((resolve, reject) => {
      const opts: UnaryRpcOptions<SystemInvoiceType, SystemInvoiceType> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SystemInvoiceTypeService.Delete, opts);
    });
  }

  public async BatchGet(req: SystemInvoiceType) {
    return new Promise<SystemInvoiceTypeList>((resolve, reject) => {
      const opts: UnaryRpcOptions<SystemInvoiceType, SystemInvoiceTypeList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<SystemInvoiceTypeList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            if (
              result.statusMessage.toLowerCase() ===
              'response closed without headers'
            ) {
              return this.BatchGet(req);
            } else {
              reject(new Error(result.statusMessage));
            }
          }
        },
      };
      grpc.unary(SystemInvoiceTypeService.BatchGet, opts);
    });
  }
}

export { SystemInvoiceType, SystemInvoiceTypeList, SystemInvoiceTypeClient };
