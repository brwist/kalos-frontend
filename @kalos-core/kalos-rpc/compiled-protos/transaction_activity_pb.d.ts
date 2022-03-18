// package: 
// file: transaction_activity.proto

import * as jspb from "google-protobuf";
import * as common_pb from "./common_pb";

export class TransactionActivity extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getTransactionId(): number;
  setTransactionId(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  getStatusId(): number;
  setStatusId(value: number): void;

  getDescription(): string;
  setDescription(value: string): void;

  getTimestamp(): string;
  setTimestamp(value: string): void;

  getIsActive(): number;
  setIsActive(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionActivity.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionActivity): TransactionActivity.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransactionActivity, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionActivity;
  static deserializeBinaryFromReader(message: TransactionActivity, reader: jspb.BinaryReader): TransactionActivity;
}

export namespace TransactionActivity {
  export type AsObject = {
    id: number,
    transactionId: number,
    userId: number,
    statusId: number,
    description: string,
    timestamp: string,
    isActive: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class TransactionActivityList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<TransactionActivity>;
  setResultsList(value: Array<TransactionActivity>): void;
  addResults(value?: TransactionActivity, index?: number): TransactionActivity;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionActivityList.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionActivityList): TransactionActivityList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransactionActivityList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionActivityList;
  static deserializeBinaryFromReader(message: TransactionActivityList, reader: jspb.BinaryReader): TransactionActivityList;
}

export namespace TransactionActivityList {
  export type AsObject = {
    resultsList: Array<TransactionActivity.AsObject>,
    totalCount: number,
  }
}

export class MergeTransactionIds extends jspb.Message {
  getMergedtransaction(): number;
  setMergedtransaction(value: number): void;

  clearTransactionidlistList(): void;
  getTransactionidlistList(): Array<number>;
  setTransactionidlistList(value: Array<number>): void;
  addTransactionidlist(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MergeTransactionIds.AsObject;
  static toObject(includeInstance: boolean, msg: MergeTransactionIds): MergeTransactionIds.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MergeTransactionIds, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MergeTransactionIds;
  static deserializeBinaryFromReader(message: MergeTransactionIds, reader: jspb.BinaryReader): MergeTransactionIds;
}

export namespace MergeTransactionIds {
  export type AsObject = {
    mergedtransaction: number,
    transactionidlistList: Array<number>,
  }
}

