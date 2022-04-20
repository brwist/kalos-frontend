// package: 
// file: timesheet_department_group.proto

import * as jspb from "google-protobuf";

export class TimesheetDepartmentGroup extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getSector(): string;
  setSector(value: string): void;

  getSlackDispatchChannelId(): string;
  setSlackDispatchChannelId(value: string): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimesheetDepartmentGroup.AsObject;
  static toObject(includeInstance: boolean, msg: TimesheetDepartmentGroup): TimesheetDepartmentGroup.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimesheetDepartmentGroup, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimesheetDepartmentGroup;
  static deserializeBinaryFromReader(message: TimesheetDepartmentGroup, reader: jspb.BinaryReader): TimesheetDepartmentGroup;
}

export namespace TimesheetDepartmentGroup {
  export type AsObject = {
    id: number,
    sector: string,
    slackDispatchChannelId: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class TimesheetDepartmentGroupList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<TimesheetDepartmentGroup>;
  setResultsList(value: Array<TimesheetDepartmentGroup>): void;
  addResults(value?: TimesheetDepartmentGroup, index?: number): TimesheetDepartmentGroup;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimesheetDepartmentGroupList.AsObject;
  static toObject(includeInstance: boolean, msg: TimesheetDepartmentGroupList): TimesheetDepartmentGroupList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimesheetDepartmentGroupList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimesheetDepartmentGroupList;
  static deserializeBinaryFromReader(message: TimesheetDepartmentGroupList, reader: jspb.BinaryReader): TimesheetDepartmentGroupList;
}

export namespace TimesheetDepartmentGroupList {
  export type AsObject = {
    resultsList: Array<TimesheetDepartmentGroup.AsObject>,
    totalCount: number,
  }
}

