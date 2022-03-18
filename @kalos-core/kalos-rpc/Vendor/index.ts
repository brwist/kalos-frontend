import { grpc } from '@improbable-eng/grpc-web';
import { VendorService } from '../compiled-protos/vendor_pb_service';
import { Vendor, VendorList } from '../compiled-protos/vendor_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { BaseClient } from '../BaseClient';

class VendorClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: Vendor) {
    return new Promise<Vendor>((resolve, reject) => {
      const opts: UnaryRpcOptions<Vendor, Vendor> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(VendorService.Create, opts);
    });
  }

  public async Get(req: Vendor) {
    return new Promise<Vendor>((resolve, reject) => {
      const opts: UnaryRpcOptions<Vendor, Vendor> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(VendorService.Get, opts);
    });
  }

  public async Update(req: Vendor) {
    return new Promise<Vendor>((resolve, reject) => {
      const opts: UnaryRpcOptions<Vendor, Vendor> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(VendorService.Update, opts);
    });
  }

  public async Delete(req: Vendor) {
    return new Promise<Vendor>((resolve, reject) => {
      const opts: UnaryRpcOptions<Vendor, Vendor> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(VendorService.Delete, opts);
    });
  }

  public async BatchGet(req: Vendor) {
    return new Promise<VendorList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Vendor, VendorList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<VendorList>) => {
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
      grpc.unary(VendorService.BatchGet, opts);
    });
  }
}

export { Vendor, VendorList, VendorClient };
