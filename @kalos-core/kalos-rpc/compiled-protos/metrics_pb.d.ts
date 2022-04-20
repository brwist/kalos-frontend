// package: 
// file: metrics.proto

import * as jspb from "google-protobuf";

export class Billable extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Billable.AsObject;
  static toObject(includeInstance: boolean, msg: Billable): Billable.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Billable, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Billable;
  static deserializeBinaryFromReader(message: Billable, reader: jspb.BinaryReader): Billable;
}

export namespace Billable {
  export type AsObject = {
    id: number,
    value: number,
  }
}

export class AvgTicket extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AvgTicket.AsObject;
  static toObject(includeInstance: boolean, msg: AvgTicket): AvgTicket.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AvgTicket, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AvgTicket;
  static deserializeBinaryFromReader(message: AvgTicket, reader: jspb.BinaryReader): AvgTicket;
}

export namespace AvgTicket {
  export type AsObject = {
    id: number,
    value: number,
  }
}

export class Callbacks extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Callbacks.AsObject;
  static toObject(includeInstance: boolean, msg: Callbacks): Callbacks.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Callbacks, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Callbacks;
  static deserializeBinaryFromReader(message: Callbacks, reader: jspb.BinaryReader): Callbacks;
}

export namespace Callbacks {
  export type AsObject = {
    id: number,
    value: number,
  }
}

export class Revenue extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Revenue.AsObject;
  static toObject(includeInstance: boolean, msg: Revenue): Revenue.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Revenue, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Revenue;
  static deserializeBinaryFromReader(message: Revenue, reader: jspb.BinaryReader): Revenue;
}

export namespace Revenue {
  export type AsObject = {
    id: number,
    value: number,
  }
}

export class MetricReportData extends jspb.Message {
  getTechname(): number;
  setTechname(value: number): void;

  getIncomeperhour(): number;
  setIncomeperhour(value: number): void;

  getPercentagebillable(): number;
  setPercentagebillable(value: number): void;

  getServicecallbackrate(): number;
  setServicecallbackrate(value: number): void;

  getDrivetime(): number;
  setDrivetime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MetricReportData.AsObject;
  static toObject(includeInstance: boolean, msg: MetricReportData): MetricReportData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MetricReportData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MetricReportData;
  static deserializeBinaryFromReader(message: MetricReportData, reader: jspb.BinaryReader): MetricReportData;
}

export namespace MetricReportData {
  export type AsObject = {
    techname: number,
    incomeperhour: number,
    percentagebillable: number,
    servicecallbackrate: number,
    drivetime: number,
  }
}

export class MertricReportDataRequest extends jspb.Message {
  getStartdate(): string;
  setStartdate(value: string): void;

  getEnddate(): string;
  setEnddate(value: string): void;

  getPagenumber(): number;
  setPagenumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MertricReportDataRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MertricReportDataRequest): MertricReportDataRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MertricReportDataRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MertricReportDataRequest;
  static deserializeBinaryFromReader(message: MertricReportDataRequest, reader: jspb.BinaryReader): MertricReportDataRequest;
}

export namespace MertricReportDataRequest {
  export type AsObject = {
    startdate: string,
    enddate: string,
    pagenumber: number,
  }
}

export class MetricReportDataList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<MetricReportData>;
  setResultsList(value: Array<MetricReportData>): void;
  addResults(value?: MetricReportData, index?: number): MetricReportData;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MetricReportDataList.AsObject;
  static toObject(includeInstance: boolean, msg: MetricReportDataList): MetricReportDataList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MetricReportDataList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MetricReportDataList;
  static deserializeBinaryFromReader(message: MetricReportDataList, reader: jspb.BinaryReader): MetricReportDataList;
}

export namespace MetricReportDataList {
  export type AsObject = {
    resultsList: Array<MetricReportData.AsObject>,
    totalCount: number,
  }
}

