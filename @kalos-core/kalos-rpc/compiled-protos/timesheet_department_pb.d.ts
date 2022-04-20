// package: 
// file: timesheet_department.proto

import * as jspb from "google-protobuf";
import * as common_pb from "./common_pb";

export class TimesheetDepartment extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getValue(): string;
  setValue(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getManagerId(): number;
  setManagerId(value: number): void;

  getIsActive(): number;
  setIsActive(value: number): void;

  getSectorGroup(): number;
  setSectorGroup(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimesheetDepartment.AsObject;
  static toObject(includeInstance: boolean, msg: TimesheetDepartment): TimesheetDepartment.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimesheetDepartment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimesheetDepartment;
  static deserializeBinaryFromReader(message: TimesheetDepartment, reader: jspb.BinaryReader): TimesheetDepartment;
}

export namespace TimesheetDepartment {
  export type AsObject = {
    id: number,
    value: string,
    description: string,
    managerId: number,
    isActive: number,
    sectorGroup: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class TimesheetDepartmentList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<TimesheetDepartment>;
  setResultsList(value: Array<TimesheetDepartment>): void;
  addResults(value?: TimesheetDepartment, index?: number): TimesheetDepartment;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimesheetDepartmentList.AsObject;
  static toObject(includeInstance: boolean, msg: TimesheetDepartmentList): TimesheetDepartmentList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimesheetDepartmentList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimesheetDepartmentList;
  static deserializeBinaryFromReader(message: TimesheetDepartmentList, reader: jspb.BinaryReader): TimesheetDepartmentList;
}

export namespace TimesheetDepartmentList {
  export type AsObject = {
    resultsList: Array<TimesheetDepartment.AsObject>,
    totalCount: number,
  }
}

