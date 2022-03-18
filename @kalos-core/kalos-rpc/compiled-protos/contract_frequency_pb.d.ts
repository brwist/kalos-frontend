// package: 
// file: contract_frequency.proto

import * as jspb from "google-protobuf";

export class ContractFrequency extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getName(): string;
  setName(value: string): void;

  getInterval(): number;
  setInterval(value: number): void;

  getMaintenanceCount(): number;
  setMaintenanceCount(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContractFrequency.AsObject;
  static toObject(includeInstance: boolean, msg: ContractFrequency): ContractFrequency.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ContractFrequency, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContractFrequency;
  static deserializeBinaryFromReader(message: ContractFrequency, reader: jspb.BinaryReader): ContractFrequency;
}

export namespace ContractFrequency {
  export type AsObject = {
    id: number,
    name: string,
    interval: number,
    maintenanceCount: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class ContractFrequencyList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<ContractFrequency>;
  setResultsList(value: Array<ContractFrequency>): void;
  addResults(value?: ContractFrequency, index?: number): ContractFrequency;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContractFrequencyList.AsObject;
  static toObject(includeInstance: boolean, msg: ContractFrequencyList): ContractFrequencyList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ContractFrequencyList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContractFrequencyList;
  static deserializeBinaryFromReader(message: ContractFrequencyList, reader: jspb.BinaryReader): ContractFrequencyList;
}

export namespace ContractFrequencyList {
  export type AsObject = {
    resultsList: Array<ContractFrequency.AsObject>,
    totalCount: number,
  }
}

