// package: 
// file: quote_document.proto

import * as jspb from "google-protobuf";

export class QuoteDocument extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getDocumentId(): number;
  setDocumentId(value: number): void;

  getPropertyId(): number;
  setPropertyId(value: number): void;

  getReadingId(): number;
  setReadingId(value: number): void;

  getEventId(): number;
  setEventId(value: number): void;

  getJobNotes(): string;
  setJobNotes(value: string): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuoteDocument.AsObject;
  static toObject(includeInstance: boolean, msg: QuoteDocument): QuoteDocument.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QuoteDocument, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuoteDocument;
  static deserializeBinaryFromReader(message: QuoteDocument, reader: jspb.BinaryReader): QuoteDocument;
}

export namespace QuoteDocument {
  export type AsObject = {
    id: number,
    documentId: number,
    propertyId: number,
    readingId: number,
    eventId: number,
    jobNotes: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class QuoteDocumentList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<QuoteDocument>;
  setResultsList(value: Array<QuoteDocument>): void;
  addResults(value?: QuoteDocument, index?: number): QuoteDocument;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuoteDocumentList.AsObject;
  static toObject(includeInstance: boolean, msg: QuoteDocumentList): QuoteDocumentList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QuoteDocumentList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuoteDocumentList;
  static deserializeBinaryFromReader(message: QuoteDocumentList, reader: jspb.BinaryReader): QuoteDocumentList;
}

export namespace QuoteDocumentList {
  export type AsObject = {
    resultsList: Array<QuoteDocument.AsObject>,
    totalCount: number,
  }
}

