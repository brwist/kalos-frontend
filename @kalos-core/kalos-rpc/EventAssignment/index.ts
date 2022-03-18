import { grpc } from '@improbable-eng/grpc-web';
import { EventAssignmentService } from '../compiled-protos/event_assignment_pb_service';
import {
  EventAssignment,
  EventAssignmentList,
} from '../compiled-protos/event_assignment_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class EventAssignmentClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: EventAssignment) {
    return new Promise<EventAssignment>((resolve, reject) => {
      const opts: UnaryRpcOptions<EventAssignment, EventAssignment> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(EventAssignmentService.Create, opts);
    });
  }

  public async Get(req: EventAssignment) {
    return new Promise<EventAssignment>((resolve, reject) => {
      const opts: UnaryRpcOptions<EventAssignment, EventAssignment> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(EventAssignmentService.Get, opts);
    });
  }

  public async List(req: EventAssignment, cb: (arg: EventAssignment) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<EventAssignment, EventAssignment> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: EventAssignment) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(EventAssignmentService.List, opts);
    });
  }

  public async Update(req: EventAssignment) {
    return new Promise<EventAssignment>((resolve, reject) => {
      const opts: UnaryRpcOptions<EventAssignment, EventAssignment> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(EventAssignmentService.Update, opts);
    });
  }

  public async Delete(req: EventAssignment) {
    return new Promise<EventAssignment>((resolve, reject) => {
      const opts: UnaryRpcOptions<EventAssignment, EventAssignment> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(EventAssignmentService.Delete, opts);
    });
  }

  public async BatchGet(req: EventAssignment) {
    return new Promise<EventAssignmentList>((resolve, reject) => {
      const opts: UnaryRpcOptions<EventAssignment, EventAssignmentList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<EventAssignmentList>) => {
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
      grpc.unary(EventAssignmentService.BatchGet, opts);
    });
  }
}

export { EventAssignment, EventAssignmentList, EventAssignmentClient };
