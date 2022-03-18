// package: 
// file: prompt_payment_rebate.proto

import * as jspb from "google-protobuf";

export class PromptPaymentRebate extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getPaymentId(): number;
  setPaymentId(value: number): void;

  getEventId(): number;
  setEventId(value: number): void;

  getAmount(): number;
  setAmount(value: number): void;

  getDate(): string;
  setDate(value: string): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PromptPaymentRebate.AsObject;
  static toObject(includeInstance: boolean, msg: PromptPaymentRebate): PromptPaymentRebate.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PromptPaymentRebate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PromptPaymentRebate;
  static deserializeBinaryFromReader(message: PromptPaymentRebate, reader: jspb.BinaryReader): PromptPaymentRebate;
}

export namespace PromptPaymentRebate {
  export type AsObject = {
    id: number,
    paymentId: number,
    eventId: number,
    amount: number,
    date: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class PromptPaymentRebateList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<PromptPaymentRebate>;
  setResultsList(value: Array<PromptPaymentRebate>): void;
  addResults(value?: PromptPaymentRebate, index?: number): PromptPaymentRebate;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PromptPaymentRebateList.AsObject;
  static toObject(includeInstance: boolean, msg: PromptPaymentRebateList): PromptPaymentRebateList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PromptPaymentRebateList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PromptPaymentRebateList;
  static deserializeBinaryFromReader(message: PromptPaymentRebateList, reader: jspb.BinaryReader): PromptPaymentRebateList;
}

export namespace PromptPaymentRebateList {
  export type AsObject = {
    resultsList: Array<PromptPaymentRebate.AsObject>,
    totalCount: number,
  }
}

