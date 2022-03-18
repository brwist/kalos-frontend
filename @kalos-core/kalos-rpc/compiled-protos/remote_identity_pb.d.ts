// package: 
// file: remote_identity.proto

import * as jspb from "google-protobuf";

export class RemoteIdentity extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  getService(): string;
  setService(value: string): void;

  getIdentityString(): string;
  setIdentityString(value: string): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoteIdentity.AsObject;
  static toObject(includeInstance: boolean, msg: RemoteIdentity): RemoteIdentity.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoteIdentity, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoteIdentity;
  static deserializeBinaryFromReader(message: RemoteIdentity, reader: jspb.BinaryReader): RemoteIdentity;
}

export namespace RemoteIdentity {
  export type AsObject = {
    id: number,
    userId: number,
    service: string,
    identityString: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class RemoteIdentityList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<RemoteIdentity>;
  setResultsList(value: Array<RemoteIdentity>): void;
  addResults(value?: RemoteIdentity, index?: number): RemoteIdentity;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoteIdentityList.AsObject;
  static toObject(includeInstance: boolean, msg: RemoteIdentityList): RemoteIdentityList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoteIdentityList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoteIdentityList;
  static deserializeBinaryFromReader(message: RemoteIdentityList, reader: jspb.BinaryReader): RemoteIdentityList;
}

export namespace RemoteIdentityList {
  export type AsObject = {
    resultsList: Array<RemoteIdentity.AsObject>,
    totalCount: number,
  }
}

