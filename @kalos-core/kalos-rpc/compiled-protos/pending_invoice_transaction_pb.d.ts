// package: 
// file: pending_invoice_transaction.proto

import * as jspb from "google-protobuf";

export class PendingInvoiceTransaction extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getInvoiceNumber(): string;
  setInvoiceNumber(value: string): void;

  getTimestamp(): string;
  setTimestamp(value: string): void;

  getAmount(): string;
  setAmount(value: string): void;

  getVendorId(): number;
  setVendorId(value: number): void;

  getIsCommitted(): number;
  setIsCommitted(value: number): void;

  getIsActive(): number;
  setIsActive(value: number): void;

  getNotes(): string;
  setNotes(value: string): void;

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

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PendingInvoiceTransaction.AsObject;
  static toObject(includeInstance: boolean, msg: PendingInvoiceTransaction): PendingInvoiceTransaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PendingInvoiceTransaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PendingInvoiceTransaction;
  static deserializeBinaryFromReader(message: PendingInvoiceTransaction, reader: jspb.BinaryReader): PendingInvoiceTransaction;
}

export namespace PendingInvoiceTransaction {
  export type AsObject = {
    id: number,
    invoiceNumber: string,
    timestamp: string,
    amount: string,
    vendorId: number,
    isCommitted: number,
    isActive: number,
    notes: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
    orderBy: string,
    orderDir: string,
  }
}

export class PendingInvoiceTransactionList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<PendingInvoiceTransaction>;
  setResultsList(value: Array<PendingInvoiceTransaction>): void;
  addResults(value?: PendingInvoiceTransaction, index?: number): PendingInvoiceTransaction;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PendingInvoiceTransactionList.AsObject;
  static toObject(includeInstance: boolean, msg: PendingInvoiceTransactionList): PendingInvoiceTransactionList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PendingInvoiceTransactionList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PendingInvoiceTransactionList;
  static deserializeBinaryFromReader(message: PendingInvoiceTransactionList, reader: jspb.BinaryReader): PendingInvoiceTransactionList;
}

export namespace PendingInvoiceTransactionList {
  export type AsObject = {
    resultsList: Array<PendingInvoiceTransaction.AsObject>,
    totalCount: number,
  }
}

