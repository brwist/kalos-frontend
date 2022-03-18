import { grpc } from '@improbable-eng/grpc-web';
import { ServiceItemImageService } from '../compiled-protos/service_item_image_pb_service';
import {
  ServiceItemImage,
  ServiceItemImageList,
} from '../compiled-protos/service_item_image_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class ServiceItemImageClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: ServiceItemImage) {
    return new Promise<ServiceItemImage>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceItemImage, ServiceItemImage> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServiceItemImageService.Create, opts);
    });
  }

  public async Get(req: ServiceItemImage) {
    return new Promise<ServiceItemImage>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceItemImage, ServiceItemImage> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServiceItemImageService.Get, opts);
    });
  }

  public async List(
    req: ServiceItemImage,
    cb: (arg: ServiceItemImage) => void
  ) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<ServiceItemImage, ServiceItemImage> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: ServiceItemImage) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(ServiceItemImageService.List, opts);
    });
  }

  public async Update(req: ServiceItemImage) {
    return new Promise<ServiceItemImage>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceItemImage, ServiceItemImage> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServiceItemImageService.Update, opts);
    });
  }

  public async Delete(req: ServiceItemImage) {
    return new Promise<ServiceItemImage>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceItemImage, ServiceItemImage> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ServiceItemImageService.Delete, opts);
    });
  }

  public async BatchGet(req: ServiceItemImage) {
    return new Promise<ServiceItemImageList>((resolve, reject) => {
      const opts: UnaryRpcOptions<ServiceItemImage, ServiceItemImageList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<ServiceItemImageList>) => {
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
      grpc.unary(ServiceItemImageService.BatchGet, opts);
    });
  }
}

export { ServiceItemImage, ServiceItemImageList, ServiceItemImageClient };
