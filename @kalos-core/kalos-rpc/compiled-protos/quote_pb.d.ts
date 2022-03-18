// package: 
// file: quote.proto

import * as jspb from "google-protobuf";

export class Quote extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getLineId(): number;
  setLineId(value: number): void;

  getReadingsId(): number;
  setReadingsId(value: number): void;

  getPrice(): number;
  setPrice(value: number): void;

  getDocumentId(): number;
  setDocumentId(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Quote.AsObject;
  static toObject(includeInstance: boolean, msg: Quote): Quote.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Quote, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Quote;
  static deserializeBinaryFromReader(message: Quote, reader: jspb.BinaryReader): Quote;
}

export namespace Quote {
  export type AsObject = {
    id: number,
    lineId: number,
    readingsId: number,
    price: number,
    documentId: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class QuoteList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<Quote>;
  setResultsList(value: Array<Quote>): void;
  addResults(value?: Quote, index?: number): Quote;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuoteList.AsObject;
  static toObject(includeInstance: boolean, msg: QuoteList): QuoteList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QuoteList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuoteList;
  static deserializeBinaryFromReader(message: QuoteList, reader: jspb.BinaryReader): QuoteList;
}

export namespace QuoteList {
  export type AsObject = {
    resultsList: Array<Quote.AsObject>,
    totalCount: number,
  }
}

