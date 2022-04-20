// package: 
// file: transaction_document.proto

import * as jspb from "google-protobuf";

export class TransactionDocument extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getTransactionId(): number;
  setTransactionId(value: number): void;

  getFileId(): number;
  setFileId(value: number): void;

  getTypeId(): number;
  setTypeId(value: number): void;

  getDescription(): string;
  setDescription(value: string): void;

  getReference(): string;
  setReference(value: string): void;

  getUploaderId(): number;
  setUploaderId(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionDocument.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionDocument): TransactionDocument.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransactionDocument, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionDocument;
  static deserializeBinaryFromReader(message: TransactionDocument, reader: jspb.BinaryReader): TransactionDocument;
}

export namespace TransactionDocument {
  export type AsObject = {
    id: number,
    transactionId: number,
    fileId: number,
    typeId: number,
    description: string,
    reference: string,
    uploaderId: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class TransactionDocumentList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<TransactionDocument>;
  setResultsList(value: Array<TransactionDocument>): void;
  addResults(value?: TransactionDocument, index?: number): TransactionDocument;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionDocumentList.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionDocumentList): TransactionDocumentList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransactionDocumentList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionDocumentList;
  static deserializeBinaryFromReader(message: TransactionDocumentList, reader: jspb.BinaryReader): TransactionDocumentList;
}

export namespace TransactionDocumentList {
  export type AsObject = {
    resultsList: Array<TransactionDocument.AsObject>,
    totalCount: number,
  }
}

