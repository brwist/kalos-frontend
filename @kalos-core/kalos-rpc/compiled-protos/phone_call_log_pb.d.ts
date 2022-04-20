// package: 
// file: phone_call_log.proto

import * as jspb from "google-protobuf";

export class PhoneCallLog extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getJiveCallId(): string;
  setJiveCallId(value: string): void;

  getCallTimestamp(): string;
  setCallTimestamp(value: string): void;

  getDialedNumber(): string;
  setDialedNumber(value: string): void;

  getCallerIdName(): string;
  setCallerIdName(value: string): void;

  getCallerIdNumber(): string;
  setCallerIdNumber(value: string): void;

  getPhoneCallRecordingLink(): string;
  setPhoneCallRecordingLink(value: string): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PhoneCallLog.AsObject;
  static toObject(includeInstance: boolean, msg: PhoneCallLog): PhoneCallLog.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PhoneCallLog, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PhoneCallLog;
  static deserializeBinaryFromReader(message: PhoneCallLog, reader: jspb.BinaryReader): PhoneCallLog;
}

export namespace PhoneCallLog {
  export type AsObject = {
    id: number,
    jiveCallId: string,
    callTimestamp: string,
    dialedNumber: string,
    callerIdName: string,
    callerIdNumber: string,
    phoneCallRecordingLink: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class PhoneCallLogList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<PhoneCallLog>;
  setResultsList(value: Array<PhoneCallLog>): void;
  addResults(value?: PhoneCallLog, index?: number): PhoneCallLog;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PhoneCallLogList.AsObject;
  static toObject(includeInstance: boolean, msg: PhoneCallLogList): PhoneCallLogList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PhoneCallLogList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PhoneCallLogList;
  static deserializeBinaryFromReader(message: PhoneCallLogList, reader: jspb.BinaryReader): PhoneCallLogList;
}

export namespace PhoneCallLogList {
  export type AsObject = {
    resultsList: Array<PhoneCallLog.AsObject>,
    totalCount: number,
  }
}

