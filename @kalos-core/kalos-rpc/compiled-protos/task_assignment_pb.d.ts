// package: 
// file: task_assignment.proto

import * as jspb from "google-protobuf";

export class TaskAssignment extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  getTaskId(): number;
  setTaskId(value: number): void;

  getIsActive(): number;
  setIsActive(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TaskAssignment.AsObject;
  static toObject(includeInstance: boolean, msg: TaskAssignment): TaskAssignment.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TaskAssignment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TaskAssignment;
  static deserializeBinaryFromReader(message: TaskAssignment, reader: jspb.BinaryReader): TaskAssignment;
}

export namespace TaskAssignment {
  export type AsObject = {
    id: number,
    userId: number,
    taskId: number,
    isActive: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class TaskAssignmentList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<TaskAssignment>;
  setResultsList(value: Array<TaskAssignment>): void;
  addResults(value?: TaskAssignment, index?: number): TaskAssignment;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TaskAssignmentList.AsObject;
  static toObject(includeInstance: boolean, msg: TaskAssignmentList): TaskAssignmentList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TaskAssignmentList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TaskAssignmentList;
  static deserializeBinaryFromReader(message: TaskAssignmentList, reader: jspb.BinaryReader): TaskAssignmentList;
}

export namespace TaskAssignmentList {
  export type AsObject = {
    resultsList: Array<TaskAssignment.AsObject>,
    totalCount: number,
  }
}

