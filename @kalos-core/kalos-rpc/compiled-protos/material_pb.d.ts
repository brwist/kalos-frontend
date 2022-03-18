// package: 
// file: material.proto

import * as jspb from "google-protobuf";

export class Material extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getServiceItemId(): number;
  setServiceItemId(value: number): void;

  getName(): string;
  setName(value: string): void;

  getPartNumber(): string;
  setPartNumber(value: string): void;

  getVendor(): string;
  setVendor(value: string): void;

  getQuantity(): string;
  setQuantity(value: string): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Material.AsObject;
  static toObject(includeInstance: boolean, msg: Material): Material.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Material, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Material;
  static deserializeBinaryFromReader(message: Material, reader: jspb.BinaryReader): Material;
}

export namespace Material {
  export type AsObject = {
    id: number,
    serviceItemId: number,
    name: string,
    partNumber: string,
    vendor: string,
    quantity: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class MaterialList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<Material>;
  setResultsList(value: Array<Material>): void;
  addResults(value?: Material, index?: number): Material;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MaterialList.AsObject;
  static toObject(includeInstance: boolean, msg: MaterialList): MaterialList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MaterialList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MaterialList;
  static deserializeBinaryFromReader(message: MaterialList, reader: jspb.BinaryReader): MaterialList;
}

export namespace MaterialList {
  export type AsObject = {
    resultsList: Array<Material.AsObject>,
    totalCount: number,
  }
}

