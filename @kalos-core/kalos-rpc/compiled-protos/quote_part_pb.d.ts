// package: 
// file: quote_part.proto

import * as jspb from "google-protobuf";

export class QuotePart extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getDescription(): string;
  setDescription(value: string): void;

  getVendor(): string;
  setVendor(value: string): void;

  getCost(): number;
  setCost(value: number): void;

  getAvailability(): number;
  setAvailability(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuotePart.AsObject;
  static toObject(includeInstance: boolean, msg: QuotePart): QuotePart.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QuotePart, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuotePart;
  static deserializeBinaryFromReader(message: QuotePart, reader: jspb.BinaryReader): QuotePart;
}

export namespace QuotePart {
  export type AsObject = {
    id: number,
    description: string,
    vendor: string,
    cost: number,
    availability: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class QuotePartList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<QuotePart>;
  setResultsList(value: Array<QuotePart>): void;
  addResults(value?: QuotePart, index?: number): QuotePart;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuotePartList.AsObject;
  static toObject(includeInstance: boolean, msg: QuotePartList): QuotePartList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QuotePartList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuotePartList;
  static deserializeBinaryFromReader(message: QuotePartList, reader: jspb.BinaryReader): QuotePartList;
}

export namespace QuotePartList {
  export type AsObject = {
    resultsList: Array<QuotePart.AsObject>,
    totalCount: number,
  }
}

