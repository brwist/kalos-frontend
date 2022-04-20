// package: 
// file: pending_billing.proto

import * as jspb from "google-protobuf";

export class PendingBilling extends jspb.Message {
  getEventId(): number;
  setEventId(value: number): void;

  getPropertyId(): number;
  setPropertyId(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  getCustomerName(): string;
  setCustomerName(value: string): void;

  getBusinessName(): string;
  setBusinessName(value: string): void;

  getDateCompleted(): string;
  setDateCompleted(value: string): void;

  getAddress(): string;
  setAddress(value: string): void;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  getOrderBy(): string;
  setOrderBy(value: string): void;

  getOrderDir(): string;
  setOrderDir(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PendingBilling.AsObject;
  static toObject(includeInstance: boolean, msg: PendingBilling): PendingBilling.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PendingBilling, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PendingBilling;
  static deserializeBinaryFromReader(message: PendingBilling, reader: jspb.BinaryReader): PendingBilling;
}

export namespace PendingBilling {
  export type AsObject = {
    eventId: number,
    propertyId: number,
    userId: number,
    customerName: string,
    businessName: string,
    dateCompleted: string,
    address: string,
    pageNumber: number,
    orderBy: string,
    orderDir: string,
  }
}

export class PendingBillingList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<PendingBilling>;
  setResultsList(value: Array<PendingBilling>): void;
  addResults(value?: PendingBilling, index?: number): PendingBilling;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PendingBillingList.AsObject;
  static toObject(includeInstance: boolean, msg: PendingBillingList): PendingBillingList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PendingBillingList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PendingBillingList;
  static deserializeBinaryFromReader(message: PendingBillingList, reader: jspb.BinaryReader): PendingBillingList;
}

export namespace PendingBillingList {
  export type AsObject = {
    resultsList: Array<PendingBilling.AsObject>,
    totalCount: number,
  }
}

