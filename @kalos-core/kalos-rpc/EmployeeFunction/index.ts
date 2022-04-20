import { grpc } from '@improbable-eng/grpc-web';
import { EmployeeFunctionService } from '../compiled-protos/employee_function_pb_service';
import {
  EmployeeFunction,
  EmployeeFunctionList,
} from '../compiled-protos/employee_function_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class EmployeeFunctionClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: EmployeeFunction) {
    return new Promise<EmployeeFunction>((resolve, reject) => {
      const opts: UnaryRpcOptions<EmployeeFunction, EmployeeFunction> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(EmployeeFunctionService.Create, opts);
    });
  }

  public async Get(req: EmployeeFunction) {
    return new Promise<EmployeeFunction>((resolve, reject) => {
      const opts: UnaryRpcOptions<EmployeeFunction, EmployeeFunction> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(EmployeeFunctionService.Get, opts);
    });
  }

  public async List(
    req: EmployeeFunction,
    cb: (arg: EmployeeFunction) => void
  ) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<EmployeeFunction, EmployeeFunction> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: EmployeeFunction) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(EmployeeFunctionService.List, opts);
    });
  }

  public async Update(req: EmployeeFunction) {
    return new Promise<EmployeeFunction>((resolve, reject) => {
      const opts: UnaryRpcOptions<EmployeeFunction, EmployeeFunction> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(EmployeeFunctionService.Update, opts);
    });
  }

  public async Delete(req: EmployeeFunction) {
    return new Promise<EmployeeFunction>((resolve, reject) => {
      const opts: UnaryRpcOptions<EmployeeFunction, EmployeeFunction> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(EmployeeFunctionService.Delete, opts);
    });
  }

  public async BatchGet(req: EmployeeFunction) {
    return new Promise<EmployeeFunctionList>((resolve, reject) => {
      const opts: UnaryRpcOptions<EmployeeFunction, EmployeeFunctionList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<EmployeeFunctionList>) => {
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
      grpc.unary(EmployeeFunctionService.BatchGet, opts);
    });
  }

  public deleteEmployeeFunctionById = async (id: number) => {
    const req = new EmployeeFunction();
    req.setId(id);
    await this.Delete(req);
  };

  public loadEmployeeFunctions = async () => {
    const req = new EmployeeFunction();
    req.setIsdeleted(0);
    const data = await this.BatchGet(req);
    return data.getResultsList().sort((a, b) => {
      const A = a.getName().toLowerCase();
      const B = b.getName().toLowerCase();
      if (A < B) return -1;
      if (A > B) return 1;
      return 0;
    });
  };

  public upsertEmployeeFunction = async (
    data: EmployeeFunction,
    userId: number
  ) => {
    return await this[data.getId() ? 'Update' : 'Create'](data);
  };
}

export { EmployeeFunction, EmployeeFunctionList, EmployeeFunctionClient };
