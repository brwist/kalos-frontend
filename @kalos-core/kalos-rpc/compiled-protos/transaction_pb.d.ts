// package: 
// file: transaction.proto

import * as jspb from "google-protobuf";
import * as transaction_document_pb from "./transaction_document_pb";
import * as transaction_activity_pb from "./transaction_activity_pb";
import * as transaction_account_pb from "./transaction_account_pb";

export class Transaction extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getJobId(): number;
  setJobId(value: number): void;

  getDepartmentId(): number;
  setDepartmentId(value: number): void;

  getOwnerId(): number;
  setOwnerId(value: number): void;

  getVendor(): string;
  setVendor(value: string): void;

  getCostCenterId(): number;
  setCostCenterId(value: number): void;

  getDescription(): string;
  setDescription(value: string): void;

  getAmount(): number;
  setAmount(value: number): void;

  getTimestamp(): string;
  setTimestamp(value: string): void;

  getNotes(): string;
  setNotes(value: string): void;

  getIsActive(): number;
  setIsActive(value: number): void;

  getStatusId(): number;
  setStatusId(value: number): void;

  getStatus(): string;
  setStatus(value: string): void;

  getOwnerName(): string;
  setOwnerName(value: string): void;

  getCardUsed(): string;
  setCardUsed(value: string): void;

  clearDocumentsList(): void;
  getDocumentsList(): Array<transaction_document_pb.TransactionDocument>;
  setDocumentsList(value: Array<transaction_document_pb.TransactionDocument>): void;
  addDocuments(value?: transaction_document_pb.TransactionDocument, index?: number): transaction_document_pb.TransactionDocument;

  clearActivityLogList(): void;
  getActivityLogList(): Array<transaction_activity_pb.TransactionActivity>;
  setActivityLogList(value: Array<transaction_activity_pb.TransactionActivity>): void;
  addActivityLog(value?: transaction_activity_pb.TransactionActivity, index?: number): transaction_activity_pb.TransactionActivity;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  hasDepartment(): boolean;
  clearDepartment(): void;
  getDepartment(): TxnDepartment | undefined;
  setDepartment(value?: TxnDepartment): void;

  hasCostCenter(): boolean;
  clearCostCenter(): void;
  getCostCenter(): transaction_account_pb.TransactionAccount | undefined;
  setCostCenter(value?: transaction_account_pb.TransactionAccount): void;

  getOrderBy(): string;
  setOrderBy(value: string): void;

  getOrderDir(): string;
  setOrderDir(value: string): void;

  getIsAudited(): boolean;
  setIsAudited(value: boolean): void;

  getIsRecorded(): boolean;
  setIsRecorded(value: boolean): void;

  getSearchPhrase(): string;
  setSearchPhrase(value: string): void;

  getArtificalId(): string;
  setArtificalId(value: string): void;

  getDepartmentString(): string;
  setDepartmentString(value: string): void;

  getCostCenterString(): string;
  setCostCenterString(value: string): void;

  getActivityLogString(): string;
  setActivityLogString(value: string): void;

  clearNotEqualsList(): void;
  getNotEqualsList(): Array<string>;
  setNotEqualsList(value: Array<string>): void;
  addNotEquals(value: string, index?: number): string;

  getDepartmentIdList(): string;
  setDepartmentIdList(value: string): void;

  getVendorCategory(): string;
  setVendorCategory(value: string): void;

  getWithoutLimit(): boolean;
  setWithoutLimit(value: boolean): void;

  getAssignedEmployeeId(): number;
  setAssignedEmployeeId(value: number): void;

  getAssignedEmployeeName(): string;
  setAssignedEmployeeName(value: string): void;

  getOrderNumber(): string;
  setOrderNumber(value: string): void;

  getIsBillingRecorded(): boolean;
  setIsBillingRecorded(value: boolean): void;

  getInvoiceNumber(): string;
  setInvoiceNumber(value: string): void;

  getStateTaxApplied(): boolean;
  setStateTaxApplied(value: boolean): void;

  getVendorId(): number;
  setVendorId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Transaction.AsObject;
  static toObject(includeInstance: boolean, msg: Transaction): Transaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Transaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Transaction;
  static deserializeBinaryFromReader(message: Transaction, reader: jspb.BinaryReader): Transaction;
}

export namespace Transaction {
  export type AsObject = {
    id: number,
    jobId: number,
    departmentId: number,
    ownerId: number,
    vendor: string,
    costCenterId: number,
    description: string,
    amount: number,
    timestamp: string,
    notes: string,
    isActive: number,
    statusId: number,
    status: string,
    ownerName: string,
    cardUsed: string,
    documentsList: Array<transaction_document_pb.TransactionDocument.AsObject>,
    activityLogList: Array<transaction_activity_pb.TransactionActivity.AsObject>,
    pageNumber: number,
    fieldMaskList: Array<string>,
    department?: TxnDepartment.AsObject,
    costCenter?: transaction_account_pb.TransactionAccount.AsObject,
    orderBy: string,
    orderDir: string,
    isAudited: boolean,
    isRecorded: boolean,
    searchPhrase: string,
    artificalId: string,
    departmentString: string,
    costCenterString: string,
    activityLogString: string,
    notEqualsList: Array<string>,
    departmentIdList: string,
    vendorCategory: string,
    withoutLimit: boolean,
    assignedEmployeeId: number,
    assignedEmployeeName: string,
    orderNumber: string,
    isBillingRecorded: boolean,
    invoiceNumber: string,
    stateTaxApplied: boolean,
    vendorId: number,
  }
}

export class TransactionList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<Transaction>;
  setResultsList(value: Array<Transaction>): void;
  addResults(value?: Transaction, index?: number): Transaction;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionList.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionList): TransactionList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransactionList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionList;
  static deserializeBinaryFromReader(message: TransactionList, reader: jspb.BinaryReader): TransactionList;
}

export namespace TransactionList {
  export type AsObject = {
    resultsList: Array<Transaction.AsObject>,
    totalCount: number,
  }
}

export class RecordPageReq extends jspb.Message {
  clearTransactionIdsList(): void;
  getTransactionIdsList(): Array<number>;
  setTransactionIdsList(value: Array<number>): void;
  addTransactionIds(value: number, index?: number): number;

  hasRequestData(): boolean;
  clearRequestData(): void;
  getRequestData(): Transaction | undefined;
  setRequestData(value?: Transaction): void;

  getAdminId(): number;
  setAdminId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RecordPageReq.AsObject;
  static toObject(includeInstance: boolean, msg: RecordPageReq): RecordPageReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RecordPageReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RecordPageReq;
  static deserializeBinaryFromReader(message: RecordPageReq, reader: jspb.BinaryReader): RecordPageReq;
}

export namespace RecordPageReq {
  export type AsObject = {
    transactionIdsList: Array<number>,
    requestData?: Transaction.AsObject,
    adminId: number,
  }
}

export class TxnDepartment extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getDescription(): string;
  setDescription(value: string): void;

  getManagerId(): number;
  setManagerId(value: number): void;

  getClassification(): string;
  setClassification(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TxnDepartment.AsObject;
  static toObject(includeInstance: boolean, msg: TxnDepartment): TxnDepartment.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TxnDepartment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TxnDepartment;
  static deserializeBinaryFromReader(message: TxnDepartment, reader: jspb.BinaryReader): TxnDepartment;
}

export namespace TxnDepartment {
  export type AsObject = {
    id: number,
    description: string,
    managerId: number,
    classification: string,
  }
}

