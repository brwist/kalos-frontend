// package: 
// file: employee_function.proto

import * as jspb from "google-protobuf";

export class EmployeeFunction extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getName(): string;
  setName(value: string): void;

  getColor(): string;
  setColor(value: string): void;

  getStatus(): number;
  setStatus(value: number): void;

  getIsdeleted(): number;
  setIsdeleted(value: number): void;

  getAddeddate(): string;
  setAddeddate(value: string): void;

  getModifydate(): string;
  setModifydate(value: string): void;

  getAddeduserid(): number;
  setAddeduserid(value: number): void;

  getModifyuserid(): number;
  setModifyuserid(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EmployeeFunction.AsObject;
  static toObject(includeInstance: boolean, msg: EmployeeFunction): EmployeeFunction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EmployeeFunction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EmployeeFunction;
  static deserializeBinaryFromReader(message: EmployeeFunction, reader: jspb.BinaryReader): EmployeeFunction;
}

export namespace EmployeeFunction {
  export type AsObject = {
    id: number,
    name: string,
    color: string,
    status: number,
    isdeleted: number,
    addeddate: string,
    modifydate: string,
    addeduserid: number,
    modifyuserid: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class EmployeeFunctionList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<EmployeeFunction>;
  setResultsList(value: Array<EmployeeFunction>): void;
  addResults(value?: EmployeeFunction, index?: number): EmployeeFunction;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EmployeeFunctionList.AsObject;
  static toObject(includeInstance: boolean, msg: EmployeeFunctionList): EmployeeFunctionList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EmployeeFunctionList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EmployeeFunctionList;
  static deserializeBinaryFromReader(message: EmployeeFunctionList, reader: jspb.BinaryReader): EmployeeFunctionList;
}

export namespace EmployeeFunctionList {
  export type AsObject = {
    resultsList: Array<EmployeeFunction.AsObject>,
    totalCount: number,
  }
}

