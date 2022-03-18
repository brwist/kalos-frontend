// package: 
// file: team.proto

import * as jspb from "google-protobuf";

export class Team extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getPermissionGroupIds(): string;
  setPermissionGroupIds(value: string): void;

  getParentId(): number;
  setParentId(value: number): void;

  getColor(): string;
  setColor(value: string): void;

  getManagerIds(): string;
  setManagerIds(value: string): void;

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

  getGroupBy(): string;
  setGroupBy(value: string): void;

  clearNotEqualsList(): void;
  getNotEqualsList(): Array<string>;
  setNotEqualsList(value: Array<string>): void;
  addNotEquals(value: string, index?: number): string;

  getWithoutLimit(): boolean;
  setWithoutLimit(value: boolean): void;

  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Team.AsObject;
  static toObject(includeInstance: boolean, msg: Team): Team.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Team, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Team;
  static deserializeBinaryFromReader(message: Team, reader: jspb.BinaryReader): Team;
}

export namespace Team {
  export type AsObject = {
    id: number,
    permissionGroupIds: string,
    parentId: number,
    color: string,
    managerIds: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
    orderBy: string,
    orderDir: string,
    groupBy: string,
    notEqualsList: Array<string>,
    withoutLimit: boolean,
    name: string,
    description: string,
  }
}

export class TeamList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<Team>;
  setResultsList(value: Array<Team>): void;
  addResults(value?: Team, index?: number): Team;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TeamList.AsObject;
  static toObject(includeInstance: boolean, msg: TeamList): TeamList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TeamList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TeamList;
  static deserializeBinaryFromReader(message: TeamList, reader: jspb.BinaryReader): TeamList;
}

export namespace TeamList {
  export type AsObject = {
    resultsList: Array<Team.AsObject>,
    totalCount: number,
  }
}

