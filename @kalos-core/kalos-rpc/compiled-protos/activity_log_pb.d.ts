// package: 
// file: activity_log.proto

import * as jspb from "google-protobuf";
import * as user_pb from "./user_pb";

export class ActivityLog extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  getActivityName(): string;
  setActivityName(value: string): void;

  getActivityDate(): string;
  setActivityDate(value: string): void;

  getPropertyId(): number;
  setPropertyId(value: number): void;

  getContractId(): number;
  setContractId(value: number): void;

  getGeolocationLat(): number;
  setGeolocationLat(value: number): void;

  getGeolocationLng(): number;
  setGeolocationLng(value: number): void;

  getCustomerId(): number;
  setCustomerId(value: number): void;

  getTaskId(): number;
  setTaskId(value: number): void;

  getTimesheetLineId(): number;
  setTimesheetLineId(value: number): void;

  getEventId(): number;
  setEventId(value: number): void;

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

  getWithUser(): boolean;
  setWithUser(value: boolean): void;

  hasUser(): boolean;
  clearUser(): void;
  getUser(): user_pb.User | undefined;
  setUser(value?: user_pb.User): void;

  getTimeoffRequestId(): number;
  setTimeoffRequestId(value: number): void;

  getDateTarget(): string;
  setDateTarget(value: string): void;

  clearNotEqualsList(): void;
  getNotEqualsList(): Array<string>;
  setNotEqualsList(value: Array<string>): void;
  addNotEquals(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ActivityLog.AsObject;
  static toObject(includeInstance: boolean, msg: ActivityLog): ActivityLog.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ActivityLog, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ActivityLog;
  static deserializeBinaryFromReader(message: ActivityLog, reader: jspb.BinaryReader): ActivityLog;
}

export namespace ActivityLog {
  export type AsObject = {
    id: number,
    userId: number,
    activityName: string,
    activityDate: string,
    propertyId: number,
    contractId: number,
    geolocationLat: number,
    geolocationLng: number,
    customerId: number,
    taskId: number,
    timesheetLineId: number,
    eventId: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
    orderBy: string,
    orderDir: string,
    dateRangeList: Array<string>,
    withUser: boolean,
    user?: user_pb.User.AsObject,
    timeoffRequestId: number,
    dateTarget: string,
    notEqualsList: Array<string>,
  }
}

export class ActivityLogList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<ActivityLog>;
  setResultsList(value: Array<ActivityLog>): void;
  addResults(value?: ActivityLog, index?: number): ActivityLog;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ActivityLogList.AsObject;
  static toObject(includeInstance: boolean, msg: ActivityLogList): ActivityLogList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ActivityLogList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ActivityLogList;
  static deserializeBinaryFromReader(message: ActivityLogList, reader: jspb.BinaryReader): ActivityLogList;
}

export namespace ActivityLogList {
  export type AsObject = {
    resultsList: Array<ActivityLog.AsObject>,
    totalCount: number,
  }
}

