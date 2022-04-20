// package: 
// file: timeoff_request.proto

import * as jspb from "google-protobuf";
import * as user_pb from "./user_pb";

export class TimeoffRequestTypeList extends jspb.Message {
  clearDataList(): void;
  getDataList(): Array<TimeoffRequestType>;
  setDataList(value: Array<TimeoffRequestType>): void;
  addData(value?: TimeoffRequestType, index?: number): TimeoffRequestType;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimeoffRequestTypeList.AsObject;
  static toObject(includeInstance: boolean, msg: TimeoffRequestTypeList): TimeoffRequestTypeList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimeoffRequestTypeList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimeoffRequestTypeList;
  static deserializeBinaryFromReader(message: TimeoffRequestTypeList, reader: jspb.BinaryReader): TimeoffRequestTypeList;
}

export namespace TimeoffRequestTypeList {
  export type AsObject = {
    dataList: Array<TimeoffRequestType.AsObject>,
  }
}

export class TimeoffRequestType extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getRequestType(): string;
  setRequestType(value: string): void;

  getRequestClass(): string;
  setRequestClass(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimeoffRequestType.AsObject;
  static toObject(includeInstance: boolean, msg: TimeoffRequestType): TimeoffRequestType.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimeoffRequestType, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimeoffRequestType;
  static deserializeBinaryFromReader(message: TimeoffRequestType, reader: jspb.BinaryReader): TimeoffRequestType;
}

export namespace TimeoffRequestType {
  export type AsObject = {
    id: number,
    requestType: string,
    requestClass: string,
  }
}

export class TimeoffRequestReadOnly extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getAllowanceHoursPto(): number;
  setAllowanceHoursPto(value: number): void;

  getDateHired(): string;
  setDateHired(value: string): void;

  getRenewNext(): string;
  setRenewNext(value: string): void;

  getRewnewPrior(): string;
  setRewnewPrior(value: string): void;

  getBasePrior(): string;
  setBasePrior(value: string): void;

  getCurrentYear(): number;
  setCurrentYear(value: number): void;

  getPriorYear(): number;
  setPriorYear(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimeoffRequestReadOnly.AsObject;
  static toObject(includeInstance: boolean, msg: TimeoffRequestReadOnly): TimeoffRequestReadOnly.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimeoffRequestReadOnly, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimeoffRequestReadOnly;
  static deserializeBinaryFromReader(message: TimeoffRequestReadOnly, reader: jspb.BinaryReader): TimeoffRequestReadOnly;
}

export namespace TimeoffRequestReadOnly {
  export type AsObject = {
    id: number,
    allowanceHoursPto: number,
    dateHired: string,
    renewNext: string,
    rewnewPrior: string,
    basePrior: string,
    currentYear: number,
    priorYear: number,
  }
}

export class TimeoffRequest extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getEventId(): number;
  setEventId(value: number): void;

  getServicesRenderedId(): number;
  setServicesRenderedId(value: number): void;

  getTaskEventId(): number;
  setTaskEventId(value: number): void;

  getRequestTypeList(): string;
  setRequestTypeList(value: string): void;

  getRequestType(): number;
  setRequestType(value: number): void;

  getDepartmentIdList(): string;
  setDepartmentIdList(value: string): void;

  getDepartmentCode(): number;
  setDepartmentCode(value: number): void;

  getBriefDescription(): string;
  setBriefDescription(value: string): void;

  getReferenceNumber(): string;
  setReferenceNumber(value: string): void;

  getNotes(): string;
  setNotes(value: string): void;

  getReviewedBy(): string;
  setReviewedBy(value: string): void;

  getAdminComments(): string;
  setAdminComments(value: string): void;

  getAdminApprovalUserId(): number;
  setAdminApprovalUserId(value: number): void;

  getAdminApprovalDatetime(): string;
  setAdminApprovalDatetime(value: string): void;

  getUserApprovalDatetime(): string;
  setUserApprovalDatetime(value: string): void;

  getTimeStarted(): string;
  setTimeStarted(value: string): void;

  getTimeFinished(): string;
  setTimeFinished(value: string): void;

  getUserId(): number;
  setUserId(value: number): void;

  getRequestStatus(): number;
  setRequestStatus(value: number): void;

  getAllDayOff(): number;
  setAllDayOff(value: number): void;

  getIsRooRequest(): number;
  setIsRooRequest(value: number): void;

  getUserName(): string;
  setUserName(value: string): void;

  getIsActive(): number;
  setIsActive(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  getAdminApprovalUserName(): string;
  setAdminApprovalUserName(value: string): void;

  clearDateRangeList(): void;
  getDateRangeList(): Array<string>;
  setDateRangeList(value: Array<string>): void;
  addDateRange(value: string, index?: number): string;

  clearDateTargetList(): void;
  getDateTargetList(): Array<string>;
  setDateTargetList(value: Array<string>): void;
  addDateTarget(value: string, index?: number): string;

  getRequestClass(): string;
  setRequestClass(value: string): void;

  clearNotEqualsList(): void;
  getNotEqualsList(): Array<string>;
  setNotEqualsList(value: Array<string>): void;
  addNotEquals(value: string, index?: number): string;

  getDepartmentName(): string;
  setDepartmentName(value: string): void;

  hasUser(): boolean;
  clearUser(): void;
  getUser(): user_pb.User | undefined;
  setUser(value?: user_pb.User): void;

  getOrderBy(): string;
  setOrderBy(value: string): void;

  getPayrollProcessed(): boolean;
  setPayrollProcessed(value: boolean): void;

  getOrderDir(): string;
  setOrderDir(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimeoffRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TimeoffRequest): TimeoffRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimeoffRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimeoffRequest;
  static deserializeBinaryFromReader(message: TimeoffRequest, reader: jspb.BinaryReader): TimeoffRequest;
}

export namespace TimeoffRequest {
  export type AsObject = {
    id: number,
    eventId: number,
    servicesRenderedId: number,
    taskEventId: number,
    requestTypeList: string,
    requestType: number,
    departmentIdList: string,
    departmentCode: number,
    briefDescription: string,
    referenceNumber: string,
    notes: string,
    reviewedBy: string,
    adminComments: string,
    adminApprovalUserId: number,
    adminApprovalDatetime: string,
    userApprovalDatetime: string,
    timeStarted: string,
    timeFinished: string,
    userId: number,
    requestStatus: number,
    allDayOff: number,
    isRooRequest: number,
    userName: string,
    isActive: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
    adminApprovalUserName: string,
    dateRangeList: Array<string>,
    dateTargetList: Array<string>,
    requestClass: string,
    notEqualsList: Array<string>,
    departmentName: string,
    user?: user_pb.User.AsObject,
    orderBy: string,
    payrollProcessed: boolean,
    orderDir: string,
  }
}

export class TimeoffRequestList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<TimeoffRequest>;
  setResultsList(value: Array<TimeoffRequest>): void;
  addResults(value?: TimeoffRequest, index?: number): TimeoffRequest;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimeoffRequestList.AsObject;
  static toObject(includeInstance: boolean, msg: TimeoffRequestList): TimeoffRequestList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimeoffRequestList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimeoffRequestList;
  static deserializeBinaryFromReader(message: TimeoffRequestList, reader: jspb.BinaryReader): TimeoffRequestList;
}

export namespace TimeoffRequestList {
  export type AsObject = {
    resultsList: Array<TimeoffRequest.AsObject>,
    totalCount: number,
  }
}

export class PTO extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getYearsWorked(): number;
  setYearsWorked(value: number): void;

  getDaysAvailable(): number;
  setDaysAvailable(value: number): void;

  getHoursAvailable(): number;
  setHoursAvailable(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PTO.AsObject;
  static toObject(includeInstance: boolean, msg: PTO): PTO.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PTO, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PTO;
  static deserializeBinaryFromReader(message: PTO, reader: jspb.BinaryReader): PTO;
}

export namespace PTO {
  export type AsObject = {
    id: number,
    yearsWorked: number,
    daysAvailable: number,
    hoursAvailable: number,
  }
}

