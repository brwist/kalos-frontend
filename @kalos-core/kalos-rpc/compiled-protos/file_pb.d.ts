// package: 
// file: file.proto

import * as jspb from "google-protobuf";

export class File extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getName(): string;
  setName(value: string): void;

  getBucket(): string;
  setBucket(value: string): void;

  getMimeType(): string;
  setMimeType(value: string): void;

  getCreateTime(): string;
  setCreateTime(value: string): void;

  getOwnerId(): number;
  setOwnerId(value: number): void;

  getEventId(): number;
  setEventId(value: number): void;

  getGeolocationLat(): number;
  setGeolocationLat(value: number): void;

  getGeolocationLng(): number;
  setGeolocationLng(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): File.AsObject;
  static toObject(includeInstance: boolean, msg: File): File.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: File, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): File;
  static deserializeBinaryFromReader(message: File, reader: jspb.BinaryReader): File;
}

export namespace File {
  export type AsObject = {
    id: number,
    name: string,
    bucket: string,
    mimeType: string,
    createTime: string,
    ownerId: number,
    eventId: number,
    geolocationLat: number,
    geolocationLng: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class FileList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<File>;
  setResultsList(value: Array<File>): void;
  addResults(value?: File, index?: number): File;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FileList.AsObject;
  static toObject(includeInstance: boolean, msg: FileList): FileList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FileList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FileList;
  static deserializeBinaryFromReader(message: FileList, reader: jspb.BinaryReader): FileList;
}

export namespace FileList {
  export type AsObject = {
    resultsList: Array<File.AsObject>,
    totalCount: number,
  }
}

