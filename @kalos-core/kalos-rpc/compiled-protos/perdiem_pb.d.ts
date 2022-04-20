// package: 
// file: perdiem.proto

import * as jspb from "google-protobuf";
import * as timesheet_department_pb from "./timesheet_department_pb";
import * as common_pb from "./common_pb";

export class SQLRequest extends jspb.Message {
  hasData(): boolean;
  clearData(): void;
  getData(): PerDiem | undefined;
  setData(value?: PerDiem): void;

  getRequestType(): string;
  setRequestType(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SQLRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SQLRequest): SQLRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SQLRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SQLRequest;
  static deserializeBinaryFromReader(message: SQLRequest, reader: jspb.BinaryReader): SQLRequest;
}

export namespace SQLRequest {
  export type AsObject = {
    data?: PerDiem.AsObject,
    requestType: string,
  }
}

export class PerDiemReportRequest extends jspb.Message {
  clearWeekList(): void;
  getWeekList(): Array<string>;
  setWeekList(value: Array<string>): void;
  addWeek(value: string, index?: number): string;

  clearUserIdList(): void;
  getUserIdList(): Array<number>;
  setUserIdList(value: Array<number>): void;
  addUserId(value: number, index?: number): number;

  clearDepartmentIdList(): void;
  getDepartmentIdList(): Array<number>;
  setDepartmentIdList(value: Array<number>): void;
  addDepartmentId(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PerDiemReportRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PerDiemReportRequest): PerDiemReportRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PerDiemReportRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PerDiemReportRequest;
  static deserializeBinaryFromReader(message: PerDiemReportRequest, reader: jspb.BinaryReader): PerDiemReportRequest;
}

export namespace PerDiemReportRequest {
  export type AsObject = {
    weekList: Array<string>,
    userIdList: Array<number>,
    departmentIdList: Array<number>,
  }
}

export class PerDiem extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getDateStarted(): string;
  setDateStarted(value: string): void;

  getUserId(): number;
  setUserId(value: number): void;

  getDepartmentId(): number;
  setDepartmentId(value: number): void;

  getNotes(): string;
  setNotes(value: string): void;

  getOwnerName(): string;
  setOwnerName(value: string): void;

  getIsActive(): boolean;
  setIsActive(value: boolean): void;

  hasDepartment(): boolean;
  clearDepartment(): void;
  getDepartment(): timesheet_department_pb.TimesheetDepartment | undefined;
  setDepartment(value?: timesheet_department_pb.TimesheetDepartment): void;

  getWithRows(): boolean;
  setWithRows(value: boolean): void;

  clearRowsList(): void;
  getRowsList(): Array<PerDiemRow>;
  setRowsList(value: Array<PerDiemRow>): void;
  addRows(value?: PerDiemRow, index?: number): PerDiemRow;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  getDateSubmitted(): string;
  setDateSubmitted(value: string): void;

  getDateApproved(): string;
  setDateApproved(value: string): void;

  getApprovedById(): number;
  setApprovedById(value: number): void;

  getApprovedByName(): string;
  setApprovedByName(value: string): void;

  getNeedsAuditing(): boolean;
  setNeedsAuditing(value: boolean): void;

  getWithoutLimit(): boolean;
  setWithoutLimit(value: boolean): void;

  getPayrollProcessed(): boolean;
  setPayrollProcessed(value: boolean): void;

  clearNotEqualsList(): void;
  getNotEqualsList(): Array<string>;
  setNotEqualsList(value: Array<string>): void;
  addNotEquals(value: string, index?: number): string;

  hasReferenceRow(): boolean;
  clearReferenceRow(): void;
  getReferenceRow(): PerDiemRow | undefined;
  setReferenceRow(value?: PerDiemRow): void;

  clearDateRangeList(): void;
  getDateRangeList(): Array<string>;
  setDateRangeList(value: Array<string>): void;
  addDateRange(value: string, index?: number): string;

  clearDateTargetList(): void;
  getDateTargetList(): Array<string>;
  setDateTargetList(value: Array<string>): void;
  addDateTarget(value: string, index?: number): string;

  getDateProcessed(): string;
  setDateProcessed(value: string): void;

  getAmountProcessedLodging(): number;
  setAmountProcessedLodging(value: number): void;

  getAmountProcessedMeals(): number;
  setAmountProcessedMeals(value: number): void;

  getOrderBy(): string;
  setOrderBy(value: string): void;

  getOrderDir(): string;
  setOrderDir(value: string): void;

  getGroupBy(): string;
  setGroupBy(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PerDiem.AsObject;
  static toObject(includeInstance: boolean, msg: PerDiem): PerDiem.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PerDiem, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PerDiem;
  static deserializeBinaryFromReader(message: PerDiem, reader: jspb.BinaryReader): PerDiem;
}

export namespace PerDiem {
  export type AsObject = {
    id: number,
    dateStarted: string,
    userId: number,
    departmentId: number,
    notes: string,
    ownerName: string,
    isActive: boolean,
    department?: timesheet_department_pb.TimesheetDepartment.AsObject,
    withRows: boolean,
    rowsList: Array<PerDiemRow.AsObject>,
    fieldMaskList: Array<string>,
    pageNumber: number,
    dateSubmitted: string,
    dateApproved: string,
    approvedById: number,
    approvedByName: string,
    needsAuditing: boolean,
    withoutLimit: boolean,
    payrollProcessed: boolean,
    notEqualsList: Array<string>,
    referenceRow?: PerDiemRow.AsObject,
    dateRangeList: Array<string>,
    dateTargetList: Array<string>,
    dateProcessed: string,
    amountProcessedLodging: number,
    amountProcessedMeals: number,
    orderBy: string,
    orderDir: string,
    groupBy: string,
  }
}

export class PerDiemList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<PerDiem>;
  setResultsList(value: Array<PerDiem>): void;
  addResults(value?: PerDiem, index?: number): PerDiem;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PerDiemList.AsObject;
  static toObject(includeInstance: boolean, msg: PerDiemList): PerDiemList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PerDiemList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PerDiemList;
  static deserializeBinaryFromReader(message: PerDiemList, reader: jspb.BinaryReader): PerDiemList;
}

export namespace PerDiemList {
  export type AsObject = {
    resultsList: Array<PerDiem.AsObject>,
    totalCount: number,
  }
}

export class PerDiemRow extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getPerDiemId(): number;
  setPerDiemId(value: number): void;

  getZipCode(): string;
  setZipCode(value: string): void;

  getServiceCallId(): number;
  setServiceCallId(value: number): void;

  getNotes(): string;
  setNotes(value: string): void;

  getDateString(): string;
  setDateString(value: string): void;

  getMealsOnly(): boolean;
  setMealsOnly(value: boolean): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PerDiemRow.AsObject;
  static toObject(includeInstance: boolean, msg: PerDiemRow): PerDiemRow.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PerDiemRow, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PerDiemRow;
  static deserializeBinaryFromReader(message: PerDiemRow, reader: jspb.BinaryReader): PerDiemRow;
}

export namespace PerDiemRow {
  export type AsObject = {
    id: number,
    perDiemId: number,
    zipCode: string,
    serviceCallId: number,
    notes: string,
    dateString: string,
    mealsOnly: boolean,
    fieldMaskList: Array<string>,
  }
}

export class Trip extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getDistanceInMiles(): number;
  setDistanceInMiles(value: number): void;

  getOriginAddress(): string;
  setOriginAddress(value: string): void;

  getDestinationAddress(): string;
  setDestinationAddress(value: string): void;

  getPerDiemRowId(): number;
  setPerDiemRowId(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getUserId(): number;
  setUserId(value: number): void;

  getNotes(): string;
  setNotes(value: string): void;

  getPayrollProcessed(): boolean;
  setPayrollProcessed(value: boolean): void;

  getPage(): number;
  setPage(value: number): void;

  getApproved(): boolean;
  setApproved(value: boolean): void;

  getDepartmentId(): number;
  setDepartmentId(value: number): void;

  getDate(): string;
  setDate(value: string): void;

  getJobNumber(): number;
  setJobNumber(value: number): void;

  getCalculatedDurationInSeconds(): number;
  setCalculatedDurationInSeconds(value: number): void;

  clearNotEqualsList(): void;
  getNotEqualsList(): Array<string>;
  setNotEqualsList(value: Array<string>): void;
  addNotEquals(value: string, index?: number): string;

  getUserName(): string;
  setUserName(value: string): void;

  getDepartmentName(): string;
  setDepartmentName(value: string): void;

  getAdminActionDate(): string;
  setAdminActionDate(value: string): void;

  getHomeTravel(): boolean;
  setHomeTravel(value: boolean): void;

  getDateProcessed(): string;
  setDateProcessed(value: string): void;

  clearDateRangeList(): void;
  getDateRangeList(): Array<string>;
  setDateRangeList(value: Array<string>): void;
  addDateRange(value: string, index?: number): string;

  clearDateTargetList(): void;
  getDateTargetList(): Array<string>;
  setDateTargetList(value: Array<string>): void;
  addDateTarget(value: string, index?: number): string;

  getIsActive(): boolean;
  setIsActive(value: boolean): void;

  getOrderBy(): string;
  setOrderBy(value: string): void;

  getOrderDir(): string;
  setOrderDir(value: string): void;

  getGroupBy(): string;
  setGroupBy(value: string): void;

  getWithoutLimit(): boolean;
  setWithoutLimit(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Trip.AsObject;
  static toObject(includeInstance: boolean, msg: Trip): Trip.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Trip, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Trip;
  static deserializeBinaryFromReader(message: Trip, reader: jspb.BinaryReader): Trip;
}

export namespace Trip {
  export type AsObject = {
    id: number,
    distanceInMiles: number,
    originAddress: string,
    destinationAddress: string,
    perDiemRowId: number,
    fieldMaskList: Array<string>,
    userId: number,
    notes: string,
    payrollProcessed: boolean,
    page: number,
    approved: boolean,
    departmentId: number,
    date: string,
    jobNumber: number,
    calculatedDurationInSeconds: number,
    notEqualsList: Array<string>,
    userName: string,
    departmentName: string,
    adminActionDate: string,
    homeTravel: boolean,
    dateProcessed: string,
    dateRangeList: Array<string>,
    dateTargetList: Array<string>,
    isActive: boolean,
    orderBy: string,
    orderDir: string,
    groupBy: string,
    withoutLimit: boolean,
  }
}

export class TripList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<Trip>;
  setResultsList(value: Array<Trip>): void;
  addResults(value?: Trip, index?: number): Trip;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TripList.AsObject;
  static toObject(includeInstance: boolean, msg: TripList): TripList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TripList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TripList;
  static deserializeBinaryFromReader(message: TripList, reader: jspb.BinaryReader): TripList;
}

export namespace TripList {
  export type AsObject = {
    resultsList: Array<Trip.AsObject>,
    totalCount: number,
  }
}

export class PerDiemRowList extends jspb.Message {
  clearRowsList(): void;
  getRowsList(): Array<PerDiemRow>;
  setRowsList(value: Array<PerDiemRow>): void;
  addRows(value?: PerDiemRow, index?: number): PerDiemRow;

  getCount(): number;
  setCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PerDiemRowList.AsObject;
  static toObject(includeInstance: boolean, msg: PerDiemRowList): PerDiemRowList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PerDiemRowList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PerDiemRowList;
  static deserializeBinaryFromReader(message: PerDiemRowList, reader: jspb.BinaryReader): PerDiemRowList;
}

export namespace PerDiemRowList {
  export type AsObject = {
    rowsList: Array<PerDiemRow.AsObject>,
    count: number,
  }
}

