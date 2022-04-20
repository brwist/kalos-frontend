// package: 
// file: prop_link.proto

import * as jspb from "google-protobuf";

export class PropLink extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getPropertyId(): number;
  setPropertyId(value: number): void;

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
  toObject(includeInstance?: boolean): PropLink.AsObject;
  static toObject(includeInstance: boolean, msg: PropLink): PropLink.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PropLink, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PropLink;
  static deserializeBinaryFromReader(message: PropLink, reader: jspb.BinaryReader): PropLink;
}

export namespace PropLink {
  export type AsObject = {
    id: number,
    propertyId: number,
    url: string,
    description: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class PropLinkList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<PropLink>;
  setResultsList(value: Array<PropLink>): void;
  addResults(value?: PropLink, index?: number): PropLink;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PropLinkList.AsObject;
  static toObject(includeInstance: boolean, msg: PropLinkList): PropLinkList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PropLinkList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PropLinkList;
  static deserializeBinaryFromReader(message: PropLinkList, reader: jspb.BinaryReader): PropLinkList;
}

export namespace PropLinkList {
  export type AsObject = {
    resultsList: Array<PropLink.AsObject>,
    totalCount: number,
  }
}

