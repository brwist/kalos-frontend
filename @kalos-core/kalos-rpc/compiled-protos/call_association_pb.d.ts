// package: 
// file: call_association.proto

import * as jspb from "google-protobuf";

export class CallAssociation extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getCustomerId(): number;
  setCustomerId(value: number): void;

  getPhoneCallId(): number;
  setPhoneCallId(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CallAssociation.AsObject;
  static toObject(includeInstance: boolean, msg: CallAssociation): CallAssociation.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CallAssociation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CallAssociation;
  static deserializeBinaryFromReader(message: CallAssociation, reader: jspb.BinaryReader): CallAssociation;
}

export namespace CallAssociation {
  export type AsObject = {
    id: number,
    customerId: number,
    phoneCallId: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class CallAssociationList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<CallAssociation>;
  setResultsList(value: Array<CallAssociation>): void;
  addResults(value?: CallAssociation, index?: number): CallAssociation;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CallAssociationList.AsObject;
  static toObject(includeInstance: boolean, msg: CallAssociationList): CallAssociationList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CallAssociationList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CallAssociationList;
  static deserializeBinaryFromReader(message: CallAssociationList, reader: jspb.BinaryReader): CallAssociationList;
}

export namespace CallAssociationList {
  export type AsObject = {
    resultsList: Array<CallAssociation.AsObject>,
    totalCount: number,
  }
}

