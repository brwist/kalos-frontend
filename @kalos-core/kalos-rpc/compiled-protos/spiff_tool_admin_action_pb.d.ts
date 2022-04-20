// package: 
// file: spiff_tool_admin_action.proto

import * as jspb from "google-protobuf";

export class SpiffToolAdminAction extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getTaskId(): number;
  setTaskId(value: number): void;

  getReviewedBy(): string;
  setReviewedBy(value: string): void;

  getStatus(): number;
  setStatus(value: number): void;

  getReason(): string;
  setReason(value: string): void;

  getDecisionDate(): string;
  setDecisionDate(value: string): void;

  getCreatedDate(): string;
  setCreatedDate(value: string): void;

  getGrantedDate(): string;
  setGrantedDate(value: string): void;

  getRevokedDate(): string;
  setRevokedDate(value: string): void;

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

  clearDateRangeList(): void;
  getDateRangeList(): Array<string>;
  setDateRangeList(value: Array<string>): void;
  addDateRange(value: string, index?: number): string;

  clearDateTargetList(): void;
  getDateTargetList(): Array<string>;
  setDateTargetList(value: Array<string>): void;
  addDateTarget(value: string, index?: number): string;

  getGroupBy(): string;
  setGroupBy(value: string): void;

  getDateProcessed(): string;
  setDateProcessed(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SpiffToolAdminAction.AsObject;
  static toObject(includeInstance: boolean, msg: SpiffToolAdminAction): SpiffToolAdminAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SpiffToolAdminAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SpiffToolAdminAction;
  static deserializeBinaryFromReader(message: SpiffToolAdminAction, reader: jspb.BinaryReader): SpiffToolAdminAction;
}

export namespace SpiffToolAdminAction {
  export type AsObject = {
    id: number,
    taskId: number,
    reviewedBy: string,
    status: number,
    reason: string,
    decisionDate: string,
    createdDate: string,
    grantedDate: string,
    revokedDate: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
    orderBy: string,
    orderDir: string,
    dateRangeList: Array<string>,
    dateTargetList: Array<string>,
    groupBy: string,
    dateProcessed: string,
  }
}

export class SpiffToolAdminActionList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<SpiffToolAdminAction>;
  setResultsList(value: Array<SpiffToolAdminAction>): void;
  addResults(value?: SpiffToolAdminAction, index?: number): SpiffToolAdminAction;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SpiffToolAdminActionList.AsObject;
  static toObject(includeInstance: boolean, msg: SpiffToolAdminActionList): SpiffToolAdminActionList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SpiffToolAdminActionList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SpiffToolAdminActionList;
  static deserializeBinaryFromReader(message: SpiffToolAdminActionList, reader: jspb.BinaryReader): SpiffToolAdminActionList;
}

export namespace SpiffToolAdminActionList {
  export type AsObject = {
    resultsList: Array<SpiffToolAdminAction.AsObject>,
    totalCount: number,
  }
}

