// package: 
// file: default_view.proto

import * as jspb from "google-protobuf";

export class DefaultView extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  getViewType(): string;
  setViewType(value: string): void;

  getDefaultView(): string;
  setDefaultView(value: string): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DefaultView.AsObject;
  static toObject(includeInstance: boolean, msg: DefaultView): DefaultView.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DefaultView, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DefaultView;
  static deserializeBinaryFromReader(message: DefaultView, reader: jspb.BinaryReader): DefaultView;
}

export namespace DefaultView {
  export type AsObject = {
    id: number,
    userId: number,
    viewType: string,
    defaultView: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class DefaultViewList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<DefaultView>;
  setResultsList(value: Array<DefaultView>): void;
  addResults(value?: DefaultView, index?: number): DefaultView;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DefaultViewList.AsObject;
  static toObject(includeInstance: boolean, msg: DefaultViewList): DefaultViewList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DefaultViewList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DefaultViewList;
  static deserializeBinaryFromReader(message: DefaultViewList, reader: jspb.BinaryReader): DefaultViewList;
}

export namespace DefaultViewList {
  export type AsObject = {
    resultsList: Array<DefaultView.AsObject>,
    totalCount: number,
  }
}

