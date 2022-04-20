// package: 
// file: quote_used.proto

import * as jspb from "google-protobuf";

export class QuoteUsed extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getServicesRenderedId(): number;
  setServicesRenderedId(value: number): void;

  getQuoteLineId(): number;
  setQuoteLineId(value: number): void;

  getQuantity(): number;
  setQuantity(value: number): void;

  getQuotedPrice(): number;
  setQuotedPrice(value: number): void;

  getBillable(): number;
  setBillable(value: number): void;

  getLmpc(): number;
  setLmpc(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuoteUsed.AsObject;
  static toObject(includeInstance: boolean, msg: QuoteUsed): QuoteUsed.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QuoteUsed, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuoteUsed;
  static deserializeBinaryFromReader(message: QuoteUsed, reader: jspb.BinaryReader): QuoteUsed;
}

export namespace QuoteUsed {
  export type AsObject = {
    id: number,
    servicesRenderedId: number,
    quoteLineId: number,
    quantity: number,
    quotedPrice: number,
    billable: number,
    lmpc: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class QuoteUsedList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<QuoteUsed>;
  setResultsList(value: Array<QuoteUsed>): void;
  addResults(value?: QuoteUsed, index?: number): QuoteUsed;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuoteUsedList.AsObject;
  static toObject(includeInstance: boolean, msg: QuoteUsedList): QuoteUsedList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QuoteUsedList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuoteUsedList;
  static deserializeBinaryFromReader(message: QuoteUsedList, reader: jspb.BinaryReader): QuoteUsedList;
}

export namespace QuoteUsedList {
  export type AsObject = {
    resultsList: Array<QuoteUsed.AsObject>,
    totalCount: number,
  }
}

