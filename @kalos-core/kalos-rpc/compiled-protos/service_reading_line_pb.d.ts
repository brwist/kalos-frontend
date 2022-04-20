// package: 
// file: service_reading_line.proto

import * as jspb from "google-protobuf";

export class ServiceReadingLine extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getReadingId(): number;
  setReadingId(value: number): void;

  getUnitId(): number;
  setUnitId(value: number): void;

  getTypeId(): number;
  setTypeId(value: number): void;

  getValue(): string;
  setValue(value: string): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceReadingLine.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceReadingLine): ServiceReadingLine.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServiceReadingLine, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceReadingLine;
  static deserializeBinaryFromReader(message: ServiceReadingLine, reader: jspb.BinaryReader): ServiceReadingLine;
}

export namespace ServiceReadingLine {
  export type AsObject = {
    id: number,
    readingId: number,
    unitId: number,
    typeId: number,
    value: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class ServiceReadingLineList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<ServiceReadingLine>;
  setResultsList(value: Array<ServiceReadingLine>): void;
  addResults(value?: ServiceReadingLine, index?: number): ServiceReadingLine;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceReadingLineList.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceReadingLineList): ServiceReadingLineList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServiceReadingLineList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceReadingLineList;
  static deserializeBinaryFromReader(message: ServiceReadingLineList, reader: jspb.BinaryReader): ServiceReadingLineList;
}

export namespace ServiceReadingLineList {
  export type AsObject = {
    resultsList: Array<ServiceReadingLine.AsObject>,
    totalCount: number,
  }
}

