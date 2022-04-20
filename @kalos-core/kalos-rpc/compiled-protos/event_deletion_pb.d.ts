// package: 
// file: event_deletion.proto

import * as jspb from "google-protobuf";

export class EventDeletion extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getDeletedEventId(): number;
  setDeletedEventId(value: number): void;

  getActivityId(): number;
  setActivityId(value: number): void;

  getReason(): string;
  setReason(value: string): void;

  getAffirmation(): number;
  setAffirmation(value: number): void;

  getIsRestored(): number;
  setIsRestored(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EventDeletion.AsObject;
  static toObject(includeInstance: boolean, msg: EventDeletion): EventDeletion.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EventDeletion, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EventDeletion;
  static deserializeBinaryFromReader(message: EventDeletion, reader: jspb.BinaryReader): EventDeletion;
}

export namespace EventDeletion {
  export type AsObject = {
    id: number,
    deletedEventId: number,
    activityId: number,
    reason: string,
    affirmation: number,
    isRestored: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class EventDeletionList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<EventDeletion>;
  setResultsList(value: Array<EventDeletion>): void;
  addResults(value?: EventDeletion, index?: number): EventDeletion;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EventDeletionList.AsObject;
  static toObject(includeInstance: boolean, msg: EventDeletionList): EventDeletionList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EventDeletionList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EventDeletionList;
  static deserializeBinaryFromReader(message: EventDeletionList, reader: jspb.BinaryReader): EventDeletionList;
}

export namespace EventDeletionList {
  export type AsObject = {
    resultsList: Array<EventDeletion.AsObject>,
    totalCount: number,
  }
}

