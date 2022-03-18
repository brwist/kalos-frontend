import { grpc } from '@improbable-eng/grpc-web';
import { TaskAssignmentService } from '../compiled-protos/task_assignment_pb_service';
import {
  TaskAssignment,
  TaskAssignmentList,
} from '../compiled-protos/task_assignment_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class TaskAssignmentClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: TaskAssignment) {
    return new Promise<TaskAssignment>((resolve, reject) => {
      const opts: UnaryRpcOptions<TaskAssignment, TaskAssignment> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TaskAssignmentService.Create, opts);
    });
  }

  public async Get(req: TaskAssignment) {
    return new Promise<TaskAssignment>((resolve, reject) => {
      const opts: UnaryRpcOptions<TaskAssignment, TaskAssignment> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TaskAssignmentService.Get, opts);
    });
  }

  public async List(req: TaskAssignment, cb: (arg: TaskAssignment) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<TaskAssignment, TaskAssignment> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: TaskAssignment) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(TaskAssignmentService.List, opts);
    });
  }

  public async Update(req: TaskAssignment) {
    return new Promise<TaskAssignment>((resolve, reject) => {
      const opts: UnaryRpcOptions<TaskAssignment, TaskAssignment> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TaskAssignmentService.Update, opts);
    });
  }

  public async Delete(req: TaskAssignment) {
    return new Promise<TaskAssignment>((resolve, reject) => {
      const opts: UnaryRpcOptions<TaskAssignment, TaskAssignment> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TaskAssignmentService.Delete, opts);
    });
  }

  public async BatchGet(req: TaskAssignment) {
    return new Promise<TaskAssignmentList>((resolve, reject) => {
      const opts: UnaryRpcOptions<TaskAssignment, TaskAssignmentList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TaskAssignmentList>) => {
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
      grpc.unary(TaskAssignmentService.BatchGet, opts);
    });
  }

  public loadTaskAssignment = async (taskId: number) => {
    const req = new TaskAssignment();
    req.setIsActive(1);
    req.setTaskId(taskId);
    const results: TaskAssignment[] = [];
    const res = await this.BatchGet(req);
    const resultsList = res.getResultsList();
    const totalCount = res.getTotalCount();
    const len = resultsList.length;
    results.concat(resultsList);
    if (totalCount > len) {
      const batchesAmount = Math.ceil((totalCount - len) / len);
      const batchResults = await Promise.all(
        Array.from(Array(batchesAmount)).map(async (_, idx) => {
          req.setPageNumber(idx + 1);
          return (await this.BatchGet(req)).getResultsList();
        })
      );
      results.push(
        ...batchResults.reduce((aggr, item) => [...aggr, ...item], [])
      );
    }
    return results;
  };

  public upsertTaskAssignments = async (
    taskId: number,
    technicianIds: number[]
  ) => {
    const req = new TaskAssignment();
    req.setTaskId(taskId); // Below was added when this function was still in helpers in the frontend:
    await this.Delete(req); // FIXME deleting by taskId doesn't work - resolve when task will return TaskAssignment[]
    await Promise.all(
      technicianIds.map(id => {
        const req = new TaskAssignment();
        req.setTaskId(taskId);
        req.setUserId(id);
        this.Create(req);
      })
    );
  };
}

export { TaskAssignment, TaskAssignmentList, TaskAssignmentClient };
