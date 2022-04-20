import { grpc } from '@improbable-eng/grpc-web';
import { ContractFrequencyService } from '../compiled-protos/contract_frequency_pb_service';
import {
  ContractFrequency,
  ContractFrequencyList,
} from '../compiled-protos/contract_frequency_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class ContractFrequencyClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: ContractFrequency) {
    return new Promise<ContractFrequency>((resolve, reject) => {
      const opts: UnaryRpcOptions<ContractFrequency, ContractFrequency> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ContractFrequencyService.Create, opts);
    });
  }

  public async Get(req: ContractFrequency) {
    return new Promise<ContractFrequency>((resolve, reject) => {
      const opts: UnaryRpcOptions<ContractFrequency, ContractFrequency> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ContractFrequencyService.Get, opts);
    });
  }

  public async List(
    req: ContractFrequency,
    cb: (arg: ContractFrequency) => void
  ) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<ContractFrequency, ContractFrequency> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: ContractFrequency) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(ContractFrequencyService.List, opts);
    });
  }

  public async Update(req: ContractFrequency) {
    return new Promise<ContractFrequency>((resolve, reject) => {
      const opts: UnaryRpcOptions<ContractFrequency, ContractFrequency> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ContractFrequencyService.Update, opts);
    });
  }

  public async Delete(req: ContractFrequency) {
    return new Promise<ContractFrequency>((resolve, reject) => {
      const opts: UnaryRpcOptions<ContractFrequency, ContractFrequency> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ContractFrequencyService.Delete, opts);
    });
  }

  public async BatchGet(req: ContractFrequency) {
    return new Promise<ContractFrequencyList>((resolve, reject) => {
      const opts: UnaryRpcOptions<ContractFrequency, ContractFrequencyList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<ContractFrequencyList>) => {
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
      grpc.unary(ContractFrequencyService.BatchGet, opts);
    });
  }
}

export { ContractFrequency, ContractFrequencyList, ContractFrequencyClient };
