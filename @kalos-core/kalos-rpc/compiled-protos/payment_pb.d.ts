// package: 
// file: payment.proto

import * as jspb from "google-protobuf";

export class Payment extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getServicesRenderedId(): number;
  setServicesRenderedId(value: number): void;

  getCollected(): number;
  setCollected(value: number): void;

  getType(): string;
  setType(value: string): void;

  getPayeeUserId(): number;
  setPayeeUserId(value: number): void;

  getAmountCollected(): number;
  setAmountCollected(value: number): void;

  getDlNumber(): string;
  setDlNumber(value: string): void;

  getAuthKey(): string;
  setAuthKey(value: string): void;

  getChequeNumber(): string;
  setChequeNumber(value: string): void;

  getIsInvoiceData(): number;
  setIsInvoiceData(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Payment.AsObject;
  static toObject(includeInstance: boolean, msg: Payment): Payment.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Payment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Payment;
  static deserializeBinaryFromReader(message: Payment, reader: jspb.BinaryReader): Payment;
}

export namespace Payment {
  export type AsObject = {
    id: number,
    servicesRenderedId: number,
    collected: number,
    type: string,
    payeeUserId: number,
    amountCollected: number,
    dlNumber: string,
    authKey: string,
    chequeNumber: string,
    isInvoiceData: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class PaymentList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<Payment>;
  setResultsList(value: Array<Payment>): void;
  addResults(value?: Payment, index?: number): Payment;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PaymentList.AsObject;
  static toObject(includeInstance: boolean, msg: PaymentList): PaymentList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PaymentList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PaymentList;
  static deserializeBinaryFromReader(message: PaymentList, reader: jspb.BinaryReader): PaymentList;
}

export namespace PaymentList {
  export type AsObject = {
    resultsList: Array<Payment.AsObject>,
    totalCount: number,
  }
}

