import { grpc } from '@improbable-eng/grpc-web';
import { ServicesRenderedService } from '../compiled-protos/services_rendered_pb_service';
import {
  ServicesRendered,
  ServicesRenderedList,
} from '../compiled-protos/services_rendered_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class ServicesRenderedClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: ServicesRendered) {
    return new Promise<ServicesRendered>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServicesRendered, ServicesRendered> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServicesRenderedService.Create, opts);
    });
  }

  public async Get(req: ServicesRendered) {
    return new Promise<ServicesRendered>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServicesRendered, ServicesRendered> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServicesRenderedService.Get, opts);
    });
  }

  public async List(
    req: ServicesRendered,
    cb: (arg: ServicesRendered) => void
  ) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<ServicesRendered, ServicesRendered> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: ServicesRendered) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(ServicesRenderedService.List, opts);
    });
  }

  public async Update(req: ServicesRendered) {
    return new Promise<ServicesRendered>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServicesRendered, ServicesRendered> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServicesRenderedService.Update, opts);
    });
  }

  public async Delete(req: ServicesRendered) {
    return new Promise<ServicesRendered>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServicesRendered, ServicesRendered> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServicesRenderedService.Delete, opts);
    });
  }

  public async BatchGet(req: ServicesRendered) {
    return new Promise<ServicesRenderedList>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServicesRendered, ServicesRenderedList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<ServicesRenderedList>) => {
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
      grpc.unary(ServicesRenderedService.BatchGet, opts);
    });
  }

  public async loadServicesRenderedByEventID(eventId: number) {
    let results: ServicesRendered[] = [];
    const req = new ServicesRendered();
    req.setEventId(eventId);
    req.setIsActive(1);
    for (let page = 0; ; page += 1) {
      req.setPageNumber(page);
      const res = await this.BatchGet(req);
      const resultsList = res.getResultsList();
      const totalCount = res.getTotalCount();
      results = results.concat(resultsList);
      if (results.length === totalCount) break;
    }
    return results.sort((a, b) => {
      if (a.getId() > b.getId()) return -1;
      if (a.getId() < b.getId()) return 1;
      return 0;
    });
  }
}

export { ServicesRendered, ServicesRenderedList, ServicesRenderedClient };
