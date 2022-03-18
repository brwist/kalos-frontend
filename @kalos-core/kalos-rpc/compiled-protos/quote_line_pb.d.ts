// package: 
// file: quote_line.proto

import * as jspb from "google-protobuf";

export class QuoteLine extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getQuoteType(): number;
  setQuoteType(value: number): void;

  getLabor(): string;
  setLabor(value: string): void;

  getRefrigerantLbs(): string;
  setRefrigerantLbs(value: string): void;

  getAdjustment(): string;
  setAdjustment(value: string): void;

  getIsFlatrate(): string;
  setIsFlatrate(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getDiagnosis(): string;
  setDiagnosis(value: string): void;

  getWarranty(): number;
  setWarranty(value: number): void;

  getQuoteReference(): string;
  setQuoteReference(value: string): void;

  getJobNumber(): string;
  setJobNumber(value: string): void;

  getQuoteStatus(): number;
  setQuoteStatus(value: number): void;

  getForUser(): number;
  setForUser(value: number): void;

  getItemId(): number;
  setItemId(value: number): void;

  getPhotoId(): number;
  setPhotoId(value: number): void;

  getIsActive(): number;
  setIsActive(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getWithoutLimit(): boolean;
  setWithoutLimit(value: boolean): void;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  getDepartments(): string;
  setDepartments(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuoteLine.AsObject;
  static toObject(includeInstance: boolean, msg: QuoteLine): QuoteLine.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QuoteLine, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuoteLine;
  static deserializeBinaryFromReader(message: QuoteLine, reader: jspb.BinaryReader): QuoteLine;
}

export namespace QuoteLine {
  export type AsObject = {
    id: number,
    quoteType: number,
    labor: string,
    refrigerantLbs: string,
    adjustment: string,
    isFlatrate: string,
    description: string,
    diagnosis: string,
    warranty: number,
    quoteReference: string,
    jobNumber: string,
    quoteStatus: number,
    forUser: number,
    itemId: number,
    photoId: number,
    isActive: number,
    fieldMaskList: Array<string>,
    withoutLimit: boolean,
    pageNumber: number,
    departments: string,
  }
}

export class QuoteLineList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<QuoteLine>;
  setResultsList(value: Array<QuoteLine>): void;
  addResults(value?: QuoteLine, index?: number): QuoteLine;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuoteLineList.AsObject;
  static toObject(includeInstance: boolean, msg: QuoteLineList): QuoteLineList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QuoteLineList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuoteLineList;
  static deserializeBinaryFromReader(message: QuoteLineList, reader: jspb.BinaryReader): QuoteLineList;
}

export namespace QuoteLineList {
  export type AsObject = {
    resultsList: Array<QuoteLine.AsObject>,
    totalCount: number,
  }
}

