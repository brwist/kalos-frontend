import { grpc } from '@improbable-eng/grpc-web';
import { ApiKeyService } from '../compiled-protos/api_key_pb_service';
import { ApiKey, ApiKeyList } from '../compiled-protos/api_key_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';
import { ENDPOINT } from '../constants';

class ApiKeyClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: ApiKey) {
    return new Promise<ApiKey>((resolve, reject) => {
      const opts: UnaryRpcOptions<ApiKey, ApiKey> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ApiKeyService.Create, opts);
    });
  }

  public async getKeyByTextID(ID: string) {
    const req = new ApiKey();
    req.setTextId(ID);
    return await this.Get(req);
  }

  public async Get(req: ApiKey) {
    return new Promise<ApiKey>((resolve, reject) => {
      const opts: UnaryRpcOptions<ApiKey, ApiKey> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ApiKeyService.Get, opts);
    });
  }

  public async List(req: ApiKey, cb: (arg: ApiKey) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<ApiKey, ApiKey> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: ApiKey) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(ApiKeyService.List, opts);
    });
  }

  public async Update(req: ApiKey) {
    return new Promise<ApiKey>((resolve, reject) => {
      const opts: UnaryRpcOptions<ApiKey, ApiKey> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ApiKeyService.Update, opts);
    });
  }

  public async Delete(req: ApiKey) {
    return new Promise<ApiKey>((resolve, reject) => {
      const opts: UnaryRpcOptions<ApiKey, ApiKey> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(ApiKeyService.Delete, opts);
    });
  }

  public async BatchGet(req: ApiKey) {
    return new Promise<ApiKeyList>((resolve, reject) => {
      const opts: UnaryRpcOptions<ApiKey, ApiKeyList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<ApiKeyList>) => {
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
      grpc.unary(ApiKeyService.BatchGet, opts);
    });
  }

  public getKeyByKeyName = async (keyName: string) => {
    const client = new ApiKeyClient(ENDPOINT);
    const req = new ApiKey();
    req.setTextId(keyName);
    const ans = await client.Get(req);
    return ans;
  };
}

export { ApiKey, ApiKeyList, ApiKeyClient };
