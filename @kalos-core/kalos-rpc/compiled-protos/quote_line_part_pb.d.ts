// package: 
// file: quote_line_part.proto

import * as jspb from "google-protobuf";

export class QuoteLinePart extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getQuoteLineId(): number;
  setQuoteLineId(value: number): void;

  getQuotePartId(): number;
  setQuotePartId(value: number): void;

  getQuantity(): number;
  setQuantity(value: number): void;

  getMarkup(): number;
  setMarkup(value: number): void;

  getTax(): number;
  setTax(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuoteLinePart.AsObject;
  static toObject(includeInstance: boolean, msg: QuoteLinePart): QuoteLinePart.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QuoteLinePart, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuoteLinePart;
  static deserializeBinaryFromReader(message: QuoteLinePart, reader: jspb.BinaryReader): QuoteLinePart;
}

export namespace QuoteLinePart {
  export type AsObject = {
    id: number,
    quoteLineId: number,
    quotePartId: number,
    quantity: number,
    markup: number,
    tax: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class QuoteLinePartList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<QuoteLinePart>;
  setResultsList(value: Array<QuoteLinePart>): void;
  addResults(value?: QuoteLinePart, index?: number): QuoteLinePart;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuoteLinePartList.AsObject;
  static toObject(includeInstance: boolean, msg: QuoteLinePartList): QuoteLinePartList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QuoteLinePartList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuoteLinePartList;
  static deserializeBinaryFromReader(message: QuoteLinePartList, reader: jspb.BinaryReader): QuoteLinePartList;
}

export namespace QuoteLinePartList {
  export type AsObject = {
    resultsList: Array<QuoteLinePart.AsObject>,
    totalCount: number,
  }
}

