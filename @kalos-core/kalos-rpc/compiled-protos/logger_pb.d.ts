// package: 
// file: logger.proto

import * as jspb from "google-protobuf";

export class Logger extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  getActivityName(): string;
  setActivityName(value: string): void;

  getActivity(): string;
  setActivity(value: string): void;

  getActivityDate(): string;
  setActivityDate(value: string): void;

  getActivityEndDate(): string;
  setActivityEndDate(value: string): void;

  getPropertyId(): number;
  setPropertyId(value: number): void;

  getContractId(): number;
  setContractId(value: number): void;

  getCustomerId(): number;
  setCustomerId(value: number): void;

  getTaskId(): number;
  setTaskId(value: number): void;

  getTaskEventId(): number;
  setTaskEventId(value: number): void;

  getTimesheetLineId(): number;
  setTimesheetLineId(value: number): void;

  getEventId(): number;
  setEventId(value: number): void;

  getSrid(): number;
  setSrid(value: number): void;

  getTechId(): number;
  setTechId(value: number): void;

  getGeolocationLat(): number;
  setGeolocationLat(value: number): void;

  getGeolocationLng(): number;
  setGeolocationLng(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Logger.AsObject;
  static toObject(includeInstance: boolean, msg: Logger): Logger.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Logger, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Logger;
  static deserializeBinaryFromReader(message: Logger, reader: jspb.BinaryReader): Logger;
}

export namespace Logger {
  export type AsObject = {
    id: number,
    userId: number,
    activityName: string,
    activity: string,
    activityDate: string,
    activityEndDate: string,
    propertyId: number,
    contractId: number,
    customerId: number,
    taskId: number,
    taskEventId: number,
    timesheetLineId: number,
    eventId: number,
    srid: number,
    techId: number,
    geolocationLat: number,
    geolocationLng: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class LoggerList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<Logger>;
  setResultsList(value: Array<Logger>): void;
  addResults(value?: Logger, index?: number): Logger;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LoggerList.AsObject;
  static toObject(includeInstance: boolean, msg: LoggerList): LoggerList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LoggerList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LoggerList;
  static deserializeBinaryFromReader(message: LoggerList, reader: jspb.BinaryReader): LoggerList;
}

export namespace LoggerList {
  export type AsObject = {
    resultsList: Array<Logger.AsObject>,
    totalCount: number,
  }
}

