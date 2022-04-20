// package: 
// file: event_assignment.proto

import * as jspb from "google-protobuf";

export class EventAssignment extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  getEventId(): number;
  setEventId(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EventAssignment.AsObject;
  static toObject(includeInstance: boolean, msg: EventAssignment): EventAssignment.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EventAssignment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EventAssignment;
  static deserializeBinaryFromReader(message: EventAssignment, reader: jspb.BinaryReader): EventAssignment;
}

export namespace EventAssignment {
  export type AsObject = {
    id: number,
    userId: number,
    eventId: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class EventAssignmentList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<EventAssignment>;
  setResultsList(value: Array<EventAssignment>): void;
  addResults(value?: EventAssignment, index?: number): EventAssignment;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EventAssignmentList.AsObject;
  static toObject(includeInstance: boolean, msg: EventAssignmentList): EventAssignmentList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EventAssignmentList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EventAssignmentList;
  static deserializeBinaryFromReader(message: EventAssignmentList, reader: jspb.BinaryReader): EventAssignmentList;
}

export namespace EventAssignmentList {
  export type AsObject = {
    resultsList: Array<EventAssignment.AsObject>,
    totalCount: number,
  }
}

