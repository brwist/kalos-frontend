// package: 
// file: system_invoice_type.proto

import * as jspb from "google-protobuf";

export class SystemInvoiceType extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getSystemReadingTypeId(): number;
  setSystemReadingTypeId(value: number): void;

  getReading1(): string;
  setReading1(value: string): void;

  getReading2(): string;
  setReading2(value: string): void;

  getReading3(): string;
  setReading3(value: string): void;

  getReading4(): string;
  setReading4(value: string): void;

  getReading5(): string;
  setReading5(value: string): void;

  getReading6(): string;
  setReading6(value: string): void;

  getReading7(): string;
  setReading7(value: string): void;

  getReading8(): string;
  setReading8(value: string): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SystemInvoiceType.AsObject;
  static toObject(includeInstance: boolean, msg: SystemInvoiceType): SystemInvoiceType.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SystemInvoiceType, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SystemInvoiceType;
  static deserializeBinaryFromReader(message: SystemInvoiceType, reader: jspb.BinaryReader): SystemInvoiceType;
}

export namespace SystemInvoiceType {
  export type AsObject = {
    id: number,
    systemReadingTypeId: number,
    reading1: string,
    reading2: string,
    reading3: string,
    reading4: string,
    reading5: string,
    reading6: string,
    reading7: string,
    reading8: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class SystemInvoiceTypeList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<SystemInvoiceType>;
  setResultsList(value: Array<SystemInvoiceType>): void;
  addResults(value?: SystemInvoiceType, index?: number): SystemInvoiceType;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SystemInvoiceTypeList.AsObject;
  static toObject(includeInstance: boolean, msg: SystemInvoiceTypeList): SystemInvoiceTypeList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SystemInvoiceTypeList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SystemInvoiceTypeList;
  static deserializeBinaryFromReader(message: SystemInvoiceTypeList, reader: jspb.BinaryReader): SystemInvoiceTypeList;
}

export namespace SystemInvoiceTypeList {
  export type AsObject = {
    resultsList: Array<SystemInvoiceType.AsObject>,
    totalCount: number,
  }
}

