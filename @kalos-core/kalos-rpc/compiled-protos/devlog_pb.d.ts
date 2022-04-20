// package: 
// file: devlog.proto

import * as jspb from "google-protobuf";
import * as user_pb from "./user_pb";

export class Devlog extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getDescription(): string;
  setDescription(value: string): void;

  getJobId(): number;
  setJobId(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  getIsError(): number;
  setIsError(value: number): void;

  getTimestamp(): string;
  setTimestamp(value: string): void;

  getErrorSeverity(): number;
  setErrorSeverity(value: number): void;

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

  getDateTarget(): string;
  setDateTarget(value: string): void;

  clearNotEqualsList(): void;
  getNotEqualsList(): Array<string>;
  setNotEqualsList(value: Array<string>): void;
  addNotEquals(value: string, index?: number): string;

  getTransactionId(): number;
  setTransactionId(value: number): void;

  getEventId(): number;
  setEventId(value: number): void;

  getPropertyId(): number;
  setPropertyId(value: number): void;

  getTripId(): number;
  setTripId(value: number): void;

  getPerdiemId(): number;
  setPerdiemId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Devlog.AsObject;
  static toObject(includeInstance: boolean, msg: Devlog): Devlog.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Devlog, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Devlog;
  static deserializeBinaryFromReader(message: Devlog, reader: jspb.BinaryReader): Devlog;
}

export namespace Devlog {
  export type AsObject = {
    id: number,
    description: string,
    jobId: number,
    userId: number,
    isError: number,
    timestamp: string,
    errorSeverity: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
    orderBy: string,
    orderDir: string,
    dateRangeList: Array<string>,
    withUser: boolean,
    user?: user_pb.User.AsObject,
    dateTarget: string,
    notEqualsList: Array<string>,
    transactionId: number,
    eventId: number,
    propertyId: number,
    tripId: number,
    perdiemId: number,
  }
}

export class DevlogList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<Devlog>;
  setResultsList(value: Array<Devlog>): void;
  addResults(value?: Devlog, index?: number): Devlog;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DevlogList.AsObject;
  static toObject(includeInstance: boolean, msg: DevlogList): DevlogList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DevlogList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DevlogList;
  static deserializeBinaryFromReader(message: DevlogList, reader: jspb.BinaryReader): DevlogList;
}

export namespace DevlogList {
  export type AsObject = {
    resultsList: Array<Devlog.AsObject>,
    totalCount: number,
  }
}

