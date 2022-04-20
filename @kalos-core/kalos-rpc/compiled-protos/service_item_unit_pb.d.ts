// package: 
// file: service_item_unit.proto

import * as jspb from "google-protobuf";

export class ServiceItemUnit extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getSystemId(): number;
  setSystemId(value: number): void;

  getTypeId(): number;
  setTypeId(value: number): void;

  getDescription(): string;
  setDescription(value: string): void;

  getBrand(): string;
  setBrand(value: string): void;

  getModel(): string;
  setModel(value: string): void;

  getSerial(): string;
  setSerial(value: string): void;

  getLocation(): string;
  setLocation(value: string): void;

  getNotes(): string;
  setNotes(value: string): void;

  getStarted(): string;
  setStarted(value: string): void;

  getIsActive(): number;
  setIsActive(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceItemUnit.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceItemUnit): ServiceItemUnit.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServiceItemUnit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceItemUnit;
  static deserializeBinaryFromReader(message: ServiceItemUnit, reader: jspb.BinaryReader): ServiceItemUnit;
}

export namespace ServiceItemUnit {
  export type AsObject = {
    id: number,
    systemId: number,
    typeId: number,
    description: string,
    brand: string,
    model: string,
    serial: string,
    location: string,
    notes: string,
    started: string,
    isActive: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class ServiceItemUnitList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<ServiceItemUnit>;
  setResultsList(value: Array<ServiceItemUnit>): void;
  addResults(value?: ServiceItemUnit, index?: number): ServiceItemUnit;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceItemUnitList.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceItemUnitList): ServiceItemUnitList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServiceItemUnitList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceItemUnitList;
  static deserializeBinaryFromReader(message: ServiceItemUnitList, reader: jspb.BinaryReader): ServiceItemUnitList;
}

export namespace ServiceItemUnitList {
  export type AsObject = {
    resultsList: Array<ServiceItemUnit.AsObject>,
    totalCount: number,
  }
}

