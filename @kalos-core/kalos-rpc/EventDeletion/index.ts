import { grpc } from '@improbable-eng/grpc-web';
import { EventDeletionService } from '../compiled-protos/event_deletion_pb_service';
import {
  EventDeletion,
  EventDeletionList,
} from '../compiled-protos/event_deletion_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class EventDeletionClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: EventDeletion) {
    return new Promise<EventDeletion>((resolve, reject) => {
      const opts: UnaryRpcOptions<EventDeletion, EventDeletion> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(EventDeletionService.Create, opts);
    });
  }

  public async Get(req: EventDeletion) {
    return new Promise<EventDeletion>((resolve, reject) => {
      const opts: UnaryRpcOptions<EventDeletion, EventDeletion> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(EventDeletionService.Get, opts);
    });
  }

  public async List(req: EventDeletion, cb: (arg: EventDeletion) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<EventDeletion, EventDeletion> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: EventDeletion) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(EventDeletionService.List, opts);
    });
  }

  public async Update(req: EventDeletion) {
    return new Promise<EventDeletion>((resolve, reject) => {
      const opts: UnaryRpcOptions<EventDeletion, EventDeletion> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(EventDeletionService.Update, opts);
    });
  }

  public async Delete(req: EventDeletion) {
    return new Promise<EventDeletion>((resolve, reject) => {
      const opts: UnaryRpcOptions<EventDeletion, EventDeletion> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(EventDeletionService.Delete, opts);
    });
  }

  public async BatchGet(req: EventDeletion) {
    return new Promise<EventDeletionList>((resolve, reject) => {
      const opts: UnaryRpcOptions<EventDeletion, EventDeletionList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<EventDeletionList>) => {
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
      grpc.unary(EventDeletionService.BatchGet, opts);
    });
  }
}

export { EventDeletion, EventDeletionList, EventDeletionClient };
