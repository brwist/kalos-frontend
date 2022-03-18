// package: 
// file: invoice.proto

import * as jspb from "google-protobuf";

export class Invoice extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getEventId(): number;
  setEventId(value: number): void;

  getContractId(): number;
  setContractId(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  getPropertyId(): number;
  setPropertyId(value: number): void;

  getSystemType(): string;
  setSystemType(value: string): void;

  getSystemType2(): string;
  setSystemType2(value: string): void;

  getCompressorAmps(): string;
  setCompressorAmps(value: string): void;

  getModel(): string;
  setModel(value: string): void;

  getBrand(): string;
  setBrand(value: string): void;

  getCondensingFanAmps(): string;
  setCondensingFanAmps(value: string): void;

  getSerial(): string;
  setSerial(value: string): void;

  getStartDate(): string;
  setStartDate(value: string): void;

  getSuctionPressure(): string;
  setSuctionPressure(value: string): void;

  getHeadPressure(): string;
  setHeadPressure(value: string): void;

  getModel2(): string;
  setModel2(value: string): void;

  getBrand2(): string;
  setBrand2(value: string): void;

  getReturnTemperature(): string;
  setReturnTemperature(value: string): void;

  getSerial2(): string;
  setSerial2(value: string): void;

  getStartDate2(): string;
  setStartDate2(value: string): void;

  getSupplyTemperature(): string;
  setSupplyTemperature(value: string): void;

  getTstatType(): string;
  setTstatType(value: string): void;

  getTstatBrand(): string;
  setTstatBrand(value: string): void;

  getSubcool(): string;
  setSubcool(value: string): void;

  getFilterSizes(): string;
  setFilterSizes(value: string): void;

  getSuperheat(): string;
  setSuperheat(value: string): void;

  getNotes(): string;
  setNotes(value: string): void;

  getProperties(): string;
  setProperties(value: string): void;

  getTerms(): string;
  setTerms(value: string): void;

  getServicesperformedrow1(): string;
  setServicesperformedrow1(value: string): void;

  getTotalamountrow1(): string;
  setTotalamountrow1(value: string): void;

  getServicesperformedrow2(): string;
  setServicesperformedrow2(value: string): void;

  getTotalamountrow2(): string;
  setTotalamountrow2(value: string): void;

  getServicesperformedrow3(): string;
  setServicesperformedrow3(value: string): void;

  getTotalamountrow3(): string;
  setTotalamountrow3(value: string): void;

  getServicesperformedrow4(): string;
  setServicesperformedrow4(value: string): void;

  getTotalamountrow4(): string;
  setTotalamountrow4(value: string): void;

  getDiscount(): string;
  setDiscount(value: string): void;

  getDiscountcost(): string;
  setDiscountcost(value: string): void;

  getTotalamounttotal(): string;
  setTotalamounttotal(value: string): void;

  getCredit(): number;
  setCredit(value: number): void;

  getCash(): number;
  setCash(value: number): void;

  getByCheck(): number;
  setByCheck(value: number): void;

  getBilling(): number;
  setBilling(value: number): void;

  getPaymentYes(): number;
  setPaymentYes(value: number): void;

  getPaymentNo(): number;
  setPaymentNo(value: number): void;

  getServiceItem(): string;
  setServiceItem(value: string): void;

  getLogPaymentType(): string;
  setLogPaymentType(value: string): void;

  getLogPaymentStatus(): string;
  setLogPaymentStatus(value: string): void;

  getPropertyBilling(): number;
  setPropertyBilling(value: number): void;

  getMaterialUsed(): string;
  setMaterialUsed(value: string): void;

  getMaterialTotal(): string;
  setMaterialTotal(value: string): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Invoice.AsObject;
  static toObject(includeInstance: boolean, msg: Invoice): Invoice.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Invoice, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Invoice;
  static deserializeBinaryFromReader(message: Invoice, reader: jspb.BinaryReader): Invoice;
}

export namespace Invoice {
  export type AsObject = {
    id: number,
    eventId: number,
    contractId: number,
    userId: number,
    propertyId: number,
    systemType: string,
    systemType2: string,
    compressorAmps: string,
    model: string,
    brand: string,
    condensingFanAmps: string,
    serial: string,
    startDate: string,
    suctionPressure: string,
    headPressure: string,
    model2: string,
    brand2: string,
    returnTemperature: string,
    serial2: string,
    startDate2: string,
    supplyTemperature: string,
    tstatType: string,
    tstatBrand: string,
    subcool: string,
    filterSizes: string,
    superheat: string,
    notes: string,
    properties: string,
    terms: string,
    servicesperformedrow1: string,
    totalamountrow1: string,
    servicesperformedrow2: string,
    totalamountrow2: string,
    servicesperformedrow3: string,
    totalamountrow3: string,
    servicesperformedrow4: string,
    totalamountrow4: string,
    discount: string,
    discountcost: string,
    totalamounttotal: string,
    credit: number,
    cash: number,
    byCheck: number,
    billing: number,
    paymentYes: number,
    paymentNo: number,
    serviceItem: string,
    logPaymentType: string,
    logPaymentStatus: string,
    propertyBilling: number,
    materialUsed: string,
    materialTotal: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class InvoiceList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<Invoice>;
  setResultsList(value: Array<Invoice>): void;
  addResults(value?: Invoice, index?: number): Invoice;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InvoiceList.AsObject;
  static toObject(includeInstance: boolean, msg: InvoiceList): InvoiceList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InvoiceList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InvoiceList;
  static deserializeBinaryFromReader(message: InvoiceList, reader: jspb.BinaryReader): InvoiceList;
}

export namespace InvoiceList {
  export type AsObject = {
    resultsList: Array<Invoice.AsObject>,
    totalCount: number,
  }
}

