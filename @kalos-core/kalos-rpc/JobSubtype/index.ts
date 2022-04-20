import { grpc } from '@improbable-eng/grpc-web';
import { JobSubtypeService } from '../compiled-protos/job_subtype_pb_service';
import { JobSubtype, JobSubtypeList } from '../compiled-protos/job_subtype_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class JobSubtypeClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Get(req: JobSubtype) {
    return new Promise<JobSubtype>((resolve, reject) => {
      const opts: UnaryRpcOptions<JobSubtype, JobSubtype> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(JobSubtypeService.Get, opts);
    });
  }

  public async List(req: JobSubtype, cb: (arg: JobSubtype) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<JobSubtype, JobSubtype> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: JobSubtype) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(JobSubtypeService.List, opts);
    });
  }

  public async BatchGet(req: JobSubtype) {
    return new Promise<JobSubtypeList>((resolve, reject) => {
      const opts: UnaryRpcOptions<JobSubtype, JobSubtypeList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<JobSubtypeList>) => {
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
      grpc.unary(JobSubtypeService.BatchGet, opts);
    });
  }

  /**
   * loadJobSubtypes is a convenient wrapper for fetching all jobSubTypes
   * @returns JobSubtype[]
   */
  public async loadJobSubtypes() {
    const res = await this.BatchGet(new JobSubtype());
    return res.getResultsList();
  }
}

export { JobSubtype, JobSubtypeList, JobSubtypeClient };
