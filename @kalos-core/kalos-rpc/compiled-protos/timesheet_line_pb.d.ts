// package: 
// file: timesheet_line.proto

import * as jspb from "google-protobuf";
import * as timesheet_classcode_pb from "./timesheet_classcode_pb";
import * as services_rendered_pb from "./services_rendered_pb";
import * as common_pb from "./common_pb";
import * as user_pb from "./user_pb";

export class TimesheetLine extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getEventId(): number;
  setEventId(value: number): void;

  getServicesRenderedId(): number;
  setServicesRenderedId(value: number): void;

  getTaskEventId(): number;
  setTaskEventId(value: number): void;

  getClassCodeId(): number;
  setClassCodeId(value: number): void;

  getDepartmentCode(): number;
  setDepartmentCode(value: number): void;

  getBriefDescription(): string;
  setBriefDescription(value: string): void;

  getReferenceNumber(): string;
  setReferenceNumber(value: string): void;

  getNotes(): string;
  setNotes(value: string): void;

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

  getTechnicianUserId(): number;
  setTechnicianUserId(value: number): void;

  getIsActive(): number;
  setIsActive(value: number): void;

  hasClassCode(): boolean;
  clearClassCode(): void;
  getClassCode(): timesheet_classcode_pb.TimesheetClassCode | undefined;
  setClassCode(value?: timesheet_classcode_pb.TimesheetClassCode): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  clearDateRangeList(): void;
  getDateRangeList(): Array<string>;
  setDateRangeList(value: Array<string>): void;
  addDateRange(value: string, index?: number): string;

  clearDateTargetList(): void;
  getDateTargetList(): Array<string>;
  setDateTargetList(value: Array<string>): void;
  addDateTarget(value: string, index?: number): string;

  getEventPropertyId(): number;
  setEventPropertyId(value: number): void;

  getEventUserId(): number;
  setEventUserId(value: number): void;

  getTechnicianUserName(): string;
  setTechnicianUserName(value: string): void;

  getDepartmentName(): string;
  setDepartmentName(value: string): void;

  clearNotEqualsList(): void;
  getNotEqualsList(): Array<string>;
  setNotEqualsList(value: Array<string>): void;
  addNotEquals(value: string, index?: number): string;

  getOrderBy(): string;
  setOrderBy(value: string): void;

  getOrderDir(): string;
  setOrderDir(value: string): void;

  getGroupBy(): string;
  setGroupBy(value: string): void;

  getWeekStart(): string;
  setWeekStart(value: string): void;

  getWeekEnd(): string;
  setWeekEnd(value: string): void;

  getPayrollProcessed(): boolean;
  setPayrollProcessed(value: boolean): void;

  getAdminApprovalUserName(): string;
  setAdminApprovalUserName(value: string): void;

  getHoursWorked(): number;
  setHoursWorked(value: number): void;

  getWithoutLimit(): boolean;
  setWithoutLimit(value: boolean): void;

  hasSearchUser(): boolean;
  clearSearchUser(): void;
  getSearchUser(): user_pb.User | undefined;
  setSearchUser(value?: user_pb.User): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimesheetLine.AsObject;
  static toObject(includeInstance: boolean, msg: TimesheetLine): TimesheetLine.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimesheetLine, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimesheetLine;
  static deserializeBinaryFromReader(message: TimesheetLine, reader: jspb.BinaryReader): TimesheetLine;
}

export namespace TimesheetLine {
  export type AsObject = {
    id: number,
    eventId: number,
    servicesRenderedId: number,
    taskEventId: number,
    classCodeId: number,
    departmentCode: number,
    briefDescription: string,
    referenceNumber: string,
    notes: string,
    adminApprovalUserId: number,
    adminApprovalDatetime: string,
    userApprovalDatetime: string,
    timeStarted: string,
    timeFinished: string,
    technicianUserId: number,
    isActive: number,
    classCode?: timesheet_classcode_pb.TimesheetClassCode.AsObject,
    fieldMaskList: Array<string>,
    pageNumber: number,
    dateRangeList: Array<string>,
    dateTargetList: Array<string>,
    eventPropertyId: number,
    eventUserId: number,
    technicianUserName: string,
    departmentName: string,
    notEqualsList: Array<string>,
    orderBy: string,
    orderDir: string,
    groupBy: string,
    weekStart: string,
    weekEnd: string,
    payrollProcessed: boolean,
    adminApprovalUserName: string,
    hoursWorked: number,
    withoutLimit: boolean,
    searchUser?: user_pb.User.AsObject,
  }
}

export class TimesheetLineExpress extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): void;

  getEventId(): number;
  setEventId(value: number): void;

  getServiceId(): number;
  setServiceId(value: number): void;

  getClassCode(): number;
  setClassCode(value: number): void;

  getDepartment(): number;
  setDepartment(value: number): void;

  getBillable(): number;
  setBillable(value: number): void;

  getExplanation(): string;
  setExplanation(value: string): void;

  getDuration(): number;
  setDuration(value: number): void;

  getOccurred(): string;
  setOccurred(value: string): void;

  getCategory(): string;
  setCategory(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimesheetLineExpress.AsObject;
  static toObject(includeInstance: boolean, msg: TimesheetLineExpress): TimesheetLineExpress.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimesheetLineExpress, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimesheetLineExpress;
  static deserializeBinaryFromReader(message: TimesheetLineExpress, reader: jspb.BinaryReader): TimesheetLineExpress;
}

export namespace TimesheetLineExpress {
  export type AsObject = {
    userId: number,
    eventId: number,
    serviceId: number,
    classCode: number,
    department: number,
    billable: number,
    explanation: string,
    duration: number,
    occurred: string,
    category: string,
  }
}

export class TimesheetLineList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<TimesheetLine>;
  setResultsList(value: Array<TimesheetLine>): void;
  addResults(value?: TimesheetLine, index?: number): TimesheetLine;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimesheetLineList.AsObject;
  static toObject(includeInstance: boolean, msg: TimesheetLineList): TimesheetLineList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimesheetLineList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimesheetLineList;
  static deserializeBinaryFromReader(message: TimesheetLineList, reader: jspb.BinaryReader): TimesheetLineList;
}

export namespace TimesheetLineList {
  export type AsObject = {
    resultsList: Array<TimesheetLine.AsObject>,
    totalCount: number,
  }
}

export class SubmitApproveReq extends jspb.Message {
  clearIdsList(): void;
  getIdsList(): Array<number>;
  setIdsList(value: Array<number>): void;
  addIds(value: number, index?: number): number;

  getUserId(): number;
  setUserId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubmitApproveReq.AsObject;
  static toObject(includeInstance: boolean, msg: SubmitApproveReq): SubmitApproveReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubmitApproveReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubmitApproveReq;
  static deserializeBinaryFromReader(message: SubmitApproveReq, reader: jspb.BinaryReader): SubmitApproveReq;
}

export namespace SubmitApproveReq {
  export type AsObject = {
    idsList: Array<number>,
    userId: number,
  }
}

export class TimesheetDay extends jspb.Message {
  clearServicesRenderedList(): void;
  getServicesRenderedList(): Array<services_rendered_pb.ServicesRendered>;
  setServicesRenderedList(value: Array<services_rendered_pb.ServicesRendered>): void;
  addServicesRendered(value?: services_rendered_pb.ServicesRendered, index?: number): services_rendered_pb.ServicesRendered;

  clearTimesheetLineList(): void;
  getTimesheetLineList(): Array<TimesheetLine>;
  setTimesheetLineList(value: Array<TimesheetLine>): void;
  addTimesheetLine(value?: TimesheetLine, index?: number): TimesheetLine;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimesheetDay.AsObject;
  static toObject(includeInstance: boolean, msg: TimesheetDay): TimesheetDay.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimesheetDay, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimesheetDay;
  static deserializeBinaryFromReader(message: TimesheetDay, reader: jspb.BinaryReader): TimesheetDay;
}

export namespace TimesheetDay {
  export type AsObject = {
    servicesRenderedList: Array<services_rendered_pb.ServicesRendered.AsObject>,
    timesheetLineList: Array<TimesheetLine.AsObject>,
  }
}

export class Timesheet extends jspb.Message {
  getDatesMap(): jspb.Map<string, TimesheetDay>;
  clearDatesMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Timesheet.AsObject;
  static toObject(includeInstance: boolean, msg: Timesheet): Timesheet.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Timesheet, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Timesheet;
  static deserializeBinaryFromReader(message: Timesheet, reader: jspb.BinaryReader): Timesheet;
}

export namespace Timesheet {
  export type AsObject = {
    datesMap: Array<[string, TimesheetDay.AsObject]>,
  }
}

export class UserTimesheet extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): void;

  getStartDate(): string;
  setStartDate(value: string): void;

  getEndDate(): string;
  setEndDate(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserTimesheet.AsObject;
  static toObject(includeInstance: boolean, msg: UserTimesheet): UserTimesheet.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserTimesheet, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserTimesheet;
  static deserializeBinaryFromReader(message: UserTimesheet, reader: jspb.BinaryReader): UserTimesheet;
}

export namespace UserTimesheet {
  export type AsObject = {
    userId: number,
    startDate: string,
    endDate: string,
  }
}

export class TimesheetReq extends jspb.Message {
  hasTimesheetLine(): boolean;
  clearTimesheetLine(): void;
  getTimesheetLine(): TimesheetLine | undefined;
  setTimesheetLine(value?: TimesheetLine): void;

  hasServicesRendered(): boolean;
  clearServicesRendered(): void;
  getServicesRendered(): services_rendered_pb.ServicesRendered | undefined;
  setServicesRendered(value?: services_rendered_pb.ServicesRendered): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimesheetReq.AsObject;
  static toObject(includeInstance: boolean, msg: TimesheetReq): TimesheetReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimesheetReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimesheetReq;
  static deserializeBinaryFromReader(message: TimesheetReq, reader: jspb.BinaryReader): TimesheetReq;
}

export namespace TimesheetReq {
  export type AsObject = {
    timesheetLine?: TimesheetLine.AsObject,
    servicesRendered?: services_rendered_pb.ServicesRendered.AsObject,
  }
}

