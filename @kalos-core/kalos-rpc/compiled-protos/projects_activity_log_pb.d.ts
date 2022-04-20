// package: 
// file: projects_activity_log.proto

import * as jspb from "google-protobuf";

export class ProjectsActivityLog extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  getProjectId(): number;
  setProjectId(value: number): void;

  getDescription(): string;
  setDescription(value: string): void;

  getDate(): string;
  setDate(value: string): void;

  getIsActive(): boolean;
  setIsActive(value: boolean): void;

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

  clearDateRangeList(): void;
  getDateRangeList(): Array<string>;
  setDateRangeList(value: Array<string>): void;
  addDateRange(value: string, index?: number): string;

  getWithUser(): boolean;
  setWithUser(value: boolean): void;

  getDateTarget(): string;
  setDateTarget(value: string): void;

  clearNotEqualsList(): void;
  getNotEqualsList(): Array<string>;
  setNotEqualsList(value: Array<string>): void;
  addNotEquals(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProjectsActivityLog.AsObject;
  static toObject(includeInstance: boolean, msg: ProjectsActivityLog): ProjectsActivityLog.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProjectsActivityLog, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProjectsActivityLog;
  static deserializeBinaryFromReader(message: ProjectsActivityLog, reader: jspb.BinaryReader): ProjectsActivityLog;
}

export namespace ProjectsActivityLog {
  export type AsObject = {
    id: number,
    userId: number,
    projectId: number,
    description: string,
    date: string,
    isActive: boolean,
    fieldMaskList: Array<string>,
    pageNumber: number,
    orderBy: string,
    orderDir: string,
    dateRangeList: Array<string>,
    withUser: boolean,
    dateTarget: string,
    notEqualsList: Array<string>,
  }
}

export class ProjectsActivityLogList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<ProjectsActivityLog>;
  setResultsList(value: Array<ProjectsActivityLog>): void;
  addResults(value?: ProjectsActivityLog, index?: number): ProjectsActivityLog;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProjectsActivityLogList.AsObject;
  static toObject(includeInstance: boolean, msg: ProjectsActivityLogList): ProjectsActivityLogList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProjectsActivityLogList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProjectsActivityLogList;
  static deserializeBinaryFromReader(message: ProjectsActivityLogList, reader: jspb.BinaryReader): ProjectsActivityLogList;
}

export namespace ProjectsActivityLogList {
  export type AsObject = {
    resultsList: Array<ProjectsActivityLog.AsObject>,
    totalCount: number,
  }
}

