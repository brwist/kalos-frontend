// package: 
// file: stored_quote.proto

import * as jspb from "google-protobuf";

export class StoredQuote extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getDescription(): string;
  setDescription(value: string): void;

  getPrice(): number;
  setPrice(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StoredQuote.AsObject;
  static toObject(includeInstance: boolean, msg: StoredQuote): StoredQuote.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StoredQuote, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StoredQuote;
  static deserializeBinaryFromReader(message: StoredQuote, reader: jspb.BinaryReader): StoredQuote;
}

export namespace StoredQuote {
  export type AsObject = {
    id: number,
    description: string,
    price: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class StoredQuoteList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<StoredQuote>;
  setResultsList(value: Array<StoredQuote>): void;
  addResults(value?: StoredQuote, index?: number): StoredQuote;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StoredQuoteList.AsObject;
  static toObject(includeInstance: boolean, msg: StoredQuoteList): StoredQuoteList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StoredQuoteList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StoredQuoteList;
  static deserializeBinaryFromReader(message: StoredQuoteList, reader: jspb.BinaryReader): StoredQuoteList;
}

export namespace StoredQuoteList {
  export type AsObject = {
    resultsList: Array<StoredQuote.AsObject>,
    totalCount: number,
  }
}

