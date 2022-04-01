// package: 
// file: transaction_account.proto

import * as jspb from "google-protobuf";

export class TransactionAccount extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getAccountCategory(): number;
  setAccountCategory(value: number): void;

  getThresholdAmount(): number;
  setThresholdAmount(value: number): void;

  getDescription(): string;
  setDescription(value: string): void;

  getNeedsPo(): number;
  setNeedsPo(value: number): void;

  getIsActive(): number;
  setIsActive(value: number): void;

  getPopularity(): number;
  setPopularity(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionAccount.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionAccount): TransactionAccount.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransactionAccount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionAccount;
  static deserializeBinaryFromReader(message: TransactionAccount, reader: jspb.BinaryReader): TransactionAccount;
}

export namespace TransactionAccount {
  export type AsObject = {
    id: number,
    accountCategory: number,
    thresholdAmount: number,
    description: string,
    needsPo: number,
    isActive: number,
    popularity: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class TransactionAccountList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<TransactionAccount>;
  setResultsList(value: Array<TransactionAccount>): void;
  addResults(value?: TransactionAccount, index?: number): TransactionAccount;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionAccountList.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionAccountList): TransactionAccountList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransactionAccountList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionAccountList;
  static deserializeBinaryFromReader(message: TransactionAccountList, reader: jspb.BinaryReader): TransactionAccountList;
}

export namespace TransactionAccountList {
  export type AsObject = {
    resultsList: Array<TransactionAccount.AsObject>,
    totalCount: number,
  }
}

