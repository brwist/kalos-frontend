// package: 
// file: task_event.proto

import * as jspb from "google-protobuf";

export class TaskEvent extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getTaskId(): number;
  setTaskId(value: number): void;

  getStatusId(): number;
  setStatusId(value: number): void;

  getActionTaken(): string;
  setActionTaken(value: string): void;

  getActionNeeded(): string;
  setActionNeeded(value: string): void;

  getTimeStarted(): string;
  setTimeStarted(value: string): void;

  getTimeFinished(): string;
  setTimeFinished(value: string): void;

  getTechnicianUserId(): number;
  setTechnicianUserId(value: number): void;

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

  getLatitude(): number;
  setLatitude(value: number): void;

  getLongitude(): number;
  setLongitude(value: number): void;

  getTechnicianUserName(): string;
  setTechnicianUserName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TaskEvent.AsObject;
  static toObject(includeInstance: boolean, msg: TaskEvent): TaskEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TaskEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TaskEvent;
  static deserializeBinaryFromReader(message: TaskEvent, reader: jspb.BinaryReader): TaskEvent;
}

export namespace TaskEvent {
  export type AsObject = {
    id: number,
    taskId: number,
    statusId: number,
    actionTaken: string,
    actionNeeded: string,
    timeStarted: string,
    timeFinished: string,
    technicianUserId: number,
    isActive: boolean,
    fieldMaskList: Array<string>,
    pageNumber: number,
    orderBy: string,
    orderDir: string,
    latitude: number,
    longitude: number,
    technicianUserName: string,
  }
}

export class TaskEventList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<TaskEvent>;
  setResultsList(value: Array<TaskEvent>): void;
  addResults(value?: TaskEvent, index?: number): TaskEvent;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TaskEventList.AsObject;
  static toObject(includeInstance: boolean, msg: TaskEventList): TaskEventList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TaskEventList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TaskEventList;
  static deserializeBinaryFromReader(message: TaskEventList, reader: jspb.BinaryReader): TaskEventList;
}

export namespace TaskEventList {
  export type AsObject = {
    resultsList: Array<TaskEvent.AsObject>,
    totalCount: number,
  }
}

