// package: 
// file: vendor_order.proto

import * as jspb from "google-protobuf";

export class VendorOrder extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getVendorId(): number;
  setVendorId(value: number): void;

  getQuotePartId(): number;
  setQuotePartId(value: number): void;

  getReference(): string;
  setReference(value: string): void;

  getOrderStatus(): number;
  setOrderStatus(value: number): void;

  getOrderDate(): string;
  setOrderDate(value: string): void;

  getOrderEta(): string;
  setOrderEta(value: string): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VendorOrder.AsObject;
  static toObject(includeInstance: boolean, msg: VendorOrder): VendorOrder.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VendorOrder, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VendorOrder;
  static deserializeBinaryFromReader(message: VendorOrder, reader: jspb.BinaryReader): VendorOrder;
}

export namespace VendorOrder {
  export type AsObject = {
    id: number,
    vendorId: number,
    quotePartId: number,
    reference: string,
    orderStatus: number,
    orderDate: string,
    orderEta: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class VendorOrderList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<VendorOrder>;
  setResultsList(value: Array<VendorOrder>): void;
  addResults(value?: VendorOrder, index?: number): VendorOrder;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VendorOrderList.AsObject;
  static toObject(includeInstance: boolean, msg: VendorOrderList): VendorOrderList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VendorOrderList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VendorOrderList;
  static deserializeBinaryFromReader(message: VendorOrderList, reader: jspb.BinaryReader): VendorOrderList;
}

export namespace VendorOrderList {
  export type AsObject = {
    resultsList: Array<VendorOrder.AsObject>,
    totalCount: number,
  }
}

