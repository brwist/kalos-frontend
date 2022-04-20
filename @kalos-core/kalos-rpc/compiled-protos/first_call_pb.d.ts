// package: 
// file: first_call.proto

import * as jspb from "google-protobuf";

export class FirstCall extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getDateCreated(): string;
  setDateCreated(value: string): void;

  getJson(): string;
  setJson(value: string): void;

  getSector(): number;
  setSector(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FirstCall.AsObject;
  static toObject(includeInstance: boolean, msg: FirstCall): FirstCall.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FirstCall, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FirstCall;
  static deserializeBinaryFromReader(message: FirstCall, reader: jspb.BinaryReader): FirstCall;
}

export namespace FirstCall {
  export type AsObject = {
    id: number,
    dateCreated: string,
    json: string,
    sector: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class FirstCallList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<FirstCall>;
  setResultsList(value: Array<FirstCall>): void;
  addResults(value?: FirstCall, index?: number): FirstCall;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FirstCallList.AsObject;
  static toObject(includeInstance: boolean, msg: FirstCallList): FirstCallList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FirstCallList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FirstCallList;
  static deserializeBinaryFromReader(message: FirstCallList, reader: jspb.BinaryReader): FirstCallList;
}

export namespace FirstCallList {
  export type AsObject = {
    resultsList: Array<FirstCall.AsObject>,
    totalCount: number,
  }
}

