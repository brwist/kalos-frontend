// package: 
// file: s3.proto

import * as jspb from "google-protobuf";
import * as common_pb from "./common_pb";

export class MoveConfig extends jspb.Message {
  hasSource(): boolean;
  clearSource(): void;
  getSource(): FileObject | undefined;
  setSource(value?: FileObject): void;

  hasDestination(): boolean;
  clearDestination(): void;
  getDestination(): FileObject | undefined;
  setDestination(value?: FileObject): void;

  getPreserveSource(): boolean;
  setPreserveSource(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MoveConfig.AsObject;
  static toObject(includeInstance: boolean, msg: MoveConfig): MoveConfig.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MoveConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MoveConfig;
  static deserializeBinaryFromReader(message: MoveConfig, reader: jspb.BinaryReader): MoveConfig;
}

export namespace MoveConfig {
  export type AsObject = {
    source?: FileObject.AsObject,
    destination?: FileObject.AsObject,
    preserveSource: boolean,
  }
}

export class FileObject extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getBucket(): string;
  setBucket(value: string): void;

  getKey(): string;
  setKey(value: string): void;

  getTagString(): string;
  setTagString(value: string): void;

  getMimeType(): string;
  setMimeType(value: string): void;

  getCreatedAt(): string;
  setCreatedAt(value: string): void;

  getUri(): string;
  setUri(value: string): void;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  getAcl(): ACLMap[keyof ACLMap];
  setAcl(value: ACLMap[keyof ACLMap]): void;

  getNoWriteToDatabase(): boolean;
  setNoWriteToDatabase(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FileObject.AsObject;
  static toObject(includeInstance: boolean, msg: FileObject): FileObject.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FileObject, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FileObject;
  static deserializeBinaryFromReader(message: FileObject, reader: jspb.BinaryReader): FileObject;
}

export namespace FileObject {
  export type AsObject = {
    id: number,
    bucket: string,
    key: string,
    tagString: string,
    mimeType: string,
    createdAt: string,
    uri: string,
    data: Uint8Array | string,
    acl: ACLMap[keyof ACLMap],
    noWriteToDatabase: boolean,
  }
}

export class URLObject extends jspb.Message {
  getUrl(): string;
  setUrl(value: string): void;

  getBucket(): string;
  setBucket(value: string): void;

  getContentType(): string;
  setContentType(value: string): void;

  getKey(): string;
  setKey(value: string): void;

  getAcl(): ACLMap[keyof ACLMap];
  setAcl(value: ACLMap[keyof ACLMap]): void;

  getTagString(): string;
  setTagString(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): URLObject.AsObject;
  static toObject(includeInstance: boolean, msg: URLObject): URLObject.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: URLObject, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): URLObject;
  static deserializeBinaryFromReader(message: URLObject, reader: jspb.BinaryReader): URLObject;
}

export namespace URLObject {
  export type AsObject = {
    url: string,
    bucket: string,
    contentType: string,
    key: string,
    acl: ACLMap[keyof ACLMap],
    tagString: string,
  }
}

export class FileObjects extends jspb.Message {
  clearResultList(): void;
  getResultList(): Array<FileObject>;
  setResultList(value: Array<FileObject>): void;
  addResult(value?: FileObject, index?: number): FileObject;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FileObjects.AsObject;
  static toObject(includeInstance: boolean, msg: FileObjects): FileObjects.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FileObjects, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FileObjects;
  static deserializeBinaryFromReader(message: FileObjects, reader: jspb.BinaryReader): FileObjects;
}

export namespace FileObjects {
  export type AsObject = {
    resultList: Array<FileObject.AsObject>,
  }
}

export class BucketObject extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getRegion(): string;
  setRegion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BucketObject.AsObject;
  static toObject(includeInstance: boolean, msg: BucketObject): BucketObject.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BucketObject, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BucketObject;
  static deserializeBinaryFromReader(message: BucketObject, reader: jspb.BinaryReader): BucketObject;
}

export namespace BucketObject {
  export type AsObject = {
    name: string,
    region: string,
  }
}

export interface ACLMap {
  PRIVATE: 0;
  PUBLICREAD: 1;
  PUBLICREADWRITE: 2;
}

export const ACL: ACLMap;

