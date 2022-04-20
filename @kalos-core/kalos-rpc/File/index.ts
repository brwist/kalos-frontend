import { grpc } from '@improbable-eng/grpc-web';
import { FileService } from '../compiled-protos/file_pb_service';
import { File, FileList } from '../compiled-protos/file_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class FileClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: File) {
    return new Promise<File>((resolve, reject) => {
      const opts: UnaryRpcOptions<File, File> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(FileService.Create, opts);
    });
  }

  public async Get(req: File) {
    return new Promise<File>((resolve, reject) => {
      const opts: UnaryRpcOptions<File, File> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(FileService.Get, opts);
    });
  }

  public async List(req: File, cb: (arg: File) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<File, File> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: File) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(FileService.List, opts);
    });
  }

  public async Update(req: File) {
    return new Promise<File>((resolve, reject) => {
      const opts: UnaryRpcOptions<File, File> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(FileService.Update, opts);
    });
  }

  public async Delete(req: File) {
    return new Promise<File>((resolve, reject) => {
      const opts: UnaryRpcOptions<File, File> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(FileService.Delete, opts);
    });
  }

  public async BatchGet(req: File) {
    return new Promise<FileList>((resolve, reject) => {
      const opts: UnaryRpcOptions<File, FileList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<FileList>) => {
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
      grpc.unary(FileService.BatchGet, opts);
    });
  }

  public deleteFileById = async (id: number) => {
    const req = new File();
    req.setId(id);
    await this.Delete(req);
  };

  public upsertFile = async (data: File) => {
    return await this[data.getId() != 0 ? 'Update' : 'Create'](data);
  };

  public loadFiles = async (filter: File) => {
    return await this.BatchGet(filter);
  };
}

export { File, FileList, FileClient };
