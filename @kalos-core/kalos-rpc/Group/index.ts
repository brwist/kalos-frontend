import { grpc } from '@improbable-eng/grpc-web';
import { GroupService } from '../compiled-protos/group_pb_service';
import { Group, GroupList } from '../compiled-protos/group_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class GroupClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: Group) {
    return new Promise<Group>((resolve, reject) => {
      const opts: UnaryRpcOptions<Group, Group> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(GroupService.Create, opts);
    });
  }

  public async Get(req: Group) {
    return new Promise<Group>((resolve, reject) => {
      const opts: UnaryRpcOptions<Group, Group> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(GroupService.Get, opts);
    });
  }

  public async List(req: Group, cb: (arg: Group) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<Group, Group> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: Group) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(GroupService.List, opts);
    });
  }

  public async Update(req: Group) {
    return new Promise<Group>((resolve, reject) => {
      const opts: UnaryRpcOptions<Group, Group> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(GroupService.Update, opts);
    });
  }

  public async Delete(req: Group) {
    return new Promise<Group>((resolve, reject) => {
      const opts: UnaryRpcOptions<Group, Group> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(GroupService.Delete, opts);
    });
  }

  public async BatchGet(req: Group) {
    return new Promise<GroupList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Group, GroupList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<GroupList>) => {
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
      grpc.unary(GroupService.BatchGet, opts);
    });
  }

  public loadGroups = async () => {
    const group = new Group();
    const res = await this.BatchGet(group);
    return res.getResultsList();
  };
}

export { Group, GroupList, GroupClient };
