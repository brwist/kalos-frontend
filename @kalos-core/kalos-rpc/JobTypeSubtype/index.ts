import { grpc } from '@improbable-eng/grpc-web';
import { JobTypeSubtypeService } from '../compiled-protos/job_type_subtype_pb_service';
import {
  JobTypeSubtype,
  JobTypeSubtypeList,
} from '../compiled-protos/job_type_subtype_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class JobTypeSubtypeClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: JobTypeSubtype) {
    return new Promise<JobTypeSubtype>((resolve, reject) => {
      const opts: UnaryRpcOptions<JobTypeSubtype, JobTypeSubtype> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(JobTypeSubtypeService.Create, opts);
    });
  }

  public async Get(req: JobTypeSubtype) {
    return new Promise<JobTypeSubtype>((resolve, reject) => {
      const opts: UnaryRpcOptions<JobTypeSubtype, JobTypeSubtype> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(JobTypeSubtypeService.Get, opts);
    });
  }

  public async List(req: JobTypeSubtype, cb: (arg: JobTypeSubtype) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<JobTypeSubtype, JobTypeSubtype> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: JobTypeSubtype) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(JobTypeSubtypeService.List, opts);
    });
  }

  public async Update(req: JobTypeSubtype) {
    return new Promise<JobTypeSubtype>((resolve, reject) => {
      const opts: UnaryRpcOptions<JobTypeSubtype, JobTypeSubtype> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(JobTypeSubtypeService.Update, opts);
    });
  }

  public async Delete(req: JobTypeSubtype) {
    return new Promise<JobTypeSubtype>((resolve, reject) => {
      const opts: UnaryRpcOptions<JobTypeSubtype, JobTypeSubtype> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(JobTypeSubtypeService.Delete, opts);
    });
  }

  public async BatchGet(req: JobTypeSubtype) {
    return new Promise<JobTypeSubtypeList>((resolve, reject) => {
      const opts: UnaryRpcOptions<JobTypeSubtype, JobTypeSubtypeList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<JobTypeSubtypeList>) => {
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
      grpc.unary(JobTypeSubtypeService.BatchGet, opts);
    });
  }

  /**
   * Returns loaded JobTypeSubtypes
   * @returns JobTypeSubtype[]
   */
  public async loadJobTypeSubtypes() {
    const req = new JobTypeSubtype();
    req.setWithoutLimit(true);
    const res = await this.BatchGet(req);
    return res.getResultsList();
  }
}

export { JobTypeSubtype, JobTypeSubtypeList, JobTypeSubtypeClient };
