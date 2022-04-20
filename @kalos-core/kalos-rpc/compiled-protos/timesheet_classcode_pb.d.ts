// package: 
// file: timesheet_classcode.proto

import * as jspb from "google-protobuf";

export class TimesheetClassCode extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getDescription(): string;
  setDescription(value: string): void;

  getBillable(): boolean;
  setBillable(value: boolean): void;

  getClasscodeId(): number;
  setClasscodeId(value: number): void;

  getClasscodeQbId(): number;
  setClasscodeQbId(value: number): void;

  getClasscodeQbName(): string;
  setClasscodeQbName(value: string): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  getIsActive(): boolean;
  setIsActive(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimesheetClassCode.AsObject;
  static toObject(includeInstance: boolean, msg: TimesheetClassCode): TimesheetClassCode.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimesheetClassCode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimesheetClassCode;
  static deserializeBinaryFromReader(message: TimesheetClassCode, reader: jspb.BinaryReader): TimesheetClassCode;
}

export namespace TimesheetClassCode {
  export type AsObject = {
    id: number,
    description: string,
    billable: boolean,
    classcodeId: number,
    classcodeQbId: number,
    classcodeQbName: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
    isActive: boolean,
  }
}

export class TimesheetClassCodeList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<TimesheetClassCode>;
  setResultsList(value: Array<TimesheetClassCode>): void;
  addResults(value?: TimesheetClassCode, index?: number): TimesheetClassCode;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimesheetClassCodeList.AsObject;
  static toObject(includeInstance: boolean, msg: TimesheetClassCodeList): TimesheetClassCodeList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimesheetClassCodeList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimesheetClassCodeList;
  static deserializeBinaryFromReader(message: TimesheetClassCodeList, reader: jspb.BinaryReader): TimesheetClassCodeList;
}

export namespace TimesheetClassCodeList {
  export type AsObject = {
    resultsList: Array<TimesheetClassCode.AsObject>,
    totalCount: number,
  }
}

