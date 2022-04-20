// package: 
// file: reading.proto

import * as jspb from "google-protobuf";

export class Reading extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getServiceItemId(): number;
  setServiceItemId(value: number): void;

  getDate(): string;
  setDate(value: string): void;

  getTstatType(): string;
  setTstatType(value: string): void;

  getTstatBrand(): string;
  setTstatBrand(value: string): void;

  getCompressorAmps(): string;
  setCompressorAmps(value: string): void;

  getCondensingFanAmps(): string;
  setCondensingFanAmps(value: string): void;

  getSuctionPressure(): string;
  setSuctionPressure(value: string): void;

  getHeadPressure(): string;
  setHeadPressure(value: string): void;

  getReturnTemperature(): string;
  setReturnTemperature(value: string): void;

  getSupplyTemperature(): string;
  setSupplyTemperature(value: string): void;

  getSubcool(): string;
  setSubcool(value: string): void;

  getSuperheat(): string;
  setSuperheat(value: string): void;

  getNotes(): string;
  setNotes(value: string): void;

  getDisplayUnckecked(): number;
  setDisplayUnckecked(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  getEventId(): number;
  setEventId(value: number): void;

  getRefrigerantType(): string;
  setRefrigerantType(value: string): void;

  getBlowerAmps(): string;
  setBlowerAmps(value: string): void;

  getCondenserFanCapacitor(): string;
  setCondenserFanCapacitor(value: string): void;

  getCompressorCapacitor(): string;
  setCompressorCapacitor(value: string): void;

  getBlowerCapacitor(): string;
  setBlowerCapacitor(value: string): void;

  getDischargeTemperature(): string;
  setDischargeTemperature(value: string): void;

  getPoolSupplyTemp(): string;
  setPoolSupplyTemp(value: string): void;

  getPoolReturnTemp(): string;
  setPoolReturnTemp(value: string): void;

  getAmbientAirTemp(): string;
  setAmbientAirTemp(value: string): void;

  getReturnDb(): string;
  setReturnDb(value: string): void;

  getReturnWb(): string;
  setReturnWb(value: string): void;

  getEvapTd(): string;
  setEvapTd(value: string): void;

  getCoilStaticDrop(): string;
  setCoilStaticDrop(value: string): void;

  getTesp(): string;
  setTesp(value: string): void;

  getGasPressureIn(): string;
  setGasPressureIn(value: string): void;

  getGasPressureOut(): string;
  setGasPressureOut(value: string): void;

  getLlTempDrop(): string;
  setLlTempDrop(value: string): void;

  getSlTempDrop(): string;
  setSlTempDrop(value: string): void;

  getServicesRenderedId(): number;
  setServicesRenderedId(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Reading.AsObject;
  static toObject(includeInstance: boolean, msg: Reading): Reading.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Reading, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Reading;
  static deserializeBinaryFromReader(message: Reading, reader: jspb.BinaryReader): Reading;
}

export namespace Reading {
  export type AsObject = {
    id: number,
    serviceItemId: number,
    date: string,
    tstatType: string,
    tstatBrand: string,
    compressorAmps: string,
    condensingFanAmps: string,
    suctionPressure: string,
    headPressure: string,
    returnTemperature: string,
    supplyTemperature: string,
    subcool: string,
    superheat: string,
    notes: string,
    displayUnckecked: number,
    userId: number,
    eventId: number,
    refrigerantType: string,
    blowerAmps: string,
    condenserFanCapacitor: string,
    compressorCapacitor: string,
    blowerCapacitor: string,
    dischargeTemperature: string,
    poolSupplyTemp: string,
    poolReturnTemp: string,
    ambientAirTemp: string,
    returnDb: string,
    returnWb: string,
    evapTd: string,
    coilStaticDrop: string,
    tesp: string,
    gasPressureIn: string,
    gasPressureOut: string,
    llTempDrop: string,
    slTempDrop: string,
    servicesRenderedId: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class ReadingList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<Reading>;
  setResultsList(value: Array<Reading>): void;
  addResults(value?: Reading, index?: number): Reading;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReadingList.AsObject;
  static toObject(includeInstance: boolean, msg: ReadingList): ReadingList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ReadingList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReadingList;
  static deserializeBinaryFromReader(message: ReadingList, reader: jspb.BinaryReader): ReadingList;
}

export namespace ReadingList {
  export type AsObject = {
    resultsList: Array<Reading.AsObject>,
    totalCount: number,
  }
}

