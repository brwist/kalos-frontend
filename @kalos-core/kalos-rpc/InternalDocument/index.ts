import { grpc } from '@improbable-eng/grpc-web';
import { InternalDocumentService } from '../compiled-protos/internal_document_pb_service';
import {
  InternalDocument,
  InternalDocumentList,
  DocumentKeyList,
  DocumentKey,
} from '../compiled-protos/internal_document_pb';
import { Document } from '../compiled-protos/document_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { File, FileClient } from '../File';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';
import { Empty } from '../compiled-protos/common_pb';
import { timestamp } from '../Common';
import { ENDPOINT } from '../constants';
class InternalDocumentClient extends BaseClient {
  FileClient: FileClient;
  constructor(host?: string, userID?: number) {
    super(host, userID);
    this.FileClient = new FileClient(ENDPOINT);
  }

  public async Create(req: InternalDocument) {
    return new Promise<InternalDocument>((resolve, reject) => {
      const opts: UnaryRpcOptions<InternalDocument, InternalDocument> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(InternalDocumentService.Create, opts);
    });
  }

  public async Get(req: InternalDocument) {
    return new Promise<InternalDocument>((resolve, reject) => {
      const opts: UnaryRpcOptions<InternalDocument, InternalDocument> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(InternalDocumentService.Get, opts);
    });
  }

  public async List(
    req: InternalDocument,
    cb: (arg: InternalDocument) => void
  ) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<InternalDocument, InternalDocument> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: InternalDocument) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(InternalDocumentService.List, opts);
    });
  }

  public async Update(req: InternalDocument) {
    return new Promise<InternalDocument>((resolve, reject) => {
      const opts: UnaryRpcOptions<InternalDocument, InternalDocument> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(InternalDocumentService.Update, opts);
    });
  }

  public async Delete(req: InternalDocument) {
    return new Promise<InternalDocument>((resolve, reject) => {
      const opts: UnaryRpcOptions<InternalDocument, InternalDocument> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(InternalDocumentService.Delete, opts);
    });
  }

  public async BatchGet(req: InternalDocument) {
    return new Promise<InternalDocumentList>((resolve, reject) => {
      const opts: UnaryRpcOptions<InternalDocument, InternalDocumentList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<InternalDocumentList>) => {
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
      grpc.unary(InternalDocumentService.BatchGet, opts);
    });
  }

  public async GetDocumentKeys(req: DocumentKey) {
    return new Promise<DocumentKeyList>((resolve, reject) => {
      const opts: UnaryRpcOptions<DocumentKey, DocumentKeyList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<DocumentKeyList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };

      grpc.unary(InternalDocumentService.GetDocumentKeys, opts);
    });
  }

  public async WriteDocumentKey(req: DocumentKey) {
    console.log(req);
    return new Promise<DocumentKey>((resolve, reject) => {
      const opts: UnaryRpcOptions<DocumentKey, DocumentKey> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<DocumentKey>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(InternalDocumentService.WriteDocumentKey, opts);
    });
  }

  public async DeleteDocumentKey(req: DocumentKey) {
    return new Promise<Empty>((resolve, reject) => {
      const opts: UnaryRpcOptions<DocumentKey, Empty> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<Empty>) => {
          if (result.status == 0) {
            resolve(new Empty());
          } else {
            reject(result.statusMessage);
          }
        },
      };
      grpc.unary(InternalDocumentService.DeleteDocumentKey, opts);
    });
  }

  public deleteDocumentKeyById = async (id: number) => {
    const req = new DocumentKey();
    req.setId(id);
    await this.DeleteDocumentKey(req);
  };

  public deleteInternalDocumentById = async (id: number) => {
    const req = new InternalDocument();
    req.setId(id);
    await this.Delete(req);
  };

  public loadDocumentKeys = async () => {
    const req = new DocumentKey();
    req.setIsActive(true);
    const res = await this.GetDocumentKeys(req);
    return res.getDataList();
  };

  public saveDocumentKey = async (data: DocumentKey, id?: number) => {
    if (id) {
      data.setId(id);
    }
    await this.WriteDocumentKey(data);
  };

  public upsertInternalDocument = async (data: InternalDocument) => {
    const id = data.getId();

    const reqFile = new File();
    reqFile.setBucket('kalos-internal-docs');
    reqFile.setName(data.getFilename());
    if (data.getFileId()) {
      reqFile.setId(data.getFileId());
    }
    const file = await this.FileClient.upsertFile(reqFile);
    if (!id) {
      data.setDateCreated(timestamp());
      data.setFileId(file.getId());
    }
    data.setDateModified(timestamp());
    if (id !== 0 && data.getFieldMaskList().length === 0) {
      throw new Error(
        'Attempting to update entity without providing a field mask will result in a no op'
      );
    }
    return await this[id ? 'Update' : 'Create'](data);
  };

  public loadInternalDocuments = async ({
    page,
    filter: { tag, description },
    sort: { orderBy, orderDir },
  }: LoadInternalDocuments) => {
    const req = new InternalDocument();
    const keys = Object.keys(req);
    req.setOrderBy(orderBy);
    if (!keys.includes(orderBy)) {
      const dk = new DocumentKey();
      dk.setIsActive(true);
      req.setTagData(dk);
    }
    req.setOrderDir(orderDir);
    req.setPageNumber(page);
    if (tag && tag > 0) {
      req.setTag(tag);
    }
    if (description) {
      req.setDescription(`%${description}%`);
    }
    return await this.BatchGet(req);
  };
}

type LoadInternalDocuments = {
  page: number;
  filter: InternalDocumentsFilter;
  sort: InternalDocumentsSort;
};

type InternalDocumentsFilter = {
  tag?: number;
  description?: string;
};

type InternalDocumentsSort = {
  orderByField: keyof InternalDocument | keyof Document;
  orderBy: string;
  orderDir: 'ASC' | 'DESC';
};

export {
  InternalDocument,
  InternalDocumentList,
  InternalDocumentClient,
  DocumentKey,
  DocumentKeyList,
  LoadInternalDocuments,
  InternalDocumentsFilter,
  InternalDocumentsSort,
};
