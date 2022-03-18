// package: 
// file: event.proto

import * as jspb from "google-protobuf";
import * as user_pb from "./user_pb";
import * as common_pb from "./common_pb";
import * as property_pb from "./property_pb";
import * as timeoff_request_pb from "./timeoff_request_pb";
import * as task_pb from "./task_pb";
import * as transaction_pb from "./transaction_pb";
import * as transaction_account_pb from "./transaction_account_pb";
import * as timesheet_department_pb from "./timesheet_department_pb";
import * as timesheet_line_pb from "./timesheet_line_pb";
import * as perdiem_pb from "./perdiem_pb";

export class Event extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getDateStarted(): string;
  setDateStarted(value: string): void;

  getDateEnded(): string;
  setDateEnded(value: string): void;

  getTimeStarted(): string;
  setTimeStarted(value: string): void;

  getTimeEnded(): string;
  setTimeEnded(value: string): void;

  getIsAllDay(): number;
  setIsAllDay(value: number): void;

  getRepeatType(): number;
  setRepeatType(value: number): void;

  getColor(): string;
  setColor(value: string): void;

  getDateUpdated(): string;
  setDateUpdated(value: string): void;

  getDateCreated(): string;
  setDateCreated(value: string): void;

  getPropertyId(): number;
  setPropertyId(value: number): void;

  getContractId(): number;
  setContractId(value: number): void;

  getContractNumber(): string;
  setContractNumber(value: string): void;

  getLogJobNumber(): string;
  setLogJobNumber(value: string): void;

  getLogJobStatus(): string;
  setLogJobStatus(value: string): void;

  getLogPo(): string;
  setLogPo(value: string): void;

  getLogNotes(): string;
  setLogNotes(value: string): void;

  getLogTechnicianAssigned(): string;
  setLogTechnicianAssigned(value: string): void;

  getLogDateCompleted(): string;
  setLogDateCompleted(value: string): void;

  getLogMaterialsUsed(): string;
  setLogMaterialsUsed(value: string): void;

  getLogServiceRendered(): string;
  setLogServiceRendered(value: string): void;

  getLogTechNotes(): string;
  setLogTechNotes(value: string): void;

  getLogBillingDate(): string;
  setLogBillingDate(value: string): void;

  getLogAmountCharged(): string;
  setLogAmountCharged(value: string): void;

  getLogPaymentType(): string;
  setLogPaymentType(value: string): void;

  getLogPaymentStatus(): string;
  setLogPaymentStatus(value: string): void;

  getLogTimeIn(): string;
  setLogTimeIn(value: string): void;

  getLogTimeOut(): string;
  setLogTimeOut(value: string): void;

  getLogType(): string;
  setLogType(value: string): void;

  getLogContractNotes(): string;
  setLogContractNotes(value: string): void;

  getInvoiceServiceItem(): string;
  setInvoiceServiceItem(value: string): void;

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

  getServices(): string;
  setServices(value: string): void;

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

  getLogNotification(): string;
  setLogNotification(value: string): void;

  getDiagnosticQuoted(): number;
  setDiagnosticQuoted(value: number): void;

  getAmountQuoted(): string;
  setAmountQuoted(value: string): void;

  getPropertyBilling(): number;
  setPropertyBilling(value: number): void;

  getIsCallback(): number;
  setIsCallback(value: number): void;

  getLogVersion(): number;
  setLogVersion(value: number): void;

  getJobTypeId(): number;
  setJobTypeId(value: number): void;

  getJobSubtypeId(): number;
  setJobSubtypeId(value: number): void;

  getCallbackOriginalId(): number;
  setCallbackOriginalId(value: number): void;

  getCallbackDisposition(): number;
  setCallbackDisposition(value: number): void;

  getCallbackComments(): string;
  setCallbackComments(value: string): void;

  getCallbackTechnician(): number;
  setCallbackTechnician(value: number): void;

  getCallbackApprovalTimestamp(): string;
  setCallbackApprovalTimestamp(value: string): void;

  getCallbackCommentBy(): number;
  setCallbackCommentBy(value: number): void;

  getDocumentId(): number;
  setDocumentId(value: number): void;

  getMaterialUsed(): string;
  setMaterialUsed(value: string): void;

  getMaterialTotal(): number;
  setMaterialTotal(value: number): void;

  getIsActive(): number;
  setIsActive(value: number): void;

  getParentId(): number;
  setParentId(value: number): void;

  getIsLmpc(): number;
  setIsLmpc(value: number): void;

  getHighPriority(): number;
  setHighPriority(value: number): void;

  getIsResidential(): number;
  setIsResidential(value: number): void;

  getJobType(): string;
  setJobType(value: string): void;

  getJobSubtype(): string;
  setJobSubtype(value: string): void;

  hasCustomer(): boolean;
  clearCustomer(): void;
  getCustomer(): user_pb.User | undefined;
  setCustomer(value?: user_pb.User): void;

  hasProperty(): boolean;
  clearProperty(): void;
  getProperty(): property_pb.Property | undefined;
  setProperty(value?: property_pb.Property): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

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

  getCountOnly(): boolean;
  setCountOnly(value: boolean): void;

  clearQuoteDataList(): void;
  getQuoteDataList(): Array<Quotable>;
  setQuoteDataList(value: Array<Quotable>): void;
  addQuoteData(value?: Quotable, index?: number): Quotable;

  getDepartmentId(): number;
  setDepartmentId(value: number): void;

  clearNotEqualsList(): void;
  getNotEqualsList(): Array<string>;
  setNotEqualsList(value: Array<string>): void;
  addNotEquals(value: string, index?: number): string;

  getWithoutLimit(): boolean;
  setWithoutLimit(value: boolean): void;

  getIsGeneratedInvoice(): boolean;
  setIsGeneratedInvoice(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Event.AsObject;
  static toObject(includeInstance: boolean, msg: Event): Event.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Event, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Event;
  static deserializeBinaryFromReader(message: Event, reader: jspb.BinaryReader): Event;
}

export namespace Event {
  export type AsObject = {
    id: number,
    name: string,
    description: string,
    dateStarted: string,
    dateEnded: string,
    timeStarted: string,
    timeEnded: string,
    isAllDay: number,
    repeatType: number,
    color: string,
    dateUpdated: string,
    dateCreated: string,
    propertyId: number,
    contractId: number,
    contractNumber: string,
    logJobNumber: string,
    logJobStatus: string,
    logPo: string,
    logNotes: string,
    logTechnicianAssigned: string,
    logDateCompleted: string,
    logMaterialsUsed: string,
    logServiceRendered: string,
    logTechNotes: string,
    logBillingDate: string,
    logAmountCharged: string,
    logPaymentType: string,
    logPaymentStatus: string,
    logTimeIn: string,
    logTimeOut: string,
    logType: string,
    logContractNotes: string,
    invoiceServiceItem: string,
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
    services: string,
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
    logNotification: string,
    diagnosticQuoted: number,
    amountQuoted: string,
    propertyBilling: number,
    isCallback: number,
    logVersion: number,
    jobTypeId: number,
    jobSubtypeId: number,
    callbackOriginalId: number,
    callbackDisposition: number,
    callbackComments: string,
    callbackTechnician: number,
    callbackApprovalTimestamp: string,
    callbackCommentBy: number,
    documentId: number,
    materialUsed: string,
    materialTotal: number,
    isActive: number,
    parentId: number,
    isLmpc: number,
    highPriority: number,
    isResidential: number,
    jobType: string,
    jobSubtype: string,
    customer?: user_pb.User.AsObject,
    property?: property_pb.Property.AsObject,
    fieldMaskList: Array<string>,
    pageNumber: number,
    orderBy: string,
    orderDir: string,
    dateTargetList: Array<string>,
    dateRangeList: Array<string>,
    countOnly: boolean,
    quoteDataList: Array<Quotable.AsObject>,
    departmentId: number,
    notEqualsList: Array<string>,
    withoutLimit: boolean,
    isGeneratedInvoice: boolean,
  }
}

export class EventList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<Event>;
  setResultsList(value: Array<Event>): void;
  addResults(value?: Event, index?: number): Event;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EventList.AsObject;
  static toObject(includeInstance: boolean, msg: EventList): EventList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EventList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EventList;
  static deserializeBinaryFromReader(message: EventList, reader: jspb.BinaryReader): EventList;
}

export namespace EventList {
  export type AsObject = {
    resultsList: Array<Event.AsObject>,
    totalCount: number,
  }
}

export class CalendarDay extends jspb.Message {
  clearServiceCallsList(): void;
  getServiceCallsList(): Array<Event>;
  setServiceCallsList(value: Array<Event>): void;
  addServiceCalls(value?: Event, index?: number): Event;

  clearCompletedServiceCallsList(): void;
  getCompletedServiceCallsList(): Array<Event>;
  setCompletedServiceCallsList(value: Array<Event>): void;
  addCompletedServiceCalls(value?: Event, index?: number): Event;

  clearRemindersList(): void;
  getRemindersList(): Array<Event>;
  setRemindersList(value: Array<Event>): void;
  addReminders(value?: Event, index?: number): Event;

  clearTimeoffRequestsList(): void;
  getTimeoffRequestsList(): Array<timeoff_request_pb.TimeoffRequest>;
  setTimeoffRequestsList(value: Array<timeoff_request_pb.TimeoffRequest>): void;
  addTimeoffRequests(value?: timeoff_request_pb.TimeoffRequest, index?: number): timeoff_request_pb.TimeoffRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CalendarDay.AsObject;
  static toObject(includeInstance: boolean, msg: CalendarDay): CalendarDay.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CalendarDay, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CalendarDay;
  static deserializeBinaryFromReader(message: CalendarDay, reader: jspb.BinaryReader): CalendarDay;
}

export namespace CalendarDay {
  export type AsObject = {
    serviceCallsList: Array<Event.AsObject>,
    completedServiceCallsList: Array<Event.AsObject>,
    remindersList: Array<Event.AsObject>,
    timeoffRequestsList: Array<timeoff_request_pb.TimeoffRequest.AsObject>,
  }
}

export class CalendarData extends jspb.Message {
  getDatesMap(): jspb.Map<string, CalendarDay>;
  clearDatesMap(): void;
  getCustomersMap(): jspb.Map<number, string>;
  clearCustomersMap(): void;
  getZipCodesMap(): jspb.Map<string, string>;
  clearZipCodesMap(): void;
  getStatesMap(): jspb.Map<string, string>;
  clearStatesMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CalendarData.AsObject;
  static toObject(includeInstance: boolean, msg: CalendarData): CalendarData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CalendarData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CalendarData;
  static deserializeBinaryFromReader(message: CalendarData, reader: jspb.BinaryReader): CalendarData;
}

export namespace CalendarData {
  export type AsObject = {
    datesMap: Array<[string, CalendarDay.AsObject]>,
    customersMap: Array<[number, string]>,
    zipCodesMap: Array<[string, string]>,
    statesMap: Array<[string, string]>,
  }
}

export class Quotable extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getEventId(): number;
  setEventId(value: number): void;

  getQuoteUsedId(): number;
  setQuoteUsedId(value: number): void;

  getServicesRenderedId(): number;
  setServicesRenderedId(value: number): void;

  getQuoteLineId(): number;
  setQuoteLineId(value: number): void;

  getDescription(): string;
  setDescription(value: string): void;

  getQuotedPrice(): number;
  setQuotedPrice(value: number): void;

  getQuantity(): number;
  setQuantity(value: number): void;

  getIsBillable(): boolean;
  setIsBillable(value: boolean): void;

  getIsLmpc(): boolean;
  setIsLmpc(value: boolean): void;

  getIsFlatrate(): boolean;
  setIsFlatrate(value: boolean): void;

  getIsComplex(): boolean;
  setIsComplex(value: boolean): void;

  getIsActive(): boolean;
  setIsActive(value: boolean): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Quotable.AsObject;
  static toObject(includeInstance: boolean, msg: Quotable): Quotable.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Quotable, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Quotable;
  static deserializeBinaryFromReader(message: Quotable, reader: jspb.BinaryReader): Quotable;
}

export namespace Quotable {
  export type AsObject = {
    id: number,
    eventId: number,
    quoteUsedId: number,
    servicesRenderedId: number,
    quoteLineId: number,
    description: string,
    quotedPrice: number,
    quantity: number,
    isBillable: boolean,
    isLmpc: boolean,
    isFlatrate: boolean,
    isComplex: boolean,
    isActive: boolean,
    fieldMaskList: Array<string>,
  }
}

export class QuotableRead extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getEventId(): number;
  setEventId(value: number): void;

  getQuoteUsedId(): number;
  setQuoteUsedId(value: number): void;

  getServicesRenderedId(): number;
  setServicesRenderedId(value: number): void;

  getQuoteLineId(): number;
  setQuoteLineId(value: number): void;

  getDescription(): string;
  setDescription(value: string): void;

  getQuotedPrice(): number;
  setQuotedPrice(value: number): void;

  getQuantity(): number;
  setQuantity(value: number): void;

  getIsBillable(): boolean;
  setIsBillable(value: boolean): void;

  getIsLmpc(): boolean;
  setIsLmpc(value: boolean): void;

  getIsFlatrate(): boolean;
  setIsFlatrate(value: boolean): void;

  getIsComplex(): boolean;
  setIsComplex(value: boolean): void;

  getIsActive(): boolean;
  setIsActive(value: boolean): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  clearNotEqualsList(): void;
  getNotEqualsList(): Array<string>;
  setNotEqualsList(value: Array<string>): void;
  addNotEquals(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  getOrderBy(): string;
  setOrderBy(value: string): void;

  getOrderDir(): string;
  setOrderDir(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuotableRead.AsObject;
  static toObject(includeInstance: boolean, msg: QuotableRead): QuotableRead.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QuotableRead, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuotableRead;
  static deserializeBinaryFromReader(message: QuotableRead, reader: jspb.BinaryReader): QuotableRead;
}

export namespace QuotableRead {
  export type AsObject = {
    id: number,
    eventId: number,
    quoteUsedId: number,
    servicesRenderedId: number,
    quoteLineId: number,
    description: string,
    quotedPrice: number,
    quantity: number,
    isBillable: boolean,
    isLmpc: boolean,
    isFlatrate: boolean,
    isComplex: boolean,
    isActive: boolean,
    fieldMaskList: Array<string>,
    notEqualsList: Array<string>,
    pageNumber: number,
    orderBy: string,
    orderDir: string,
  }
}

export class QuotableList extends jspb.Message {
  clearDataList(): void;
  getDataList(): Array<Quotable>;
  setDataList(value: Array<Quotable>): void;
  addData(value?: Quotable, index?: number): Quotable;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuotableList.AsObject;
  static toObject(includeInstance: boolean, msg: QuotableList): QuotableList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QuotableList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuotableList;
  static deserializeBinaryFromReader(message: QuotableList, reader: jspb.BinaryReader): QuotableList;
}

export namespace QuotableList {
  export type AsObject = {
    dataList: Array<Quotable.AsObject>,
    totalCount: number,
  }
}

export class CostReportData extends jspb.Message {
  hasTransactionResults(): boolean;
  clearTransactionResults(): void;
  getTransactionResults(): transaction_pb.TransactionList | undefined;
  setTransactionResults(value?: transaction_pb.TransactionList): void;

  hasTimesheetResults(): boolean;
  clearTimesheetResults(): void;
  getTimesheetResults(): timesheet_line_pb.TimesheetLineList | undefined;
  setTimesheetResults(value?: timesheet_line_pb.TimesheetLineList): void;

  hasPerDiemResults(): boolean;
  clearPerDiemResults(): void;
  getPerDiemResults(): perdiem_pb.PerDiemList | undefined;
  setPerDiemResults(value?: perdiem_pb.PerDiemList): void;

  hasTaskResults(): boolean;
  clearTaskResults(): void;
  getTaskResults(): task_pb.TaskList | undefined;
  setTaskResults(value?: task_pb.TaskList): void;

  hasTripResults(): boolean;
  clearTripResults(): void;
  getTripResults(): perdiem_pb.TripList | undefined;
  setTripResults(value?: perdiem_pb.TripList): void;

  hasEventResult(): boolean;
  clearEventResult(): void;
  getEventResult(): Event | undefined;
  setEventResult(value?: Event): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CostReportData.AsObject;
  static toObject(includeInstance: boolean, msg: CostReportData): CostReportData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CostReportData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CostReportData;
  static deserializeBinaryFromReader(message: CostReportData, reader: jspb.BinaryReader): CostReportData;
}

export namespace CostReportData {
  export type AsObject = {
    transactionResults?: transaction_pb.TransactionList.AsObject,
    timesheetResults?: timesheet_line_pb.TimesheetLineList.AsObject,
    perDiemResults?: perdiem_pb.PerDiemList.AsObject,
    taskResults?: task_pb.TaskList.AsObject,
    tripResults?: perdiem_pb.TripList.AsObject,
    eventResult?: Event.AsObject,
  }
}

export class CostReportReq extends jspb.Message {
  hasTimesheetReq(): boolean;
  clearTimesheetReq(): void;
  getTimesheetReq(): timesheet_line_pb.TimesheetLine | undefined;
  setTimesheetReq(value?: timesheet_line_pb.TimesheetLine): void;

  hasPerdiemReq(): boolean;
  clearPerdiemReq(): void;
  getPerdiemReq(): perdiem_pb.PerDiem | undefined;
  setPerdiemReq(value?: perdiem_pb.PerDiem): void;

  hasTaskReq(): boolean;
  clearTaskReq(): void;
  getTaskReq(): task_pb.Task | undefined;
  setTaskReq(value?: task_pb.Task): void;

  hasTripReq(): boolean;
  clearTripReq(): void;
  getTripReq(): perdiem_pb.Trip | undefined;
  setTripReq(value?: perdiem_pb.Trip): void;

  hasTransactionReq(): boolean;
  clearTransactionReq(): void;
  getTransactionReq(): transaction_pb.Transaction | undefined;
  setTransactionReq(value?: transaction_pb.Transaction): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CostReportReq.AsObject;
  static toObject(includeInstance: boolean, msg: CostReportReq): CostReportReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CostReportReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CostReportReq;
  static deserializeBinaryFromReader(message: CostReportReq, reader: jspb.BinaryReader): CostReportReq;
}

export namespace CostReportReq {
  export type AsObject = {
    timesheetReq?: timesheet_line_pb.TimesheetLine.AsObject,
    perdiemReq?: perdiem_pb.PerDiem.AsObject,
    taskReq?: task_pb.Task.AsObject,
    tripReq?: perdiem_pb.Trip.AsObject,
    transactionReq?: transaction_pb.Transaction.AsObject,
  }
}

export class CostReportInfo extends jspb.Message {
  getJobId(): number;
  setJobId(value: number): void;

  getTxnId(): number;
  setTxnId(value: number): void;

  getPerDiemId(): number;
  setPerDiemId(value: number): void;

  getTimeStarted(): string;
  setTimeStarted(value: string): void;

  getTimeFinished(): string;
  setTimeFinished(value: string): void;

  getTransactionDescription(): string;
  setTransactionDescription(value: string): void;

  getPerDiemMealsOnly(): boolean;
  setPerDiemMealsOnly(value: boolean): void;

  getAmount(): number;
  setAmount(value: number): void;

  getTransactionNotes(): string;
  setTransactionNotes(value: string): void;

  getDepartmentId(): number;
  setDepartmentId(value: number): void;

  getOwnerId(): number;
  setOwnerId(value: number): void;

  getVendor(): string;
  setVendor(value: string): void;

  getDepartmentName(): string;
  setDepartmentName(value: string): void;

  getOwnerName(): string;
  setOwnerName(value: string): void;

  getDateStarted(): string;
  setDateStarted(value: string): void;

  getDateSubmitted(): string;
  setDateSubmitted(value: string): void;

  getDateApproved(): string;
  setDateApproved(value: string): void;

  getPerDiemApprovedById(): string;
  setPerDiemApprovedById(value: string): void;

  getPerDiemDepartmentId(): number;
  setPerDiemDepartmentId(value: number): void;

  getPerDiemDepartmentName(): string;
  setPerDiemDepartmentName(value: string): void;

  getPerDiemOwnerId(): string;
  setPerDiemOwnerId(value: string): void;

  getPerDiemOwnerName(): string;
  setPerDiemOwnerName(value: string): void;

  hasDepartment(): boolean;
  clearDepartment(): void;
  getDepartment(): transaction_pb.TxnDepartment | undefined;
  setDepartment(value?: transaction_pb.TxnDepartment): void;

  getDepartmentString(): string;
  setDepartmentString(value: string): void;

  getCostCenterId(): number;
  setCostCenterId(value: number): void;

  getCostCenterString(): string;
  setCostCenterString(value: string): void;

  hasCostCenter(): boolean;
  clearCostCenter(): void;
  getCostCenter(): transaction_account_pb.TransactionAccount | undefined;
  setCostCenter(value?: transaction_account_pb.TransactionAccount): void;

  hasPerDiemDepartment(): boolean;
  clearPerDiemDepartment(): void;
  getPerDiemDepartment(): timesheet_department_pb.TimesheetDepartment | undefined;
  setPerDiemDepartment(value?: timesheet_department_pb.TimesheetDepartment): void;

  getPerDiemDepartmentString(): string;
  setPerDiemDepartmentString(value: string): void;

  getPerDiemApprovedByName(): string;
  setPerDiemApprovedByName(value: string): void;

  getPerDiemRowDateString(): string;
  setPerDiemRowDateString(value: string): void;

  getPerDiemRowZipCode(): string;
  setPerDiemRowZipCode(value: string): void;

  getPerDiemRowNotes(): string;
  setPerDiemRowNotes(value: string): void;

  getPerDiemRowId(): number;
  setPerDiemRowId(value: number): void;

  getPerDiemRowServiceCallId(): number;
  setPerDiemRowServiceCallId(value: number): void;

  getTimesheetNotes(): string;
  setTimesheetNotes(value: string): void;

  getTimesheetAdminApprovalId(): number;
  setTimesheetAdminApprovalId(value: number): void;

  getTimesheetBriefDescription(): string;
  setTimesheetBriefDescription(value: string): void;

  getTimesheetDepartmentId(): number;
  setTimesheetDepartmentId(value: number): void;

  getTimesheetDepartmentName(): string;
  setTimesheetDepartmentName(value: string): void;

  getTimesheetAdminApprovalName(): string;
  setTimesheetAdminApprovalName(value: string): void;

  hasPerDiem(): boolean;
  clearPerDiem(): void;
  getPerDiem(): perdiem_pb.PerDiem | undefined;
  setPerDiem(value?: perdiem_pb.PerDiem): void;

  clearTimesheetsList(): void;
  getTimesheetsList(): Array<timesheet_line_pb.TimesheetLine>;
  setTimesheetsList(value: Array<timesheet_line_pb.TimesheetLine>): void;
  addTimesheets(value?: timesheet_line_pb.TimesheetLine, index?: number): timesheet_line_pb.TimesheetLine;

  getHoursWorked(): number;
  setHoursWorked(value: number): void;

  getTimestamp(): string;
  setTimestamp(value: string): void;

  clearTransactionsList(): void;
  getTransactionsList(): Array<transaction_pb.Transaction>;
  setTransactionsList(value: Array<transaction_pb.Transaction>): void;
  addTransactions(value?: transaction_pb.Transaction, index?: number): transaction_pb.Transaction;

  clearPerDiemsList(): void;
  getPerDiemsList(): Array<perdiem_pb.PerDiem>;
  setPerDiemsList(value: Array<perdiem_pb.PerDiem>): void;
  addPerDiems(value?: perdiem_pb.PerDiem, index?: number): perdiem_pb.PerDiem;

  hasPerDiemRow(): boolean;
  clearPerDiemRow(): void;
  getPerDiemRow(): perdiem_pb.PerDiemRow | undefined;
  setPerDiemRow(value?: perdiem_pb.PerDiemRow): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CostReportInfo.AsObject;
  static toObject(includeInstance: boolean, msg: CostReportInfo): CostReportInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CostReportInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CostReportInfo;
  static deserializeBinaryFromReader(message: CostReportInfo, reader: jspb.BinaryReader): CostReportInfo;
}

export namespace CostReportInfo {
  export type AsObject = {
    jobId: number,
    txnId: number,
    perDiemId: number,
    timeStarted: string,
    timeFinished: string,
    transactionDescription: string,
    perDiemMealsOnly: boolean,
    amount: number,
    transactionNotes: string,
    departmentId: number,
    ownerId: number,
    vendor: string,
    departmentName: string,
    ownerName: string,
    dateStarted: string,
    dateSubmitted: string,
    dateApproved: string,
    perDiemApprovedById: string,
    perDiemDepartmentId: number,
    perDiemDepartmentName: string,
    perDiemOwnerId: string,
    perDiemOwnerName: string,
    department?: transaction_pb.TxnDepartment.AsObject,
    departmentString: string,
    costCenterId: number,
    costCenterString: string,
    costCenter?: transaction_account_pb.TransactionAccount.AsObject,
    perDiemDepartment?: timesheet_department_pb.TimesheetDepartment.AsObject,
    perDiemDepartmentString: string,
    perDiemApprovedByName: string,
    perDiemRowDateString: string,
    perDiemRowZipCode: string,
    perDiemRowNotes: string,
    perDiemRowId: number,
    perDiemRowServiceCallId: number,
    timesheetNotes: string,
    timesheetAdminApprovalId: number,
    timesheetBriefDescription: string,
    timesheetDepartmentId: number,
    timesheetDepartmentName: string,
    timesheetAdminApprovalName: string,
    perDiem?: perdiem_pb.PerDiem.AsObject,
    timesheetsList: Array<timesheet_line_pb.TimesheetLine.AsObject>,
    hoursWorked: number,
    timestamp: string,
    transactionsList: Array<transaction_pb.Transaction.AsObject>,
    perDiemsList: Array<perdiem_pb.PerDiem.AsObject>,
    perDiemRow?: perdiem_pb.PerDiemRow.AsObject,
  }
}

export class CostReportInfoList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<CostReportInfo>;
  setResultsList(value: Array<CostReportInfo>): void;
  addResults(value?: CostReportInfo, index?: number): CostReportInfo;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CostReportInfoList.AsObject;
  static toObject(includeInstance: boolean, msg: CostReportInfoList): CostReportInfoList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CostReportInfoList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CostReportInfoList;
  static deserializeBinaryFromReader(message: CostReportInfoList, reader: jspb.BinaryReader): CostReportInfoList;
}

export namespace CostReportInfoList {
  export type AsObject = {
    resultsList: Array<CostReportInfo.AsObject>,
    totalCount: number,
  }
}

