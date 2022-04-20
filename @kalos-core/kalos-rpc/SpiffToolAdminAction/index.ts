import { grpc } from '@improbable-eng/grpc-web';
import { SpiffToolAdminActionService } from '../compiled-protos/spiff_tool_admin_action_pb_service';
import {
  SpiffToolAdminAction,
  SpiffToolAdminActionList,
} from '../compiled-protos/spiff_tool_admin_action_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class SpiffToolAdminActionClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: SpiffToolAdminAction) {
    return new Promise<SpiffToolAdminAction>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        SpiffToolAdminAction,
        SpiffToolAdminAction
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SpiffToolAdminActionService.Create, opts);
    });
  }

  public async Get(req: SpiffToolAdminAction) {
    return new Promise<SpiffToolAdminAction>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        SpiffToolAdminAction,
        SpiffToolAdminAction
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SpiffToolAdminActionService.Get, opts);
    });
  }

  public async List(
    req: SpiffToolAdminAction,
    cb: (arg: SpiffToolAdminAction) => void
  ) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<
        SpiffToolAdminAction,
        SpiffToolAdminAction
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: SpiffToolAdminAction) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(SpiffToolAdminActionService.List, opts);
    });
  }

  public async Update(req: SpiffToolAdminAction) {
    return new Promise<SpiffToolAdminAction>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        SpiffToolAdminAction,
        SpiffToolAdminAction
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SpiffToolAdminActionService.Update, opts);
    });
  }

  public async Delete(req: SpiffToolAdminAction) {
    return new Promise<SpiffToolAdminAction>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        SpiffToolAdminAction,
        SpiffToolAdminAction
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SpiffToolAdminActionService.Delete, opts);
    });
  }

  public async BatchGet(req: SpiffToolAdminAction) {
    return new Promise<SpiffToolAdminActionList>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        SpiffToolAdminAction,
        SpiffToolAdminActionList
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<SpiffToolAdminActionList>) => {
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
      grpc.unary(SpiffToolAdminActionService.BatchGet, opts);
    });
  }
  /** Returns loaded SpiffToolAdminActions by task id
   * @param taskID: number
   * @returns SpiffToolAdminAction[]
   */
  public async loadSpiffToolAdminActionsByTaskId(taskID: number) {
    const results: SpiffToolAdminAction[] = [];
    const req = new SpiffToolAdminAction();
    req.setPageNumber(0);
    req.setTaskId(taskID);
    const res = await this.BatchGet(req);
    const resultsList = res.getResultsList();
    const totalCount = res.getTotalCount();
    const len = resultsList.length;
    results.concat(resultsList);
    if (totalCount > resultsList.length) {
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
      const A = a.getId();
      const B = b.getId();
      if (A < B) return 1;
      if (A > B) return -1;
      return 0;
    });
  }

  public deletetSpiffToolAdminAction = async (id: number) => {
    const req = new SpiffToolAdminAction();
    req.setId(id);
    await this.Delete(req);
  };

  upsertSpiffToolAdminAction = async (data: SpiffToolAdminAction) => {
    const id = data.getId();
    if (id !== 0 && data.getFieldMaskList().length === 0) {
      throw new Error(
        'Attempting to update entity without providing a field mask will result in a no op'
      );
    }
    await this[id ? 'Create' : 'Update'](data);
  };
}

export {
  SpiffToolAdminAction,
  SpiffToolAdminActionList,
  SpiffToolAdminActionClient,
};
