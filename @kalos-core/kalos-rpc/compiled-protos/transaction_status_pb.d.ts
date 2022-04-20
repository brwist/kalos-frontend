// package: 
// file: transaction_status.proto

import * as jspb from "google-protobuf";

export class TransactionStatus extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getDescription(): string;
  setDescription(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionStatus.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionStatus): TransactionStatus.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransactionStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionStatus;
  static deserializeBinaryFromReader(message: TransactionStatus, reader: jspb.BinaryReader): TransactionStatus;
}

export namespace TransactionStatus {
  export type AsObject = {
    id: number,
    description: string,
  }
}

export class TransactionStatusList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<TransactionStatus>;
  setResultsList(value: Array<TransactionStatus>): void;
  addResults(value?: TransactionStatus, index?: number): TransactionStatus;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionStatusList.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionStatusList): TransactionStatusList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransactionStatusList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionStatusList;
  static deserializeBinaryFromReader(message: TransactionStatusList, reader: jspb.BinaryReader): TransactionStatusList;
}

export namespace TransactionStatusList {
  export type AsObject = {
    resultsList: Array<TransactionStatus.AsObject>,
  }
}

