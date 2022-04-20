import { grpc } from '@improbable-eng/grpc-web';
import { UserGroupLinkService } from '../compiled-protos/user_group_link_pb_service';
import {
  UserGroupLink,
  UserGroupLinkList,
} from '../compiled-protos/user_group_link_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class UserGroupLinkClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: UserGroupLink) {
    return new Promise<UserGroupLink>((resolve, reject) => {
      const opts: UnaryRpcOptions<UserGroupLink, UserGroupLink> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(UserGroupLinkService.Create, opts);
    });
  }

  public async Get(req: UserGroupLink) {
    return new Promise<UserGroupLink>((resolve, reject) => {
      const opts: UnaryRpcOptions<UserGroupLink, UserGroupLink> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(UserGroupLinkService.Get, opts);
    });
  }

  public async List(req: UserGroupLink, cb: (arg: UserGroupLink) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<UserGroupLink, UserGroupLink> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: UserGroupLink) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(UserGroupLinkService.List, opts);
    });
  }

  public async Update(req: UserGroupLink) {
    return new Promise<UserGroupLink>((resolve, reject) => {
      const opts: UnaryRpcOptions<UserGroupLink, UserGroupLink> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(UserGroupLinkService.Update, opts);
    });
  }

  public async Delete(req: UserGroupLink) {
    return new Promise<UserGroupLink>((resolve, reject) => {
      const opts: UnaryRpcOptions<UserGroupLink, UserGroupLink> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(UserGroupLinkService.Delete, opts);
    });
  }

  public async BatchGet(req: UserGroupLink) {
    return new Promise<UserGroupLinkList>((resolve, reject) => {
      const opts: UnaryRpcOptions<UserGroupLink, UserGroupLinkList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<UserGroupLinkList>) => {
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
      grpc.unary(UserGroupLinkService.BatchGet, opts);
    });
  }

  public loadUserGroupLinksByUserId = async (userId: number) => {
    const groupLink = new UserGroupLink();
    groupLink.setUserId(userId);
    const data = await this.BatchGet(groupLink);
    return data.getResultsList();
  };
}

export { UserGroupLink, UserGroupLinkList, UserGroupLinkClient };
