import { grpc } from '@improbable-eng/grpc-web';
import { CallAssociationService } from '../compiled-protos/call_association_pb_service';
import {
  CallAssociation,
  CallAssociationList,
} from '../compiled-protos/call_association_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class CallAssociationClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: CallAssociation) {
    return new Promise<CallAssociation>((resolve, reject) => {
      const opts: UnaryRpcOptions<CallAssociation, CallAssociation> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(CallAssociationService.Create, opts);
    });
  }

  public async Get(req: CallAssociation) {
    return new Promise<CallAssociation>((resolve, reject) => {
      const opts: UnaryRpcOptions<CallAssociation, CallAssociation> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(CallAssociationService.Get, opts);
    });
  }

  public async List(req: CallAssociation, cb: (arg: CallAssociation) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<CallAssociation, CallAssociation> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: CallAssociation) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(CallAssociationService.List, opts);
    });
  }

  public async Update(req: CallAssociation) {
    return new Promise<CallAssociation>((resolve, reject) => {
      const opts: UnaryRpcOptions<CallAssociation, CallAssociation> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(CallAssociationService.Update, opts);
    });
  }

  public async Delete(req: CallAssociation) {
    return new Promise<CallAssociation>((resolve, reject) => {
      const opts: UnaryRpcOptions<CallAssociation, CallAssociation> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(CallAssociationService.Delete, opts);
    });
  }

  public async BatchGet(req: CallAssociation) {
    return new Promise<CallAssociationList>((resolve, reject) => {
      const opts: UnaryRpcOptions<CallAssociation, CallAssociationList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<CallAssociationList>) => {
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
      grpc.unary(CallAssociationService.BatchGet, opts);
    });
  }
}

export { CallAssociation, CallAssociationList, CallAssociationClient };
