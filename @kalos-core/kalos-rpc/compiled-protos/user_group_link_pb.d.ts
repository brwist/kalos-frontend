// package: 
// file: user_group_link.proto

import * as jspb from "google-protobuf";

export class UserGroupLink extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  getGroupId(): number;
  setGroupId(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserGroupLink.AsObject;
  static toObject(includeInstance: boolean, msg: UserGroupLink): UserGroupLink.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserGroupLink, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserGroupLink;
  static deserializeBinaryFromReader(message: UserGroupLink, reader: jspb.BinaryReader): UserGroupLink;
}

export namespace UserGroupLink {
  export type AsObject = {
    id: number,
    userId: number,
    groupId: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class UserGroupLinkList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<UserGroupLink>;
  setResultsList(value: Array<UserGroupLink>): void;
  addResults(value?: UserGroupLink, index?: number): UserGroupLink;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserGroupLinkList.AsObject;
  static toObject(includeInstance: boolean, msg: UserGroupLinkList): UserGroupLinkList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserGroupLinkList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserGroupLinkList;
  static deserializeBinaryFromReader(message: UserGroupLinkList, reader: jspb.BinaryReader): UserGroupLinkList;
}

export namespace UserGroupLinkList {
  export type AsObject = {
    resultsList: Array<UserGroupLink.AsObject>,
    totalCount: number,
  }
}

