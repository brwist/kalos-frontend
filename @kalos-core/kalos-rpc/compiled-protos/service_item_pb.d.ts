// package: 
// file: service_item.proto

import * as jspb from "google-protobuf";

export class ServiceItem extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getPropertyId(): number;
  setPropertyId(value: number): void;

  getType(): string;
  setType(value: string): void;

  getItem(): string;
  setItem(value: string): void;

  getBrand(): string;
  setBrand(value: string): void;

  getStartDate(): string;
  setStartDate(value: string): void;

  getModel(): string;
  setModel(value: string): void;

  getSerial(): string;
  setSerial(value: string): void;

  getItem2(): string;
  setItem2(value: string): void;

  getBrand2(): string;
  setBrand2(value: string): void;

  getModel2(): string;
  setModel2(value: string): void;

  getSerial2(): string;
  setSerial2(value: string): void;

  getItem3(): string;
  setItem3(value: string): void;

  getBrand3(): string;
  setBrand3(value: string): void;

  getModel3(): string;
  setModel3(value: string): void;

  getSerial3(): string;
  setSerial3(value: string): void;

  getFilterSize(): string;
  setFilterSize(value: string): void;

  getLocation(): string;
  setLocation(value: string): void;

  getNotes(): string;
  setNotes(value: string): void;

  getBeltSize(): string;
  setBeltSize(value: string): void;

  getFilterWidth(): string;
  setFilterWidth(value: string): void;

  getFilterLength(): string;
  setFilterLength(value: string): void;

  getFilterThickness(): string;
  setFilterThickness(value: string): void;

  getFilterQty(): string;
  setFilterQty(value: string): void;

  getFilterPartNumber(): string;
  setFilterPartNumber(value: string): void;

  getFilterVendor(): string;
  setFilterVendor(value: string): void;

  getSortOrder(): number;
  setSortOrder(value: number): void;

  getSystemReadingsTypeId(): number;
  setSystemReadingsTypeId(value: number): void;

  getIsActive(): number;
  setIsActive(value: number): void;

  getRefrigerantType(): number;
  setRefrigerantType(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceItem.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceItem): ServiceItem.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServiceItem, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceItem;
  static deserializeBinaryFromReader(message: ServiceItem, reader: jspb.BinaryReader): ServiceItem;
}

export namespace ServiceItem {
  export type AsObject = {
    id: number,
    propertyId: number,
    type: string,
    item: string,
    brand: string,
    startDate: string,
    model: string,
    serial: string,
    item2: string,
    brand2: string,
    model2: string,
    serial2: string,
    item3: string,
    brand3: string,
    model3: string,
    serial3: string,
    filterSize: string,
    location: string,
    notes: string,
    beltSize: string,
    filterWidth: string,
    filterLength: string,
    filterThickness: string,
    filterQty: string,
    filterPartNumber: string,
    filterVendor: string,
    sortOrder: number,
    systemReadingsTypeId: number,
    isActive: number,
    refrigerantType: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class ServiceItemList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<ServiceItem>;
  setResultsList(value: Array<ServiceItem>): void;
  addResults(value?: ServiceItem, index?: number): ServiceItem;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceItemList.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceItemList): ServiceItemList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServiceItemList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceItemList;
  static deserializeBinaryFromReader(message: ServiceItemList, reader: jspb.BinaryReader): ServiceItemList;
}

export namespace ServiceItemList {
  export type AsObject = {
    resultsList: Array<ServiceItem.AsObject>,
    totalCount: number,
  }
}

