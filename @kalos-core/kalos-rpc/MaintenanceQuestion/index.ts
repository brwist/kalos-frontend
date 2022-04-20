import { grpc } from '@improbable-eng/grpc-web';
import { MaintenanceQuestionService } from '../compiled-protos/maintenance_question_pb_service';
import {
  MaintenanceQuestion,
  MaintenanceQuestionList,
} from '../compiled-protos/maintenance_question_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class MaintenanceQuestionClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: MaintenanceQuestion) {
    return new Promise<MaintenanceQuestion>((resolve, reject) => {
      const opts: UnaryRpcOptions<MaintenanceQuestion, MaintenanceQuestion> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(MaintenanceQuestionService.Create, opts);
    });
  }

  public async Get(req: MaintenanceQuestion) {
    return new Promise<MaintenanceQuestion>((resolve, reject) => {
      const opts: UnaryRpcOptions<MaintenanceQuestion, MaintenanceQuestion> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(MaintenanceQuestionService.Get, opts);
    });
  }

  public async List(
    req: MaintenanceQuestion,
    cb: (arg: MaintenanceQuestion) => void
  ) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<MaintenanceQuestion, MaintenanceQuestion> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: MaintenanceQuestion) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(MaintenanceQuestionService.List, opts);
    });
  }

  public async Update(req: MaintenanceQuestion) {
    return new Promise<MaintenanceQuestion>((resolve, reject) => {
      const opts: UnaryRpcOptions<MaintenanceQuestion, MaintenanceQuestion> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(MaintenanceQuestionService.Update, opts);
    });
  }

  public async Delete(req: MaintenanceQuestion) {
    return new Promise<MaintenanceQuestion>((resolve, reject) => {
      const opts: UnaryRpcOptions<MaintenanceQuestion, MaintenanceQuestion> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(MaintenanceQuestionService.Delete, opts);
    });
  }

  public async BatchGet(req: MaintenanceQuestion) {
    return new Promise<MaintenanceQuestionList>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        MaintenanceQuestion,
        MaintenanceQuestionList
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<MaintenanceQuestionList>) => {
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
      grpc.unary(MaintenanceQuestionService.BatchGet, opts);
    });
  }
}

export {
  MaintenanceQuestion,
  MaintenanceQuestionList,
  MaintenanceQuestionClient,
};
