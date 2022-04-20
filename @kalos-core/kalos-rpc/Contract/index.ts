import { grpc } from '@improbable-eng/grpc-web';
import { ContractService } from '../compiled-protos/contract_pb_service';
import { Contract, ContractList } from '../compiled-protos/contract_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class ContractClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: Contract) {
    return new Promise<Contract>((resolve, reject) => {
      const opts: UnaryRpcOptions<Contract, Contract> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ContractService.Create, opts);
    });
  }

  public async Get(req: Contract) {
    return new Promise<Contract>((resolve, reject) => {
      const opts: UnaryRpcOptions<Contract, Contract> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ContractService.Get, opts);
    });
  }

  public async List(req: Contract, cb: (arg: Contract) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<Contract, Contract> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: Contract) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(ContractService.List, opts);
    });
  }

  public async Update(req: Contract) {
    return new Promise<Contract>((resolve, reject) => {
      const opts: UnaryRpcOptions<Contract, Contract> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ContractService.Update, opts);
    });
  }

  public async Delete(req: Contract) {
    return new Promise<Contract>((resolve, reject) => {
      const opts: UnaryRpcOptions<Contract, Contract> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ContractService.Delete, opts);
    });
  }

  public async BatchGet(req: Contract) {
    return new Promise<ContractList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Contract, ContractList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<ContractList>) => {
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
      grpc.unary(ContractService.BatchGet, opts);
    });
  }
}

export { Contract, ContractList, ContractClient };
