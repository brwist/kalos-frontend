// package: 
// file: dispatch.proto

import * as jspb from "google-protobuf";
import * as common_pb from "./common_pb";
import * as timeoff_request_pb from "./timeoff_request_pb";
import * as event_pb from "./event_pb";

export class DispatchableTech extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): void;

  getTechname(): string;
  setTechname(value: string): void;

  getJobType(): string;
  setJobType(value: string): void;

  getUserPhone(): string;
  setUserPhone(value: string): void;

  getUserEmail(): string;
  setUserEmail(value: string): void;

  getEventId(): number;
  setEventId(value: number): void;

  getPropertyUserId(): number;
  setPropertyUserId(value: number): void;

  getPropertyId(): number;
  setPropertyId(value: number): void;

  getPropertyCity(): string;
  setPropertyCity(value: string): void;

  getGeolocationLat(): number;
  setGeolocationLat(value: number): void;

  getGeolocationLng(): number;
  setGeolocationLng(value: number): void;

  getActivity(): string;
  setActivity(value: string): void;

  getActivityDate(): string;
  setActivityDate(value: string): void;

  clearCallBacksList(): void;
  getCallBacksList(): Array<DispatchCallBack>;
  setCallBacksList(value: Array<DispatchCallBack>): void;
  addCallBacks(value?: DispatchCallBack, index?: number): DispatchCallBack;

  clearCallTimesList(): void;
  getCallTimesList(): Array<DispatchCallTime>;
  setCallTimesList(value: Array<DispatchCallTime>): void;
  addCallTimes(value?: DispatchCallTime, index?: number): DispatchCallTime;

  clearCallCountList(): void;
  getCallCountList(): Array<DispatchCallCount>;
  setCallCountList(value: Array<DispatchCallCount>): void;
  addCallCount(value?: DispatchCallCount, index?: number): DispatchCallCount;

  getHoursWorked(): number;
  setHoursWorked(value: number): void;

  hasCurrentJob(): boolean;
  clearCurrentJob(): void;
  getCurrentJob(): event_pb.Event | undefined;
  setCurrentJob(value?: event_pb.Event): void;

  getDepartmentList(): string;
  setDepartmentList(value: string): void;

  getDepartmentCode(): number;
  setDepartmentCode(value: number): void;

  hasDateRange(): boolean;
  clearDateRange(): void;
  getDateRange(): common_pb.DateRange | undefined;
  setDateRange(value?: common_pb.DateRange): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DispatchableTech.AsObject;
  static toObject(includeInstance: boolean, msg: DispatchableTech): DispatchableTech.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DispatchableTech, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DispatchableTech;
  static deserializeBinaryFromReader(message: DispatchableTech, reader: jspb.BinaryReader): DispatchableTech;
}

export namespace DispatchableTech {
  export type AsObject = {
    userId: number,
    techname: string,
    jobType: string,
    userPhone: string,
    userEmail: string,
    eventId: number,
    propertyUserId: number,
    propertyId: number,
    propertyCity: string,
    geolocationLat: number,
    geolocationLng: number,
    activity: string,
    activityDate: string,
    callBacksList: Array<DispatchCallBack.AsObject>,
    callTimesList: Array<DispatchCallTime.AsObject>,
    callCountList: Array<DispatchCallCount.AsObject>,
    hoursWorked: number,
    currentJob?: event_pb.Event.AsObject,
    departmentList: string,
    departmentCode: number,
    dateRange?: common_pb.DateRange.AsObject,
  }
}

export class DispatchableTechList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<DispatchableTech>;
  setResultsList(value: Array<DispatchableTech>): void;
  addResults(value?: DispatchableTech, index?: number): DispatchableTech;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DispatchableTechList.AsObject;
  static toObject(includeInstance: boolean, msg: DispatchableTechList): DispatchableTechList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DispatchableTechList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DispatchableTechList;
  static deserializeBinaryFromReader(message: DispatchableTechList, reader: jspb.BinaryReader): DispatchableTechList;
}

export namespace DispatchableTechList {
  export type AsObject = {
    resultsList: Array<DispatchableTech.AsObject>,
    totalCount: number,
  }
}

export class DispatchCall extends jspb.Message {
  getCustName(): string;
  setCustName(value: string): void;

  getUserBusinessname(): string;
  setUserBusinessname(value: string): void;

  getId(): number;
  setId(value: number): void;

  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getIsCallback(): number;
  setIsCallback(value: number): void;

  getPropertyIsResidential(): number;
  setPropertyIsResidential(value: number): void;

  getLogNotes(): string;
  setLogNotes(value: string): void;

  getDateStarted(): string;
  setDateStarted(value: string): void;

  getDateEnded(): string;
  setDateEnded(value: string): void;

  getTimeStarted(): string;
  setTimeStarted(value: string): void;

  getTimeEnded(): string;
  setTimeEnded(value: string): void;

  getAssigned(): string;
  setAssigned(value: string): void;

  getJobTypeId(): number;
  setJobTypeId(value: number): void;

  getJobTypeIdList(): string;
  setJobTypeIdList(value: string): void;

  getJobSubtypeId(): number;
  setJobSubtypeId(value: number): void;

  getPropertyId(): number;
  setPropertyId(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  getPropertyAddress(): string;
  setPropertyAddress(value: string): void;

  getPropertyCity(): string;
  setPropertyCity(value: string): void;

  getPropertyState(): string;
  setPropertyState(value: string): void;

  getGeolocationLat(): number;
  setGeolocationLat(value: number): void;

  getGeolocationLng(): number;
  setGeolocationLng(value: number): void;

  getLogTechnicianAssigned(): string;
  setLogTechnicianAssigned(value: string): void;

  getIsResidential(): number;
  setIsResidential(value: number): void;

  getDepartmentId(): number;
  setDepartmentId(value: number): void;

  getSectorGroup(): number;
  setSectorGroup(value: number): void;

  getSectorGroupList(): string;
  setSectorGroupList(value: string): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  getJobType(): string;
  setJobType(value: string): void;

  getJobSubtype(): string;
  setJobSubtype(value: string): void;

  getNotes(): string;
  setNotes(value: string): void;

  clearDateRangeList(): void;
  getDateRangeList(): Array<string>;
  setDateRangeList(value: Array<string>): void;
  addDateRange(value: string, index?: number): string;

  clearDateTargetList(): void;
  getDateTargetList(): Array<string>;
  setDateTargetList(value: Array<string>): void;
  addDateTarget(value: string, index?: number): string;

  clearNotEqualsList(): void;
  getNotEqualsList(): Array<string>;
  setNotEqualsList(value: Array<string>): void;
  addNotEquals(value: string, index?: number): string;

  getUserPhone(): string;
  setUserPhone(value: string): void;

  getUserEmail(): string;
  setUserEmail(value: string): void;

  getLogJobstatus(): string;
  setLogJobstatus(value: string): void;

  getLogJobstatusList(): string;
  setLogJobstatusList(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DispatchCall.AsObject;
  static toObject(includeInstance: boolean, msg: DispatchCall): DispatchCall.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DispatchCall, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DispatchCall;
  static deserializeBinaryFromReader(message: DispatchCall, reader: jspb.BinaryReader): DispatchCall;
}

export namespace DispatchCall {
  export type AsObject = {
    custName: string,
    userBusinessname: string,
    id: number,
    name: string,
    description: string,
    isCallback: number,
    propertyIsResidential: number,
    logNotes: string,
    dateStarted: string,
    dateEnded: string,
    timeStarted: string,
    timeEnded: string,
    assigned: string,
    jobTypeId: number,
    jobTypeIdList: string,
    jobSubtypeId: number,
    propertyId: number,
    userId: number,
    propertyAddress: string,
    propertyCity: string,
    propertyState: string,
    geolocationLat: number,
    geolocationLng: number,
    logTechnicianAssigned: string,
    isResidential: number,
    departmentId: number,
    sectorGroup: number,
    sectorGroupList: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
    jobType: string,
    jobSubtype: string,
    notes: string,
    dateRangeList: Array<string>,
    dateTargetList: Array<string>,
    notEqualsList: Array<string>,
    userPhone: string,
    userEmail: string,
    logJobstatus: string,
    logJobstatusList: string,
  }
}

export class DispatchCallList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<DispatchCall>;
  setResultsList(value: Array<DispatchCall>): void;
  addResults(value?: DispatchCall, index?: number): DispatchCall;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DispatchCallList.AsObject;
  static toObject(includeInstance: boolean, msg: DispatchCallList): DispatchCallList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DispatchCallList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DispatchCallList;
  static deserializeBinaryFromReader(message: DispatchCallList, reader: jspb.BinaryReader): DispatchCallList;
}

export namespace DispatchCallList {
  export type AsObject = {
    resultsList: Array<DispatchCall.AsObject>,
    totalCount: number,
  }
}

export class DispatchCallBack extends jspb.Message {
  getTechnicianId(): number;
  setTechnicianId(value: number): void;

  getServiceCallbacks(): number;
  setServiceCallbacks(value: number): void;

  getProjectCallbacks(): number;
  setProjectCallbacks(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DispatchCallBack.AsObject;
  static toObject(includeInstance: boolean, msg: DispatchCallBack): DispatchCallBack.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DispatchCallBack, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DispatchCallBack;
  static deserializeBinaryFromReader(message: DispatchCallBack, reader: jspb.BinaryReader): DispatchCallBack;
}

export namespace DispatchCallBack {
  export type AsObject = {
    technicianId: number,
    serviceCallbacks: number,
    projectCallbacks: number,
  }
}

export class DispatchCallBacksList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<DispatchCallBack>;
  setResultsList(value: Array<DispatchCallBack>): void;
  addResults(value?: DispatchCallBack, index?: number): DispatchCallBack;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DispatchCallBacksList.AsObject;
  static toObject(includeInstance: boolean, msg: DispatchCallBacksList): DispatchCallBacksList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DispatchCallBacksList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DispatchCallBacksList;
  static deserializeBinaryFromReader(message: DispatchCallBacksList, reader: jspb.BinaryReader): DispatchCallBacksList;
}

export namespace DispatchCallBacksList {
  export type AsObject = {
    resultsList: Array<DispatchCallBack.AsObject>,
    totalCount: number,
  }
}

export class DispatchCallTime extends jspb.Message {
  getTechnicianId(): number;
  setTechnicianId(value: number): void;

  getJobType(): string;
  setJobType(value: string): void;

  getAvgMinutesDriving(): number;
  setAvgMinutesDriving(value: number): void;

  getAvgMinutesOnCall(): number;
  setAvgMinutesOnCall(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DispatchCallTime.AsObject;
  static toObject(includeInstance: boolean, msg: DispatchCallTime): DispatchCallTime.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DispatchCallTime, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DispatchCallTime;
  static deserializeBinaryFromReader(message: DispatchCallTime, reader: jspb.BinaryReader): DispatchCallTime;
}

export namespace DispatchCallTime {
  export type AsObject = {
    technicianId: number,
    jobType: string,
    avgMinutesDriving: number,
    avgMinutesOnCall: number,
  }
}

export class DispatchCallTimeList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<DispatchCallTime>;
  setResultsList(value: Array<DispatchCallTime>): void;
  addResults(value?: DispatchCallTime, index?: number): DispatchCallTime;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DispatchCallTimeList.AsObject;
  static toObject(includeInstance: boolean, msg: DispatchCallTimeList): DispatchCallTimeList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DispatchCallTimeList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DispatchCallTimeList;
  static deserializeBinaryFromReader(message: DispatchCallTimeList, reader: jspb.BinaryReader): DispatchCallTimeList;
}

export namespace DispatchCallTimeList {
  export type AsObject = {
    resultsList: Array<DispatchCallTime.AsObject>,
    totalCount: number,
  }
}

export class DispatchCallCount extends jspb.Message {
  getTechnicianId(): number;
  setTechnicianId(value: number): void;

  getJobType(): string;
  setJobType(value: string): void;

  getJobSubType(): string;
  setJobSubType(value: string): void;

  getCount(): number;
  setCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DispatchCallCount.AsObject;
  static toObject(includeInstance: boolean, msg: DispatchCallCount): DispatchCallCount.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DispatchCallCount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DispatchCallCount;
  static deserializeBinaryFromReader(message: DispatchCallCount, reader: jspb.BinaryReader): DispatchCallCount;
}

export namespace DispatchCallCount {
  export type AsObject = {
    technicianId: number,
    jobType: string,
    jobSubType: string,
    count: number,
  }
}

export class DispatchCallCountList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<DispatchCallCount>;
  setResultsList(value: Array<DispatchCallCount>): void;
  addResults(value?: DispatchCallCount, index?: number): DispatchCallCount;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DispatchCallCountList.AsObject;
  static toObject(includeInstance: boolean, msg: DispatchCallCountList): DispatchCallCountList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DispatchCallCountList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DispatchCallCountList;
  static deserializeBinaryFromReader(message: DispatchCallCountList, reader: jspb.BinaryReader): DispatchCallCountList;
}

export namespace DispatchCallCountList {
  export type AsObject = {
    resultsList: Array<DispatchCallCount.AsObject>,
    totalCount: number,
  }
}

export class DispatchFirstCall extends jspb.Message {
  getCustName(): string;
  setCustName(value: string): void;

  getUserBusinessname(): string;
  setUserBusinessname(value: string): void;

  getId(): number;
  setId(value: number): void;

  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getIsCallback(): number;
  setIsCallback(value: number): void;

  getPropertyIsResidential(): number;
  setPropertyIsResidential(value: number): void;

  getLogNotes(): string;
  setLogNotes(value: string): void;

  getDateStarted(): string;
  setDateStarted(value: string): void;

  getDateEnded(): string;
  setDateEnded(value: string): void;

  getTimeStarted(): string;
  setTimeStarted(value: string): void;

  getTimeEnded(): string;
  setTimeEnded(value: string): void;

  getAssigned(): string;
  setAssigned(value: string): void;

  getJobTypeId(): number;
  setJobTypeId(value: number): void;

  getJobSubtypeId(): number;
  setJobSubtypeId(value: number): void;

  getPropertyId(): number;
  setPropertyId(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  getPropertyAddress(): string;
  setPropertyAddress(value: string): void;

  getPropertyCity(): string;
  setPropertyCity(value: string): void;

  getGeolocationLat(): number;
  setGeolocationLat(value: number): void;

  getGeolocationLng(): number;
  setGeolocationLng(value: number): void;

  getLogTechnicianAssigned(): string;
  setLogTechnicianAssigned(value: string): void;

  getGroupId(): number;
  setGroupId(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DispatchFirstCall.AsObject;
  static toObject(includeInstance: boolean, msg: DispatchFirstCall): DispatchFirstCall.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DispatchFirstCall, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DispatchFirstCall;
  static deserializeBinaryFromReader(message: DispatchFirstCall, reader: jspb.BinaryReader): DispatchFirstCall;
}

export namespace DispatchFirstCall {
  export type AsObject = {
    custName: string,
    userBusinessname: string,
    id: number,
    name: string,
    description: string,
    isCallback: number,
    propertyIsResidential: number,
    logNotes: string,
    dateStarted: string,
    dateEnded: string,
    timeStarted: string,
    timeEnded: string,
    assigned: string,
    jobTypeId: number,
    jobSubtypeId: number,
    propertyId: number,
    userId: number,
    propertyAddress: string,
    propertyCity: string,
    geolocationLat: number,
    geolocationLng: number,
    logTechnicianAssigned: string,
    groupId: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class DispatchFirstCallList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<DispatchFirstCall>;
  setResultsList(value: Array<DispatchFirstCall>): void;
  addResults(value?: DispatchFirstCall, index?: number): DispatchFirstCall;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DispatchFirstCallList.AsObject;
  static toObject(includeInstance: boolean, msg: DispatchFirstCallList): DispatchFirstCallList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DispatchFirstCallList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DispatchFirstCallList;
  static deserializeBinaryFromReader(message: DispatchFirstCallList, reader: jspb.BinaryReader): DispatchFirstCallList;
}

export namespace DispatchFirstCallList {
  export type AsObject = {
    resultsList: Array<DispatchFirstCall.AsObject>,
    totalCount: number,
  }
}

