// package: 
// file: api_key.proto

import * as jspb from "google-protobuf";

export class ApiKey extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getTextId(): string;
  setTextId(value: string): void;

  getApiKey(): string;
  setApiKey(value: string): void;

  getApiEndpoint(): string;
  setApiEndpoint(value: string): void;

  getApiDescription(): string;
  setApiDescription(value: string): void;

  getApiUser(): number;
  setApiUser(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApiKey.AsObject;
  static toObject(includeInstance: boolean, msg: ApiKey): ApiKey.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ApiKey, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApiKey;
  static deserializeBinaryFromReader(message: ApiKey, reader: jspb.BinaryReader): ApiKey;
}

export namespace ApiKey {
  export type AsObject = {
    id: number,
    textId: string,
    apiKey: string,
    apiEndpoint: string,
    apiDescription: string,
    apiUser: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class ApiKeyList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<ApiKey>;
  setResultsList(value: Array<ApiKey>): void;
  addResults(value?: ApiKey, index?: number): ApiKey;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApiKeyList.AsObject;
  static toObject(includeInstance: boolean, msg: ApiKeyList): ApiKeyList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ApiKeyList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApiKeyList;
  static deserializeBinaryFromReader(message: ApiKeyList, reader: jspb.BinaryReader): ApiKeyList;
}

export namespace ApiKeyList {
  export type AsObject = {
    resultsList: Array<ApiKey.AsObject>,
    totalCount: number,
  }
}

