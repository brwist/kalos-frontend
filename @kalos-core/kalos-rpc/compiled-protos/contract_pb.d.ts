// package: 
// file: contract.proto

import * as jspb from "google-protobuf";

export class Contract extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  getNumber(): string;
  setNumber(value: string): void;

  getProperties(): string;
  setProperties(value: string): void;

  getDateCreated(): string;
  setDateCreated(value: string): void;

  getDateStarted(): string;
  setDateStarted(value: string): void;

  getDateEnded(): string;
  setDateEnded(value: string): void;

  getFrequency(): number;
  setFrequency(value: number): void;

  getGroupBilling(): number;
  setGroupBilling(value: number): void;

  getPaymentStatus(): string;
  setPaymentStatus(value: string): void;

  getPaymentTerms(): string;
  setPaymentTerms(value: string): void;

  getNotes(): string;
  setNotes(value: string): void;

  getPaymentType(): string;
  setPaymentType(value: string): void;

  getIsActive(): number;
  setIsActive(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  getOrderBy(): string;
  setOrderBy(value: string): void;

  getOrderDir(): string;
  setOrderDir(value: string): void;

  clearDateTargetList(): void;
  getDateTargetList(): Array<string>;
  setDateTargetList(value: Array<string>): void;
  addDateTarget(value: string, index?: number): string;

  clearDateRangeList(): void;
  getDateRangeList(): Array<string>;
  setDateRangeList(value: Array<string>): void;
  addDateRange(value: string, index?: number): string;

  getLastName(): string;
  setLastName(value: string): void;

  getBusinessName(): string;
  setBusinessName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Contract.AsObject;
  static toObject(includeInstance: boolean, msg: Contract): Contract.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Contract, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Contract;
  static deserializeBinaryFromReader(message: Contract, reader: jspb.BinaryReader): Contract;
}

export namespace Contract {
  export type AsObject = {
    id: number,
    userId: number,
    number: string,
    properties: string,
    dateCreated: string,
    dateStarted: string,
    dateEnded: string,
    frequency: number,
    groupBilling: number,
    paymentStatus: string,
    paymentTerms: string,
    notes: string,
    paymentType: string,
    isActive: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
    orderBy: string,
    orderDir: string,
    dateTargetList: Array<string>,
    dateRangeList: Array<string>,
    lastName: string,
    businessName: string,
  }
}

export class ContractList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<Contract>;
  setResultsList(value: Array<Contract>): void;
  addResults(value?: Contract, index?: number): Contract;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContractList.AsObject;
  static toObject(includeInstance: boolean, msg: ContractList): ContractList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ContractList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContractList;
  static deserializeBinaryFromReader(message: ContractList, reader: jspb.BinaryReader): ContractList;
}

export namespace ContractList {
  export type AsObject = {
    resultsList: Array<Contract.AsObject>,
    totalCount: number,
  }
}

