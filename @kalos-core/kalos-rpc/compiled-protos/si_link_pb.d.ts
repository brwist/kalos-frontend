// package: 
// file: si_link.proto

import * as jspb from "google-protobuf";

export class SiLink extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getServiceItemId(): number;
  setServiceItemId(value: number): void;

  getUrl(): string;
  setUrl(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SiLink.AsObject;
  static toObject(includeInstance: boolean, msg: SiLink): SiLink.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SiLink, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SiLink;
  static deserializeBinaryFromReader(message: SiLink, reader: jspb.BinaryReader): SiLink;
}

export namespace SiLink {
  export type AsObject = {
    id: number,
    serviceItemId: number,
    url: string,
    description: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class SiLinkList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<SiLink>;
  setResultsList(value: Array<SiLink>): void;
  addResults(value?: SiLink, index?: number): SiLink;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SiLinkList.AsObject;
  static toObject(includeInstance: boolean, msg: SiLinkList): SiLinkList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SiLinkList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SiLinkList;
  static deserializeBinaryFromReader(message: SiLinkList, reader: jspb.BinaryReader): SiLinkList;
}

export namespace SiLinkList {
  export type AsObject = {
    resultsList: Array<SiLink.AsObject>,
    totalCount: number,
  }
}

