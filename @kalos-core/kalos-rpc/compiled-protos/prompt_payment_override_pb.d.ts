// package: 
// file: prompt_payment_override.proto

import * as jspb from "google-protobuf";

export class PromptPaymentOverride extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getEventId(): number;
  setEventId(value: number): void;

  getForceAward(): number;
  setForceAward(value: number): void;

  getForceForfeit(): number;
  setForceForfeit(value: number): void;

  getReason(): string;
  setReason(value: string): void;

  getDate(): string;
  setDate(value: string): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PromptPaymentOverride.AsObject;
  static toObject(includeInstance: boolean, msg: PromptPaymentOverride): PromptPaymentOverride.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PromptPaymentOverride, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PromptPaymentOverride;
  static deserializeBinaryFromReader(message: PromptPaymentOverride, reader: jspb.BinaryReader): PromptPaymentOverride;
}

export namespace PromptPaymentOverride {
  export type AsObject = {
    id: number,
    eventId: number,
    forceAward: number,
    forceForfeit: number,
    reason: string,
    date: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class PromptPaymentOverrideList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<PromptPaymentOverride>;
  setResultsList(value: Array<PromptPaymentOverride>): void;
  addResults(value?: PromptPaymentOverride, index?: number): PromptPaymentOverride;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PromptPaymentOverrideList.AsObject;
  static toObject(includeInstance: boolean, msg: PromptPaymentOverrideList): PromptPaymentOverrideList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PromptPaymentOverrideList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PromptPaymentOverrideList;
  static deserializeBinaryFromReader(message: PromptPaymentOverrideList, reader: jspb.BinaryReader): PromptPaymentOverrideList;
}

export namespace PromptPaymentOverrideList {
  export type AsObject = {
    resultsList: Array<PromptPaymentOverride.AsObject>,
    totalCount: number,
  }
}

