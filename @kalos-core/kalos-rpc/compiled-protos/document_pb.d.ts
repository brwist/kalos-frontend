// package: 
// file: document.proto

import * as jspb from "google-protobuf";

export class Document extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getInvoiceId(): number;
  setInvoiceId(value: number): void;

  getPropertyId(): number;
  setPropertyId(value: number): void;

  getContractId(): number;
  setContractId(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  getTaskId(): number;
  setTaskId(value: number): void;

  getFileId(): number;
  setFileId(value: number): void;

  getFilename(): string;
  setFilename(value: string): void;

  getDateCreated(): string;
  setDateCreated(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getType(): number;
  setType(value: number): void;

  getVersion(): number;
  setVersion(value: number): void;

  getInvoice(): number;
  setInvoice(value: number): void;

  getQuote(): number;
  setQuote(value: number): void;

  getMaintenance(): number;
  setMaintenance(value: number): void;

  getOther(): number;
  setOther(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  getOrderBy(): string;
  setOrderBy(value: string): void;

  getOrderDir(): string;
  setOrderDir(value: string): void;

  clearNotEqualsList(): void;
  getNotEqualsList(): Array<string>;
  setNotEqualsList(value: Array<string>): void;
  addNotEquals(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Document.AsObject;
  static toObject(includeInstance: boolean, msg: Document): Document.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Document, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Document;
  static deserializeBinaryFromReader(message: Document, reader: jspb.BinaryReader): Document;
}

export namespace Document {
  export type AsObject = {
    id: number,
    invoiceId: number,
    propertyId: number,
    contractId: number,
    userId: number,
    taskId: number,
    fileId: number,
    filename: string,
    dateCreated: string,
    description: string,
    type: number,
    version: number,
    invoice: number,
    quote: number,
    maintenance: number,
    other: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
    orderBy: string,
    orderDir: string,
    notEqualsList: Array<string>,
  }
}

export class DocumentList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<Document>;
  setResultsList(value: Array<Document>): void;
  addResults(value?: Document, index?: number): Document;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DocumentList.AsObject;
  static toObject(includeInstance: boolean, msg: DocumentList): DocumentList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DocumentList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DocumentList;
  static deserializeBinaryFromReader(message: DocumentList, reader: jspb.BinaryReader): DocumentList;
}

export namespace DocumentList {
  export type AsObject = {
    resultsList: Array<Document.AsObject>,
    totalCount: number,
  }
}

