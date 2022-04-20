// package: 
// file: maintenance_question.proto

import * as jspb from "google-protobuf";

export class MaintenanceQuestion extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getTstatBrand(): string;
  setTstatBrand(value: string): void;

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

  getGasType(): number;
  setGasType(value: number): void;

  getBurner(): number;
  setBurner(value: number): void;

  getHeatExchanger(): number;
  setHeatExchanger(value: number): void;

  getConditionNotes1(): string;
  setConditionNotes1(value: string): void;

  getConditionNotes2(): string;
  setConditionNotes2(value: string): void;

  getConditionNotes3(): string;
  setConditionNotes3(value: string): void;

  getConditionRating1(): string;
  setConditionRating1(value: string): void;

  getConditionRating2(): string;
  setConditionRating2(value: string): void;

  getConditionRating3(): string;
  setConditionRating3(value: string): void;

  getReadingId(): number;
  setReadingId(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MaintenanceQuestion.AsObject;
  static toObject(includeInstance: boolean, msg: MaintenanceQuestion): MaintenanceQuestion.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MaintenanceQuestion, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MaintenanceQuestion;
  static deserializeBinaryFromReader(message: MaintenanceQuestion, reader: jspb.BinaryReader): MaintenanceQuestion;
}

export namespace MaintenanceQuestion {
  export type AsObject = {
    id: number,
    tstatBrand: string,
    thermostat: number,
    plateform: number,
    floatSwitch: number,
    evaporatorCoil: number,
    condenserCoil: number,
    hurricanePad: number,
    lineset: number,
    drainLine: number,
    gasType: number,
    burner: number,
    heatExchanger: number,
    conditionNotes1: string,
    conditionNotes2: string,
    conditionNotes3: string,
    conditionRating1: string,
    conditionRating2: string,
    conditionRating3: string,
    readingId: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class MaintenanceQuestionList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<MaintenanceQuestion>;
  setResultsList(value: Array<MaintenanceQuestion>): void;
  addResults(value?: MaintenanceQuestion, index?: number): MaintenanceQuestion;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MaintenanceQuestionList.AsObject;
  static toObject(includeInstance: boolean, msg: MaintenanceQuestionList): MaintenanceQuestionList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MaintenanceQuestionList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MaintenanceQuestionList;
  static deserializeBinaryFromReader(message: MaintenanceQuestionList, reader: jspb.BinaryReader): MaintenanceQuestionList;
}

export namespace MaintenanceQuestionList {
  export type AsObject = {
    resultsList: Array<MaintenanceQuestion.AsObject>,
    totalCount: number,
  }
}

