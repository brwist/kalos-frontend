// package: 
// file: internal_document.proto

import * as jspb from "google-protobuf";
import * as common_pb from "./common_pb";
import * as file_pb from "./file_pb";

export class InternalDocument extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getDocUserId(): number;
  setDocUserId(value: number): void;

  getFilename(): string;
  setFilename(value: string): void;

  getDateCreated(): string;
  setDateCreated(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getTag(): number;
  setTag(value: number): void;

  getFileId(): number;
  setFileId(value: number): void;

  getDateModified(): string;
  setDateModified(value: string): void;

  hasTagData(): boolean;
  clearTagData(): void;
  getTagData(): DocumentKey | undefined;
  setTagData(value?: DocumentKey): void;

  hasFile(): boolean;
  clearFile(): void;
  getFile(): file_pb.File | undefined;
  setFile(value?: file_pb.File): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  getOrderBy(): string;
  setOrderBy(value: string): void;

  getOrderDir(): string;
  setOrderDir(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InternalDocument.AsObject;
  static toObject(includeInstance: boolean, msg: InternalDocument): InternalDocument.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InternalDocument, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InternalDocument;
  static deserializeBinaryFromReader(message: InternalDocument, reader: jspb.BinaryReader): InternalDocument;
}

export namespace InternalDocument {
  export type AsObject = {
    id: number,
    docUserId: number,
    filename: string,
    dateCreated: string,
    description: string,
    tag: number,
    fileId: number,
    dateModified: string,
    tagData?: DocumentKey.AsObject,
    file?: file_pb.File.AsObject,
    fieldMaskList: Array<string>,
    pageNumber: number,
    orderBy: string,
    orderDir: string,
  }
}

export class InternalDocumentList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<InternalDocument>;
  setResultsList(value: Array<InternalDocument>): void;
  addResults(value?: InternalDocument, index?: number): InternalDocument;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InternalDocumentList.AsObject;
  static toObject(includeInstance: boolean, msg: InternalDocumentList): InternalDocumentList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InternalDocumentList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InternalDocumentList;
  static deserializeBinaryFromReader(message: InternalDocumentList, reader: jspb.BinaryReader): InternalDocumentList;
}

export namespace InternalDocumentList {
  export type AsObject = {
    resultsList: Array<InternalDocument.AsObject>,
    totalCount: number,
  }
}

export class DocumentKey extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getName(): string;
  setName(value: string): void;

  getColor(): string;
  setColor(value: string): void;

  getIsActive(): boolean;
  setIsActive(value: boolean): void;

  getDateCreated(): string;
  setDateCreated(value: string): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DocumentKey.AsObject;
  static toObject(includeInstance: boolean, msg: DocumentKey): DocumentKey.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DocumentKey, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DocumentKey;
  static deserializeBinaryFromReader(message: DocumentKey, reader: jspb.BinaryReader): DocumentKey;
}

export namespace DocumentKey {
  export type AsObject = {
    id: number,
    name: string,
    color: string,
    isActive: boolean,
    dateCreated: string,
    fieldMaskList: Array<string>,
  }
}

export class DocumentKeyList extends jspb.Message {
  clearDataList(): void;
  getDataList(): Array<DocumentKey>;
  setDataList(value: Array<DocumentKey>): void;
  addData(value?: DocumentKey, index?: number): DocumentKey;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DocumentKeyList.AsObject;
  static toObject(includeInstance: boolean, msg: DocumentKeyList): DocumentKeyList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DocumentKeyList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DocumentKeyList;
  static deserializeBinaryFromReader(message: DocumentKeyList, reader: jspb.BinaryReader): DocumentKeyList;
}

export namespace DocumentKeyList {
  export type AsObject = {
    dataList: Array<DocumentKey.AsObject>,
  }
}

