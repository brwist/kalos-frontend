import { grpc } from '@improbable-eng/grpc-web';
import { JobTypeService } from '../compiled-protos/job_type_pb_service';
import { JobType, JobTypeList } from '../compiled-protos/job_type_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class JobTypeClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Get(req: JobType) {
    return new Promise<JobType>((resolve, reject) => {
      const opts: UnaryRpcOptions<JobType, JobType> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(JobTypeService.Get, opts);
    });
  }

  public async List(req: JobType, cb: (arg: JobType) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<JobType, JobType> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: JobType) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(JobTypeService.List, opts);
    });
  }

  public async BatchGet(req: JobType) {
    return new Promise<JobTypeList>((resolve, reject) => {
      const opts: UnaryRpcOptions<JobType, JobTypeList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<JobTypeList>) => {
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
      grpc.unary(JobTypeService.BatchGet, opts);
    });
  }

  /**
   * loadJobTypes is a convenient wrapper for fetching all job types
   * @returns JobType[]
   */
  public async loadJobTypes() {
    const res = await this.BatchGet(new JobType());
    return res.getResultsList();
  }
}

export { JobType, JobTypeList, JobTypeClient };
