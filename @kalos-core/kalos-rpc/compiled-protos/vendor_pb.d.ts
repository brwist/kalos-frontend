// package: 
// file: vendor.proto

import * as jspb from "google-protobuf";
import * as common_pb from "./common_pb";

export class Vendor extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getVendorName(): string;
  setVendorName(value: string): void;

  getVendorCity(): string;
  setVendorCity(value: string): void;

  getVendorState(): string;
  setVendorState(value: string): void;

  getVendorZip(): string;
  setVendorZip(value: string): void;

  getVendorAddress(): string;
  setVendorAddress(value: string): void;

  getIsActive(): number;
  setIsActive(value: number): void;

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
  toObject(includeInstance?: boolean): Vendor.AsObject;
  static toObject(includeInstance: boolean, msg: Vendor): Vendor.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Vendor, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Vendor;
  static deserializeBinaryFromReader(message: Vendor, reader: jspb.BinaryReader): Vendor;
}

export namespace Vendor {
  export type AsObject = {
    id: number,
    vendorName: string,
    vendorCity: string,
    vendorState: string,
    vendorZip: string,
    vendorAddress: string,
    isActive: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
    orderBy: string,
    orderDir: string,
  }
}

export class VendorList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<Vendor>;
  setResultsList(value: Array<Vendor>): void;
  addResults(value?: Vendor, index?: number): Vendor;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VendorList.AsObject;
  static toObject(includeInstance: boolean, msg: VendorList): VendorList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VendorList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VendorList;
  static deserializeBinaryFromReader(message: VendorList, reader: jspb.BinaryReader): VendorList;
}

export namespace VendorList {
  export type AsObject = {
    resultsList: Array<Vendor.AsObject>,
    totalCount: number,
  }
}

