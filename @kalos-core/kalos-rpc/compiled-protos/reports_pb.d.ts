// package: 
// file: reports.proto

import * as jspb from "google-protobuf";

export class SpiffReportLine extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getEmployeeId(): number;
  setEmployeeId(value: number): void;

  getEventId(): number;
  setEventId(value: number): void;

  getContractId(): number;
  setContractId(value: number): void;

  getTypeId(): number;
  setTypeId(value: number): void;

  getStatusId(): number;
  setStatusId(value: number): void;

  getCategory(): string;
  setCategory(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getAmount(): number;
  setAmount(value: number): void;

  getTimestamp(): string;
  setTimestamp(value: string): void;

  getPayYear(): number;
  setPayYear(value: number): void;

  getPayMonth(): number;
  setPayMonth(value: number): void;

  getPayWeek(): number;
  setPayWeek(value: number): void;

  getIsPaidWeekly(): boolean;
  setIsPaidWeekly(value: boolean): void;

  getIsPaidMonthly(): boolean;
  setIsPaidMonthly(value: boolean): void;

  getIsActive(): boolean;
  setIsActive(value: boolean): void;

  getEmployeeName(): string;
  setEmployeeName(value: string): void;

  getAddress(): string;
  setAddress(value: string): void;

  getJobNumber(): string;
  setJobNumber(value: string): void;

  getExt(): string;
  setExt(value: string): void;

  getOrderBy(): string;
  setOrderBy(value: string): void;

  getOrderDir(): string;
  setOrderDir(value: string): void;

  clearDateTargetList(): void;
  getDateTargetList(): Array<string>;
  setDateTargetList(value: Array<string>): void;
  addDateTarget(value: string, index?: number): string;

  clearDateRangeList(): void;
  getDateRangeList(): Array<string>;
  setDateRangeList(value: Array<string>): void;
  addDateRange(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SpiffReportLine.AsObject;
  static toObject(includeInstance: boolean, msg: SpiffReportLine): SpiffReportLine.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SpiffReportLine, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SpiffReportLine;
  static deserializeBinaryFromReader(message: SpiffReportLine, reader: jspb.BinaryReader): SpiffReportLine;
}

export namespace SpiffReportLine {
  export type AsObject = {
    id: number,
    employeeId: number,
    eventId: number,
    contractId: number,
    typeId: number,
    statusId: number,
    category: string,
    description: string,
    amount: number,
    timestamp: string,
    payYear: number,
    payMonth: number,
    payWeek: number,
    isPaidWeekly: boolean,
    isPaidMonthly: boolean,
    isActive: boolean,
    employeeName: string,
    address: string,
    jobNumber: string,
    ext: string,
    orderBy: string,
    orderDir: string,
    dateTargetList: Array<string>,
    dateRangeList: Array<string>,
  }
}

export class SpiffReport extends jspb.Message {
  clearDataList(): void;
  getDataList(): Array<SpiffReportLine>;
  setDataList(value: Array<SpiffReportLine>): void;
  addData(value?: SpiffReportLine, index?: number): SpiffReportLine;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SpiffReport.AsObject;
  static toObject(includeInstance: boolean, msg: SpiffReport): SpiffReport.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SpiffReport, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SpiffReport;
  static deserializeBinaryFromReader(message: SpiffReport, reader: jspb.BinaryReader): SpiffReport;
}

export namespace SpiffReport {
  export type AsObject = {
    dataList: Array<SpiffReportLine.AsObject>,
  }
}

export class PromptPaymentReportLine extends jspb.Message {
  getEventId(): number;
  setEventId(value: number): void;

  getBillingdate(): string;
  setBillingdate(value: string): void;

  getDueDate(): string;
  setDueDate(value: string): void;

  getPaymentDate(): string;
  setPaymentDate(value: string): void;

  getReportUntil(): string;
  setReportUntil(value: string): void;

  getDaysToPay(): number;
  setDaysToPay(value: number): void;

  getJobNumber(): string;
  setJobNumber(value: string): void;

  getUserId(): number;
  setUserId(value: number): void;

  getUserBusinessName(): string;
  setUserBusinessName(value: string): void;

  getUserEmail(): string;
  setUserEmail(value: string): void;

  getPayable(): number;
  setPayable(value: number): void;

  getPayed(): number;
  setPayed(value: number): void;

  getPaymentTerms(): number;
  setPaymentTerms(value: number): void;

  getEligibleRate(): number;
  setEligibleRate(value: number): void;

  getPossibleAward(): number;
  setPossibleAward(value: number): void;

  getRebateAmount(): number;
  setRebateAmount(value: number): void;

  getRebateDate(): string;
  setRebateDate(value: string): void;

  getOrderBy(): string;
  setOrderBy(value: string): void;

  getOrderDir(): string;
  setOrderDir(value: string): void;

  clearDateTargetList(): void;
  getDateTargetList(): Array<string>;
  setDateTargetList(value: Array<string>): void;
  addDateTarget(value: string, index?: number): string;

  clearDateRangeList(): void;
  getDateRangeList(): Array<string>;
  setDateRangeList(value: Array<string>): void;
  addDateRange(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PromptPaymentReportLine.AsObject;
  static toObject(includeInstance: boolean, msg: PromptPaymentReportLine): PromptPaymentReportLine.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PromptPaymentReportLine, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PromptPaymentReportLine;
  static deserializeBinaryFromReader(message: PromptPaymentReportLine, reader: jspb.BinaryReader): PromptPaymentReportLine;
}

export namespace PromptPaymentReportLine {
  export type AsObject = {
    eventId: number,
    billingdate: string,
    dueDate: string,
    paymentDate: string,
    reportUntil: string,
    daysToPay: number,
    jobNumber: string,
    userId: number,
    userBusinessName: string,
    userEmail: string,
    payable: number,
    payed: number,
    paymentTerms: number,
    eligibleRate: number,
    possibleAward: number,
    rebateAmount: number,
    rebateDate: string,
    orderBy: string,
    orderDir: string,
    dateTargetList: Array<string>,
    dateRangeList: Array<string>,
  }
}

export class TransactionReportLine extends jspb.Message {
  getTransactionId(): number;
  setTransactionId(value: number): void;

  getArtificialId(): string;
  setArtificialId(value: string): void;

  getJobNumber(): string;
  setJobNumber(value: string): void;

  getZoning(): string;
  setZoning(value: string): void;

  getJobType(): string;
  setJobType(value: string): void;

  getSubType(): string;
  setSubType(value: string): void;

  getClassCode(): string;
  setClassCode(value: string): void;

  getDepartment(): string;
  setDepartment(value: string): void;

  getCategory(): string;
  setCategory(value: string): void;

  getVendor(): string;
  setVendor(value: string): void;

  getHolderName(): string;
  setHolderName(value: string): void;

  getTransactionTimestamp(): string;
  setTransactionTimestamp(value: string): void;

  getPostedTimestamp(): string;
  setPostedTimestamp(value: string): void;

  getAmount(): string;
  setAmount(value: string): void;

  getNotes(): string;
  setNotes(value: string): void;

  getYear(): string;
  setYear(value: string): void;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  getWithoutLimit(): boolean;
  setWithoutLimit(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionReportLine.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionReportLine): TransactionReportLine.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransactionReportLine, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionReportLine;
  static deserializeBinaryFromReader(message: TransactionReportLine, reader: jspb.BinaryReader): TransactionReportLine;
}

export namespace TransactionReportLine {
  export type AsObject = {
    transactionId: number,
    artificialId: string,
    jobNumber: string,
    zoning: string,
    jobType: string,
    subType: string,
    classCode: string,
    department: string,
    category: string,
    vendor: string,
    holderName: string,
    transactionTimestamp: string,
    postedTimestamp: string,
    amount: string,
    notes: string,
    year: string,
    pageNumber: number,
    withoutLimit: boolean,
  }
}

export class TimeoffReportRequest extends jspb.Message {
  getYearShift(): number;
  setYearShift(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimeoffReportRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TimeoffReportRequest): TimeoffReportRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimeoffReportRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimeoffReportRequest;
  static deserializeBinaryFromReader(message: TimeoffReportRequest, reader: jspb.BinaryReader): TimeoffReportRequest;
}

export namespace TimeoffReportRequest {
  export type AsObject = {
    yearShift: number,
  }
}

export class TimeoffReportLine extends jspb.Message {
  getEmployeeId(): number;
  setEmployeeId(value: number): void;

  getUserFirstname(): string;
  setUserFirstname(value: string): void;

  getUserLastname(): string;
  setUserLastname(value: string): void;

  getHireDate(): string;
  setHireDate(value: string): void;

  getAnnualHoursPto(): number;
  setAnnualHoursPto(value: number): void;

  getHireDateDiscretionary(): number;
  setHireDateDiscretionary(value: number): void;

  getHireDateMandatory(): number;
  setHireDateMandatory(value: number): void;

  getHireDatePto(): number;
  setHireDatePto(value: number): void;

  getHireDatePaidDowntime(): number;
  setHireDatePaidDowntime(value: number): void;

  getAnnualDiscretionary(): number;
  setAnnualDiscretionary(value: number): void;

  getAnnualMandatory(): number;
  setAnnualMandatory(value: number): void;

  getAnnualPto(): number;
  setAnnualPto(value: number): void;

  getAnnualPaidDowntime(): number;
  setAnnualPaidDowntime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimeoffReportLine.AsObject;
  static toObject(includeInstance: boolean, msg: TimeoffReportLine): TimeoffReportLine.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimeoffReportLine, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimeoffReportLine;
  static deserializeBinaryFromReader(message: TimeoffReportLine, reader: jspb.BinaryReader): TimeoffReportLine;
}

export namespace TimeoffReportLine {
  export type AsObject = {
    employeeId: number,
    userFirstname: string,
    userLastname: string,
    hireDate: string,
    annualHoursPto: number,
    hireDateDiscretionary: number,
    hireDateMandatory: number,
    hireDatePto: number,
    hireDatePaidDowntime: number,
    annualDiscretionary: number,
    annualMandatory: number,
    annualPto: number,
    annualPaidDowntime: number,
  }
}

export class PromptPaymentReport extends jspb.Message {
  clearDataList(): void;
  getDataList(): Array<PromptPaymentReportLine>;
  setDataList(value: Array<PromptPaymentReportLine>): void;
  addData(value?: PromptPaymentReportLine, index?: number): PromptPaymentReportLine;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PromptPaymentReport.AsObject;
  static toObject(includeInstance: boolean, msg: PromptPaymentReport): PromptPaymentReport.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PromptPaymentReport, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PromptPaymentReport;
  static deserializeBinaryFromReader(message: PromptPaymentReport, reader: jspb.BinaryReader): PromptPaymentReport;
}

export namespace PromptPaymentReport {
  export type AsObject = {
    dataList: Array<PromptPaymentReportLine.AsObject>,
  }
}

export class TransactionDumpReport extends jspb.Message {
  clearDataList(): void;
  getDataList(): Array<TransactionReportLine>;
  setDataList(value: Array<TransactionReportLine>): void;
  addData(value?: TransactionReportLine, index?: number): TransactionReportLine;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionDumpReport.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionDumpReport): TransactionDumpReport.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransactionDumpReport, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionDumpReport;
  static deserializeBinaryFromReader(message: TransactionDumpReport, reader: jspb.BinaryReader): TransactionDumpReport;
}

export namespace TransactionDumpReport {
  export type AsObject = {
    dataList: Array<TransactionReportLine.AsObject>,
    totalCount: number,
  }
}

export class TimeoffReport extends jspb.Message {
  clearDataList(): void;
  getDataList(): Array<TimeoffReportLine>;
  setDataList(value: Array<TimeoffReportLine>): void;
  addData(value?: TimeoffReportLine, index?: number): TimeoffReportLine;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimeoffReport.AsObject;
  static toObject(includeInstance: boolean, msg: TimeoffReport): TimeoffReport.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimeoffReport, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimeoffReport;
  static deserializeBinaryFromReader(message: TimeoffReport, reader: jspb.BinaryReader): TimeoffReport;
}

export namespace TimeoffReport {
  export type AsObject = {
    dataList: Array<TimeoffReportLine.AsObject>,
    totalCount: number,
  }
}

