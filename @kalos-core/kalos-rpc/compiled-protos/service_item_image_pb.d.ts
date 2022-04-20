// package: 
// file: service_item_image.proto

import * as jspb from "google-protobuf";

export class ServiceItemImage extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getServiceItemId(): number;
  setServiceItemId(value: number): void;

  getImageTitle(): string;
  setImageTitle(value: string): void;

  getImageName(): string;
  setImageName(value: string): void;

  getDateCreated(): string;
  setDateCreated(value: string): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceItemImage.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceItemImage): ServiceItemImage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServiceItemImage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceItemImage;
  static deserializeBinaryFromReader(message: ServiceItemImage, reader: jspb.BinaryReader): ServiceItemImage;
}

export namespace ServiceItemImage {
  export type AsObject = {
    id: number,
    serviceItemId: number,
    imageTitle: string,
    imageName: string,
    dateCreated: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class ServiceItemImageList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<ServiceItemImage>;
  setResultsList(value: Array<ServiceItemImage>): void;
  addResults(value?: ServiceItemImage, index?: number): ServiceItemImage;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceItemImageList.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceItemImageList): ServiceItemImageList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServiceItemImageList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceItemImageList;
  static deserializeBinaryFromReader(message: ServiceItemImageList, reader: jspb.BinaryReader): ServiceItemImageList;
}

export namespace ServiceItemImageList {
  export type AsObject = {
    resultsList: Array<ServiceItemImage.AsObject>,
    totalCount: number,
  }
}

