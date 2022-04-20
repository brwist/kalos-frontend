// package: 
// file: services_rendered.proto

import * as jspb from "google-protobuf";

export class ServicesRendered extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getEventId(): number;
  setEventId(value: number): void;

  getTechnicianUserId(): number;
  setTechnicianUserId(value: number): void;

  getName(): string;
  setName(value: string): void;

  getMaterialsUsed(): string;
  setMaterialsUsed(value: string): void;

  getServiceRendered(): string;
  setServiceRendered(value: string): void;

  getTechNotes(): string;
  setTechNotes(value: string): void;

  getStatus(): string;
  setStatus(value: string): void;

  getDatetime(): string;
  setDatetime(value: string): void;

  getTimeStarted(): string;
  setTimeStarted(value: string): void;

  getTimeFinished(): string;
  setTimeFinished(value: string): void;

  getIsActive(): number;
  setIsActive(value: number): void;

  getHideFromTimesheet(): number;
  setHideFromTimesheet(value: number): void;

  getSignatureId(): number;
  setSignatureId(value: number): void;

  getSignatureData(): string;
  setSignatureData(value: string): void;

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

  getGroupBy(): string;
  setGroupBy(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServicesRendered.AsObject;
  static toObject(includeInstance: boolean, msg: ServicesRendered): ServicesRendered.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServicesRendered, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServicesRendered;
  static deserializeBinaryFromReader(message: ServicesRendered, reader: jspb.BinaryReader): ServicesRendered;
}

export namespace ServicesRendered {
  export type AsObject = {
    id: number,
    eventId: number,
    technicianUserId: number,
    name: string,
    materialsUsed: string,
    serviceRendered: string,
    techNotes: string,
    status: string,
    datetime: string,
    timeStarted: string,
    timeFinished: string,
    isActive: number,
    hideFromTimesheet: number,
    signatureId: number,
    signatureData: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
    dateRangeList: Array<string>,
    dateTargetList: Array<string>,
    groupBy: string,
  }
}

export class ServicesRenderedList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<ServicesRendered>;
  setResultsList(value: Array<ServicesRendered>): void;
  addResults(value?: ServicesRendered, index?: number): ServicesRendered;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServicesRenderedList.AsObject;
  static toObject(includeInstance: boolean, msg: ServicesRenderedList): ServicesRenderedList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServicesRenderedList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServicesRenderedList;
  static deserializeBinaryFromReader(message: ServicesRenderedList, reader: jspb.BinaryReader): ServicesRenderedList;
}

export namespace ServicesRenderedList {
  export type AsObject = {
    resultsList: Array<ServicesRendered.AsObject>,
    totalCount: number,
  }
}

