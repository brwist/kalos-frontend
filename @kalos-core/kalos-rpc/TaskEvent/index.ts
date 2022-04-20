import { grpc } from '@improbable-eng/grpc-web';
import { TaskEventService } from '../compiled-protos/task_event_pb_service';
import { TaskEvent, TaskEventList } from '../compiled-protos/task_event_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';
class TaskEventClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: TaskEvent) {
    return new Promise<TaskEvent>((resolve, reject) => {
      const opts: UnaryRpcOptions<TaskEvent, TaskEvent> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TaskEventService.Create, opts);
    });
  }

  public async Get(req: TaskEvent) {
    return new Promise<TaskEvent>((resolve, reject) => {
      const opts: UnaryRpcOptions<TaskEvent, TaskEvent> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TaskEventService.Get, opts);
    });
  }

  public async List(req: TaskEvent, cb: (arg: TaskEvent) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<TaskEvent, TaskEvent> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: TaskEvent) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(TaskEventService.List, opts);
    });
  }

  public async Update(req: TaskEvent) {
    return new Promise<TaskEvent>((resolve, reject) => {
      const opts: UnaryRpcOptions<TaskEvent, TaskEvent> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TaskEventService.Update, opts);
    });
  }

  public async Delete(req: TaskEvent) {
    return new Promise<TaskEvent>((resolve, reject) => {
      const opts: UnaryRpcOptions<TaskEvent, TaskEvent> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TaskEventService.Delete, opts);
    });
  }

  public async BatchGet(req: TaskEvent) {
    return new Promise<TaskEventList>((resolve, reject) => {
      const opts: UnaryRpcOptions<TaskEvent, TaskEventList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TaskEventList>) => {
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
      grpc.unary(TaskEventService.BatchGet, opts);
    });
  }

  public async deleteTaskEvent(id: number) {
    const req = new TaskEvent();
    req.setId(id);
    await this.Delete(req);
  }

  public upsertTaskEvent = async (data: TaskEvent) => {
    const id = data.getId();
    if (id !== 0 && data.getFieldMaskList().length === 0) {
      throw new Error(
        'Attempting to update entity without providing a field mask will result in a no op'
      );
    }
    return await this[id != 0 ? 'Update' : 'Create'](data);
  };

  public loadTaskEventsByFilter = async ({
    id,
    technicianUserId,
  }: {
    id: number;
    technicianUserId?: number;
    withTechnicianNames?: boolean;
  }) => {
    const req = new TaskEvent();
    req.setTaskId(id);
    if (technicianUserId) {
      req.setTechnicianUserId(technicianUserId);
    }
    req.setIsActive(true);
    req.setPageNumber(0);
    const results: TaskEvent[] = [];
    const res = await this.BatchGet(req);
    const resultsList = res.getResultsList();
    const totalCount = res.getTotalCount();
    const len = resultsList.length;
    results.concat(...resultsList);
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
    return results.sort((a, b) => {
      const A = a.getTimeStarted();
      const B = b.getTimeStarted();
      if (A < B) return 1;
      if (A > B) return -1;
      return 0;
    });
  };
}

const ENROUTE = 'Enroute';
const CHECKIN = 'Check In';
const CHECKOUT = 'Check Out';

export {
  TaskEvent,
  TaskEventList,
  TaskEventClient,
  ENROUTE,
  CHECKIN,
  CHECKOUT,
};
