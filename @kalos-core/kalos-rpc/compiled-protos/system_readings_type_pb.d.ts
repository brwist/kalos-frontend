// package: 
// file: system_readings_type.proto

import * as jspb from "google-protobuf";

export class SystemReadingsType extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getDisplayName(): string;
  setDisplayName(value: string): void;

  getRefrigerantType(): number;
  setRefrigerantType(value: number): void;

  getTstatBrand(): number;
  setTstatBrand(value: number): void;

  getBlowerCapacitor(): number;
  setBlowerCapacitor(value: number): void;

  getBlowerAmps(): number;
  setBlowerAmps(value: number): void;

  getReturnTemperature(): number;
  setReturnTemperature(value: number): void;

  getSupplyTemperature(): number;
  setSupplyTemperature(value: number): void;

  getCompressorAmps(): number;
  setCompressorAmps(value: number): void;

  getCondensingFanAmps(): number;
  setCondensingFanAmps(value: number): void;

  getCompressorCapacitor(): number;
  setCompressorCapacitor(value: number): void;

  getCondenserFanCapacitor(): number;
  setCondenserFanCapacitor(value: number): void;

  getSuctionPressure(): number;
  setSuctionPressure(value: number): void;

  getHeadPressure(): number;
  setHeadPressure(value: number): void;

  getSubcool(): number;
  setSubcool(value: number): void;

  getSuperheat(): number;
  setSuperheat(value: number): void;

  getDischargeTemperature(): number;
  setDischargeTemperature(value: number): void;

  getGasType(): number;
  setGasType(value: number): void;

  getBurner(): number;
  setBurner(value: number): void;

  getHeatExchanger(): number;
  setHeatExchanger(value: number): void;

  getThermostat(): number;
  setThermostat(value: number): void;

  getPlateform(): number;
  setPlateform(value: number): void;

  getFloatSwitch(): number;
  setFloatSwitch(value: number): void;

  getEvaporatorCoil(): number;
  setEvaporatorCoil(value: number): void;

  getCondenserCoil(): number;
  setCondenserCoil(value: number): void;

  getHurricanePad(): number;
  setHurricanePad(value: number): void;

  getLineset(): number;
  setLineset(value: number): void;

  getDrainLine(): number;
  setDrainLine(value: number): void;

  getPoolSupplyTemp(): number;
  setPoolSupplyTemp(value: number): void;

  getPoolReturnTemp(): number;
  setPoolReturnTemp(value: number): void;

  getAmbientAirTemp(): number;
  setAmbientAirTemp(value: number): void;

  getReturnWb(): number;
  setReturnWb(value: number): void;

  getReturnDb(): number;
  setReturnDb(value: number): void;

  getEvapTd(): number;
  setEvapTd(value: number): void;

  getCoilStaticDrop(): number;
  setCoilStaticDrop(value: number): void;

  getTesp(): number;
  setTesp(value: number): void;

  getGasPressureIn(): number;
  setGasPressureIn(value: number): void;

  getGasPressureOut(): number;
  setGasPressureOut(value: number): void;

  getLlTempDrop(): number;
  setLlTempDrop(value: number): void;

  getSlTempDrop(): number;
  setSlTempDrop(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SystemReadingsType.AsObject;
  static toObject(includeInstance: boolean, msg: SystemReadingsType): SystemReadingsType.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SystemReadingsType, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SystemReadingsType;
  static deserializeBinaryFromReader(message: SystemReadingsType, reader: jspb.BinaryReader): SystemReadingsType;
}

export namespace SystemReadingsType {
  export type AsObject = {
    id: number,
    displayName: string,
    refrigerantType: number,
    tstatBrand: number,
    blowerCapacitor: number,
    blowerAmps: number,
    returnTemperature: number,
    supplyTemperature: number,
    compressorAmps: number,
    condensingFanAmps: number,
    compressorCapacitor: number,
    condenserFanCapacitor: number,
    suctionPressure: number,
    headPressure: number,
    subcool: number,
    superheat: number,
    dischargeTemperature: number,
    gasType: number,
    burner: number,
    heatExchanger: number,
    thermostat: number,
    plateform: number,
    floatSwitch: number,
    evaporatorCoil: number,
    condenserCoil: number,
    hurricanePad: number,
    lineset: number,
    drainLine: number,
    poolSupplyTemp: number,
    poolReturnTemp: number,
    ambientAirTemp: number,
    returnWb: number,
    returnDb: number,
    evapTd: number,
    coilStaticDrop: number,
    tesp: number,
    gasPressureIn: number,
    gasPressureOut: number,
    llTempDrop: number,
    slTempDrop: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class SystemReadingsTypeList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<SystemReadingsType>;
  setResultsList(value: Array<SystemReadingsType>): void;
  addResults(value?: SystemReadingsType, index?: number): SystemReadingsType;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SystemReadingsTypeList.AsObject;
  static toObject(includeInstance: boolean, msg: SystemReadingsTypeList): SystemReadingsTypeList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SystemReadingsTypeList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SystemReadingsTypeList;
  static deserializeBinaryFromReader(message: SystemReadingsTypeList, reader: jspb.BinaryReader): SystemReadingsTypeList;
}

export namespace SystemReadingsTypeList {
  export type AsObject = {
    resultsList: Array<SystemReadingsType.AsObject>,
    totalCount: number,
  }
}

