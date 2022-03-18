// package: 
// file: predict.proto

import * as jspb from "google-protobuf";

export class TransactionData extends jspb.Message {
  getVendor(): string;
  setVendor(value: string): void;

  getAmount(): number;
  setAmount(value: number): void;

  getNotes(): string;
  setNotes(value: string): void;

  getOwnerId(): number;
  setOwnerId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionData.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionData): TransactionData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransactionData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionData;
  static deserializeBinaryFromReader(message: TransactionData, reader: jspb.BinaryReader): TransactionData;
}

export namespace TransactionData {
  export type AsObject = {
    vendor: string,
    amount: number,
    notes: string,
    ownerId: number,
  }
}

export class Prediction extends jspb.Message {
  getPredicatedLabel(): string;
  setPredicatedLabel(value: string): void;

  getPredictedScoresMap(): jspb.Map<string, number>;
  clearPredictedScoresMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Prediction.AsObject;
  static toObject(includeInstance: boolean, msg: Prediction): Prediction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Prediction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Prediction;
  static deserializeBinaryFromReader(message: Prediction, reader: jspb.BinaryReader): Prediction;
}

export namespace Prediction {
  export type AsObject = {
    predicatedLabel: string,
    predictedScoresMap: Array<[string, number]>,
  }
}

