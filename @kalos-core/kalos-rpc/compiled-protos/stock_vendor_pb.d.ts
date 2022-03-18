// package: 
// file: stock_vendor.proto

import * as jspb from "google-protobuf";

export class StockVendor extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getName(): string;
  setName(value: string): void;

  getLocation(): string;
  setLocation(value: string): void;

  getDefaultAvailability(): number;
  setDefaultAvailability(value: number): void;

  getAccount(): string;
  setAccount(value: string): void;

  getBilling(): number;
  setBilling(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StockVendor.AsObject;
  static toObject(includeInstance: boolean, msg: StockVendor): StockVendor.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StockVendor, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StockVendor;
  static deserializeBinaryFromReader(message: StockVendor, reader: jspb.BinaryReader): StockVendor;
}

export namespace StockVendor {
  export type AsObject = {
    id: number,
    name: string,
    location: string,
    defaultAvailability: number,
    account: string,
    billing: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class StockVendorList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<StockVendor>;
  setResultsList(value: Array<StockVendor>): void;
  addResults(value?: StockVendor, index?: number): StockVendor;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StockVendorList.AsObject;
  static toObject(includeInstance: boolean, msg: StockVendorList): StockVendorList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StockVendorList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StockVendorList;
  static deserializeBinaryFromReader(message: StockVendorList, reader: jspb.BinaryReader): StockVendorList;
}

export namespace StockVendorList {
  export type AsObject = {
    resultsList: Array<StockVendor.AsObject>,
    totalCount: number,
  }
}

