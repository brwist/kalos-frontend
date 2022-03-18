// package: 
// file: service_item_material.proto

import * as jspb from "google-protobuf";

export class ServiceItemMaterial extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getSystemId(): number;
  setSystemId(value: number): void;

  getTypeId(): number;
  setTypeId(value: number): void;

  getDescription(): string;
  setDescription(value: string): void;

  getPart(): string;
  setPart(value: string): void;

  getFilterWidth(): string;
  setFilterWidth(value: string): void;

  getFilterHeight(): string;
  setFilterHeight(value: string): void;

  getFilterThickness(): string;
  setFilterThickness(value: string): void;

  getQuantity(): string;
  setQuantity(value: string): void;

  getIsActive(): number;
  setIsActive(value: number): void;

  getVendor(): string;
  setVendor(value: string): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceItemMaterial.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceItemMaterial): ServiceItemMaterial.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServiceItemMaterial, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceItemMaterial;
  static deserializeBinaryFromReader(message: ServiceItemMaterial, reader: jspb.BinaryReader): ServiceItemMaterial;
}

export namespace ServiceItemMaterial {
  export type AsObject = {
    id: number,
    systemId: number,
    typeId: number,
    description: string,
    part: string,
    filterWidth: string,
    filterHeight: string,
    filterThickness: string,
    quantity: string,
    isActive: number,
    vendor: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class ServiceItemMaterialList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<ServiceItemMaterial>;
  setResultsList(value: Array<ServiceItemMaterial>): void;
  addResults(value?: ServiceItemMaterial, index?: number): ServiceItemMaterial;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceItemMaterialList.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceItemMaterialList): ServiceItemMaterialList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServiceItemMaterialList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceItemMaterialList;
  static deserializeBinaryFromReader(message: ServiceItemMaterialList, reader: jspb.BinaryReader): ServiceItemMaterialList;
}

export namespace ServiceItemMaterialList {
  export type AsObject = {
    resultsList: Array<ServiceItemMaterial.AsObject>,
    totalCount: number,
  }
}

