// package: 
// file: group.proto

import * as jspb from "google-protobuf";

export class Group extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getName(): string;
  setName(value: string): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Group.AsObject;
  static toObject(includeInstance: boolean, msg: Group): Group.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Group, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Group;
  static deserializeBinaryFromReader(message: Group, reader: jspb.BinaryReader): Group;
}

export namespace Group {
  export type AsObject = {
    id: number,
    name: string,
    fieldMaskList: Array<string>,
  }
}

export class GroupList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<Group>;
  setResultsList(value: Array<Group>): void;
  addResults(value?: Group, index?: number): Group;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupList.AsObject;
  static toObject(includeInstance: boolean, msg: GroupList): GroupList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GroupList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupList;
  static deserializeBinaryFromReader(message: GroupList, reader: jspb.BinaryReader): GroupList;
}

export namespace GroupList {
  export type AsObject = {
    resultsList: Array<Group.AsObject>,
    totalCount: number,
  }
}

