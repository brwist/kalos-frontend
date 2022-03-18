// package: 
// file: slack.proto

import * as jspb from "google-protobuf";
import * as common_pb from "./common_pb";

export class DMReq extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): void;

  getText(): string;
  setText(value: string): void;

  getDispatcherId(): number;
  setDispatcherId(value: number): void;

  getEscape(): boolean;
  setEscape(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DMReq.AsObject;
  static toObject(includeInstance: boolean, msg: DMReq): DMReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DMReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DMReq;
  static deserializeBinaryFromReader(message: DMReq, reader: jspb.BinaryReader): DMReq;
}

export namespace DMReq {
  export type AsObject = {
    userId: number,
    text: string,
    dispatcherId: number,
    escape: boolean,
  }
}

export class DispatchReq extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): void;

  getEventId(): number;
  setEventId(value: number): void;

  getDispatcherId(): number;
  setDispatcherId(value: number): void;

  getDmOnly(): boolean;
  setDmOnly(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DispatchReq.AsObject;
  static toObject(includeInstance: boolean, msg: DispatchReq): DispatchReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DispatchReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DispatchReq;
  static deserializeBinaryFromReader(message: DispatchReq, reader: jspb.BinaryReader): DispatchReq;
}

export namespace DispatchReq {
  export type AsObject = {
    userId: number,
    eventId: number,
    dispatcherId: number,
    dmOnly: boolean,
  }
}

export class FCReq extends jspb.Message {
  getDivision(): number;
  setDivision(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FCReq.AsObject;
  static toObject(includeInstance: boolean, msg: FCReq): FCReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FCReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FCReq;
  static deserializeBinaryFromReader(message: FCReq, reader: jspb.BinaryReader): FCReq;
}

export namespace FCReq {
  export type AsObject = {
    division: number,
  }
}

export class FirstCallsDispatchReq extends jspb.Message {
  clearEventsList(): void;
  getEventsList(): Array<FirstCallsEvent>;
  setEventsList(value: Array<FirstCallsEvent>): void;
  addEvents(value?: FirstCallsEvent, index?: number): FirstCallsEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FirstCallsDispatchReq.AsObject;
  static toObject(includeInstance: boolean, msg: FirstCallsDispatchReq): FirstCallsDispatchReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FirstCallsDispatchReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FirstCallsDispatchReq;
  static deserializeBinaryFromReader(message: FirstCallsDispatchReq, reader: jspb.BinaryReader): FirstCallsDispatchReq;
}

export namespace FirstCallsDispatchReq {
  export type AsObject = {
    eventsList: Array<FirstCallsEvent.AsObject>,
  }
}

export class FirstCallsEvent extends jspb.Message {
  getEventId(): string;
  setEventId(value: string): void;

  clearUserIdList(): void;
  getUserIdList(): Array<string>;
  setUserIdList(value: Array<string>): void;
  addUserId(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FirstCallsEvent.AsObject;
  static toObject(includeInstance: boolean, msg: FirstCallsEvent): FirstCallsEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FirstCallsEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FirstCallsEvent;
  static deserializeBinaryFromReader(message: FirstCallsEvent, reader: jspb.BinaryReader): FirstCallsEvent;
}

export namespace FirstCallsEvent {
  export type AsObject = {
    eventId: string,
    userIdList: Array<string>,
  }
}

