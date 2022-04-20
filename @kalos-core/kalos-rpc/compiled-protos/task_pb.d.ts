// package: 
// file: task.proto

import * as jspb from "google-protobuf";
import * as spiff_tool_admin_action_pb from "./spiff_tool_admin_action_pb";
import * as common_pb from "./common_pb";
import * as user_pb from "./user_pb";

export class Task extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getExternalId(): number;
  setExternalId(value: number): void;

  getExternalCode(): string;
  setExternalCode(value: string): void;

  getReferenceNumber(): string;
  setReferenceNumber(value: string): void;

  getCreatorUserId(): number;
  setCreatorUserId(value: number): void;

  getTimeCreated(): string;
  setTimeCreated(value: string): void;

  getTimeDue(): string;
  setTimeDue(value: string): void;

  getBriefDescription(): string;
  setBriefDescription(value: string): void;

  getDetails(): string;
  setDetails(value: string): void;

  getNotes(): string;
  setNotes(value: string): void;

  getStatusId(): number;
  setStatusId(value: number): void;

  getPriorityId(): number;
  setPriorityId(value: number): void;

  getReferenceUrl(): string;
  setReferenceUrl(value: string): void;

  getIsActive(): boolean;
  setIsActive(value: boolean): void;

  getBillable(): number;
  setBillable(value: number): void;

  getBillableType(): string;
  setBillableType(value: string): void;

  getFlatRate(): number;
  setFlatRate(value: number): void;

  getHourlyStart(): string;
  setHourlyStart(value: string): void;

  getHourlyEnd(): string;
  setHourlyEnd(value: string): void;

  getAddress(): string;
  setAddress(value: string): void;

  getOrderNum(): string;
  setOrderNum(value: string): void;

  getSpiffAmount(): number;
  setSpiffAmount(value: number): void;

  getSpiffJobNumber(): string;
  setSpiffJobNumber(value: string): void;

  getSpiffTypeId(): number;
  setSpiffTypeId(value: number): void;

  getSpiffAddress(): string;
  setSpiffAddress(value: string): void;

  getToolpurchaseDate(): string;
  setToolpurchaseDate(value: string): void;

  getToolpurchaseCost(): number;
  setToolpurchaseCost(value: number): void;

  getToolpurchaseFile(): string;
  setToolpurchaseFile(value: string): void;

  getAdminActionId(): number;
  setAdminActionId(value: number): void;

  getDatePerformed(): string;
  setDatePerformed(value: string): void;

  getSpiffToolId(): string;
  setSpiffToolId(value: string): void;

  getSpiffToolCloseoutDate(): string;
  setSpiffToolCloseoutDate(value: string): void;

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

  hasEvent(): boolean;
  clearEvent(): void;
  getEvent(): TaskEventData | undefined;
  setEvent(value?: TaskEventData): void;

  getOwnerName(): string;
  setOwnerName(value: string): void;

  clearActionsList(): void;
  getActionsList(): Array<spiff_tool_admin_action_pb.SpiffToolAdminAction>;
  setActionsList(value: Array<spiff_tool_admin_action_pb.SpiffToolAdminAction>): void;
  addActions(value?: spiff_tool_admin_action_pb.SpiffToolAdminAction, index?: number): spiff_tool_admin_action_pb.SpiffToolAdminAction;

  hasStatus(): boolean;
  clearStatus(): void;
  getStatus(): TaskStatus | undefined;
  setStatus(value?: TaskStatus): void;

  getOrderBy(): string;
  setOrderBy(value: string): void;

  getOrderDir(): string;
  setOrderDir(value: string): void;

  clearDateTargetList(): void;
  getDateTargetList(): Array<string>;
  setDateTargetList(value: Array<string>): void;
  addDateTarget(value: string, index?: number): string;

  hasReferenceAction(): boolean;
  clearReferenceAction(): void;
  getReferenceAction(): spiff_tool_admin_action_pb.SpiffToolAdminAction | undefined;
  setReferenceAction(value?: spiff_tool_admin_action_pb.SpiffToolAdminAction): void;

  clearDuplicatesList(): void;
  getDuplicatesList(): Array<SpiffDuplicate>;
  setDuplicatesList(value: Array<SpiffDuplicate>): void;
  addDuplicates(value?: SpiffDuplicate, index?: number): SpiffDuplicate;

  getEventId(): number;
  setEventId(value: number): void;

  getGroupBy(): string;
  setGroupBy(value: string): void;

  clearNotEqualsList(): void;
  getNotEqualsList(): Array<string>;
  setNotEqualsList(value: Array<string>): void;
  addNotEquals(value: string, index?: number): string;

  getPayrollProcessed(): boolean;
  setPayrollProcessed(value: boolean): void;

  hasSearchAction(): boolean;
  clearSearchAction(): void;
  getSearchAction(): spiff_tool_admin_action_pb.SpiffToolAdminAction | undefined;
  setSearchAction(value?: spiff_tool_admin_action_pb.SpiffToolAdminAction): void;

  getNeedsAuditing(): boolean;
  setNeedsAuditing(value: boolean): void;

  hasSearchUser(): boolean;
  clearSearchUser(): void;
  getSearchUser(): user_pb.User | undefined;
  setSearchUser(value?: user_pb.User): void;

  hasSpiffType(): boolean;
  clearSpiffType(): void;
  getSpiffType(): SpiffType | undefined;
  setSpiffType(value?: SpiffType): void;

  getCheckedIn(): boolean;
  setCheckedIn(value: boolean): void;

  getWithoutLimit(): boolean;
  setWithoutLimit(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Task.AsObject;
  static toObject(includeInstance: boolean, msg: Task): Task.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Task, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Task;
  static deserializeBinaryFromReader(message: Task, reader: jspb.BinaryReader): Task;
}

export namespace Task {
  export type AsObject = {
    id: number,
    externalId: number,
    externalCode: string,
    referenceNumber: string,
    creatorUserId: number,
    timeCreated: string,
    timeDue: string,
    briefDescription: string,
    details: string,
    notes: string,
    statusId: number,
    priorityId: number,
    referenceUrl: string,
    isActive: boolean,
    billable: number,
    billableType: string,
    flatRate: number,
    hourlyStart: string,
    hourlyEnd: string,
    address: string,
    orderNum: string,
    spiffAmount: number,
    spiffJobNumber: string,
    spiffTypeId: number,
    spiffAddress: string,
    toolpurchaseDate: string,
    toolpurchaseCost: number,
    toolpurchaseFile: string,
    adminActionId: number,
    datePerformed: string,
    spiffToolId: string,
    spiffToolCloseoutDate: string,
    fieldMaskList: Array<string>,
    pageNumber: number,
    dateRangeList: Array<string>,
    event?: TaskEventData.AsObject,
    ownerName: string,
    actionsList: Array<spiff_tool_admin_action_pb.SpiffToolAdminAction.AsObject>,
    status?: TaskStatus.AsObject,
    orderBy: string,
    orderDir: string,
    dateTargetList: Array<string>,
    referenceAction?: spiff_tool_admin_action_pb.SpiffToolAdminAction.AsObject,
    duplicatesList: Array<SpiffDuplicate.AsObject>,
    eventId: number,
    groupBy: string,
    notEqualsList: Array<string>,
    payrollProcessed: boolean,
    searchAction?: spiff_tool_admin_action_pb.SpiffToolAdminAction.AsObject,
    needsAuditing: boolean,
    searchUser?: user_pb.User.AsObject,
    spiffType?: SpiffType.AsObject,
    checkedIn: boolean,
    withoutLimit: boolean,
  }
}

export class TaskList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<Task>;
  setResultsList(value: Array<Task>): void;
  addResults(value?: Task, index?: number): Task;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TaskList.AsObject;
  static toObject(includeInstance: boolean, msg: TaskList): TaskList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TaskList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TaskList;
  static deserializeBinaryFromReader(message: TaskList, reader: jspb.BinaryReader): TaskList;
}

export namespace TaskList {
  export type AsObject = {
    resultsList: Array<Task.AsObject>,
    totalCount: number,
  }
}

export class ToolFund extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ToolFund.AsObject;
  static toObject(includeInstance: boolean, msg: ToolFund): ToolFund.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ToolFund, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ToolFund;
  static deserializeBinaryFromReader(message: ToolFund, reader: jspb.BinaryReader): ToolFund;
}

export namespace ToolFund {
  export type AsObject = {
    id: number,
    value: number,
  }
}

export class Spiff extends jspb.Message {
  getTimeCreated(): string;
  setTimeCreated(value: string): void;

  getBriefDescription(): string;
  setBriefDescription(value: string): void;

  getDetails(): string;
  setDetails(value: string): void;

  getNotes(): string;
  setNotes(value: string): void;

  getStatusId(): number;
  setStatusId(value: number): void;

  getSpiffAmount(): number;
  setSpiffAmount(value: number): void;

  getSpiffJobnumber(): string;
  setSpiffJobnumber(value: string): void;

  getSpiffType(): string;
  setSpiffType(value: string): void;

  getSpiffAddress(): string;
  setSpiffAddress(value: string): void;

  getReviewedBy(): string;
  setReviewedBy(value: string): void;

  getStatus(): string;
  setStatus(value: string): void;

  getReason(): string;
  setReason(value: string): void;

  getDecisionDate(): string;
  setDecisionDate(value: string): void;

  getExternalId(): number;
  setExternalId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Spiff.AsObject;
  static toObject(includeInstance: boolean, msg: Spiff): Spiff.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Spiff, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Spiff;
  static deserializeBinaryFromReader(message: Spiff, reader: jspb.BinaryReader): Spiff;
}

export namespace Spiff {
  export type AsObject = {
    timeCreated: string,
    briefDescription: string,
    details: string,
    notes: string,
    statusId: number,
    spiffAmount: number,
    spiffJobnumber: string,
    spiffType: string,
    spiffAddress: string,
    reviewedBy: string,
    status: string,
    reason: string,
    decisionDate: string,
    externalId: number,
  }
}

export class SpiffList extends jspb.Message {
  clearResultsListList(): void;
  getResultsListList(): Array<Spiff>;
  setResultsListList(value: Array<Spiff>): void;
  addResultsList(value?: Spiff, index?: number): Spiff;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SpiffList.AsObject;
  static toObject(includeInstance: boolean, msg: SpiffList): SpiffList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SpiffList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SpiffList;
  static deserializeBinaryFromReader(message: SpiffList, reader: jspb.BinaryReader): SpiffList;
}

export namespace SpiffList {
  export type AsObject = {
    resultsListList: Array<Spiff.AsObject>,
  }
}

export class TaskEventData extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getPropertyId(): number;
  setPropertyId(value: number): void;

  getCustomerId(): number;
  setCustomerId(value: number): void;

  getContractId(): number;
  setContractId(value: number): void;

  getContractNumber(): string;
  setContractNumber(value: string): void;

  getLogJobNumber(): string;
  setLogJobNumber(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TaskEventData.AsObject;
  static toObject(includeInstance: boolean, msg: TaskEventData): TaskEventData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TaskEventData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TaskEventData;
  static deserializeBinaryFromReader(message: TaskEventData, reader: jspb.BinaryReader): TaskEventData;
}

export namespace TaskEventData {
  export type AsObject = {
    id: number,
    propertyId: number,
    customerId: number,
    contractId: number,
    contractNumber: string,
    logJobNumber: string,
  }
}

export class TaskStatus extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getCode(): string;
  setCode(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getWeight(): number;
  setWeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TaskStatus.AsObject;
  static toObject(includeInstance: boolean, msg: TaskStatus): TaskStatus.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TaskStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TaskStatus;
  static deserializeBinaryFromReader(message: TaskStatus, reader: jspb.BinaryReader): TaskStatus;
}

export namespace TaskStatus {
  export type AsObject = {
    id: number,
    code: string,
    description: string,
    weight: number,
  }
}

export class TaskPriority extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getCode(): string;
  setCode(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TaskPriority.AsObject;
  static toObject(includeInstance: boolean, msg: TaskPriority): TaskPriority.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TaskPriority, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TaskPriority;
  static deserializeBinaryFromReader(message: TaskPriority, reader: jspb.BinaryReader): TaskPriority;
}

export namespace TaskPriority {
  export type AsObject = {
    id: number,
    code: string,
    description: string,
  }
}

export class TaskPriorityList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<TaskPriority>;
  setResultsList(value: Array<TaskPriority>): void;
  addResults(value?: TaskPriority, index?: number): TaskPriority;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TaskPriorityList.AsObject;
  static toObject(includeInstance: boolean, msg: TaskPriorityList): TaskPriorityList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TaskPriorityList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TaskPriorityList;
  static deserializeBinaryFromReader(message: TaskPriorityList, reader: jspb.BinaryReader): TaskPriorityList;
}

export namespace TaskPriorityList {
  export type AsObject = {
    resultsList: Array<TaskPriority.AsObject>,
  }
}

export class SpiffDuplicate extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getSpiffTypeId(): number;
  setSpiffTypeId(value: number): void;

  getTimeDue(): string;
  setTimeDue(value: string): void;

  getOwnerName(): string;
  setOwnerName(value: string): void;

  clearActionsList(): void;
  getActionsList(): Array<spiff_tool_admin_action_pb.SpiffToolAdminAction>;
  setActionsList(value: Array<spiff_tool_admin_action_pb.SpiffToolAdminAction>): void;
  addActions(value?: spiff_tool_admin_action_pb.SpiffToolAdminAction, index?: number): spiff_tool_admin_action_pb.SpiffToolAdminAction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SpiffDuplicate.AsObject;
  static toObject(includeInstance: boolean, msg: SpiffDuplicate): SpiffDuplicate.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SpiffDuplicate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SpiffDuplicate;
  static deserializeBinaryFromReader(message: SpiffDuplicate, reader: jspb.BinaryReader): SpiffDuplicate;
}

export namespace SpiffDuplicate {
  export type AsObject = {
    id: number,
    spiffTypeId: number,
    timeDue: string,
    ownerName: string,
    actionsList: Array<spiff_tool_admin_action_pb.SpiffToolAdminAction.AsObject>,
  }
}

export class SpiffType extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getExt(): string;
  setExt(value: string): void;

  getType(): string;
  setType(value: string): void;

  getPayout(): string;
  setPayout(value: string): void;

  getDuration(): string;
  setDuration(value: string): void;

  getIsActive(): boolean;
  setIsActive(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SpiffType.AsObject;
  static toObject(includeInstance: boolean, msg: SpiffType): SpiffType.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SpiffType, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SpiffType;
  static deserializeBinaryFromReader(message: SpiffType, reader: jspb.BinaryReader): SpiffType;
}

export namespace SpiffType {
  export type AsObject = {
    id: number,
    ext: string,
    type: string,
    payout: string,
    duration: string,
    isActive: boolean,
  }
}

export class SpiffTypeList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<SpiffType>;
  setResultsList(value: Array<SpiffType>): void;
  addResults(value?: SpiffType, index?: number): SpiffType;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SpiffTypeList.AsObject;
  static toObject(includeInstance: boolean, msg: SpiffTypeList): SpiffTypeList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SpiffTypeList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SpiffTypeList;
  static deserializeBinaryFromReader(message: SpiffTypeList, reader: jspb.BinaryReader): SpiffTypeList;
}

export namespace SpiffTypeList {
  export type AsObject = {
    resultsList: Array<SpiffType.AsObject>,
    totalCount: number,
  }
}

export class ProjectTask extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getExternalId(): number;
  setExternalId(value: number): void;

  getExternalCode(): string;
  setExternalCode(value: string): void;

  getReferenceNumber(): string;
  setReferenceNumber(value: string): void;

  getCreatorUserId(): number;
  setCreatorUserId(value: number): void;

  getTimeCreated(): string;
  setTimeCreated(value: string): void;

  getBriefDescription(): string;
  setBriefDescription(value: string): void;

  getDetails(): string;
  setDetails(value: string): void;

  getNotes(): string;
  setNotes(value: string): void;

  getStatusId(): number;
  setStatusId(value: number): void;

  getPriorityId(): number;
  setPriorityId(value: number): void;

  getIsActive(): boolean;
  setIsActive(value: boolean): void;

  getStartDate(): string;
  setStartDate(value: string): void;

  getEndDate(): string;
  setEndDate(value: string): void;

  getEventId(): number;
  setEventId(value: number): void;

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

  getOwnerName(): string;
  setOwnerName(value: string): void;

  hasStatus(): boolean;
  clearStatus(): void;
  getStatus(): TaskStatus | undefined;
  setStatus(value?: TaskStatus): void;

  hasPriority(): boolean;
  clearPriority(): void;
  getPriority(): TaskPriority | undefined;
  setPriority(value?: TaskPriority): void;

  getOrderBy(): string;
  setOrderBy(value: string): void;

  getOrderDir(): string;
  setOrderDir(value: string): void;

  getGroupBy(): string;
  setGroupBy(value: string): void;

  getCheckedIn(): boolean;
  setCheckedIn(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProjectTask.AsObject;
  static toObject(includeInstance: boolean, msg: ProjectTask): ProjectTask.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProjectTask, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProjectTask;
  static deserializeBinaryFromReader(message: ProjectTask, reader: jspb.BinaryReader): ProjectTask;
}

export namespace ProjectTask {
  export type AsObject = {
    id: number,
    externalId: number,
    externalCode: string,
    referenceNumber: string,
    creatorUserId: number,
    timeCreated: string,
    briefDescription: string,
    details: string,
    notes: string,
    statusId: number,
    priorityId: number,
    isActive: boolean,
    startDate: string,
    endDate: string,
    eventId: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
    dateRangeList: Array<string>,
    dateTargetList: Array<string>,
    ownerName: string,
    status?: TaskStatus.AsObject,
    priority?: TaskPriority.AsObject,
    orderBy: string,
    orderDir: string,
    groupBy: string,
    checkedIn: boolean,
  }
}

export class ProjectTaskList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<ProjectTask>;
  setResultsList(value: Array<ProjectTask>): void;
  addResults(value?: ProjectTask, index?: number): ProjectTask;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProjectTaskList.AsObject;
  static toObject(includeInstance: boolean, msg: ProjectTaskList): ProjectTaskList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProjectTaskList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProjectTaskList;
  static deserializeBinaryFromReader(message: ProjectTaskList, reader: jspb.BinaryReader): ProjectTaskList;
}

export namespace ProjectTaskList {
  export type AsObject = {
    resultsList: Array<ProjectTask.AsObject>,
    totalCount: number,
  }
}

export class TaskStatusList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<TaskStatus>;
  setResultsList(value: Array<TaskStatus>): void;
  addResults(value?: TaskStatus, index?: number): TaskStatus;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TaskStatusList.AsObject;
  static toObject(includeInstance: boolean, msg: TaskStatusList): TaskStatusList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TaskStatusList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TaskStatusList;
  static deserializeBinaryFromReader(message: TaskStatusList, reader: jspb.BinaryReader): TaskStatusList;
}

export namespace TaskStatusList {
  export type AsObject = {
    resultsList: Array<TaskStatus.AsObject>,
  }
}

export class TaskBillableTypeList extends jspb.Message {
  clearTypesList(): void;
  getTypesList(): Array<string>;
  setTypesList(value: Array<string>): void;
  addTypes(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TaskBillableTypeList.AsObject;
  static toObject(includeInstance: boolean, msg: TaskBillableTypeList): TaskBillableTypeList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TaskBillableTypeList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TaskBillableTypeList;
  static deserializeBinaryFromReader(message: TaskBillableTypeList, reader: jspb.BinaryReader): TaskBillableTypeList;
}

export namespace TaskBillableTypeList {
  export type AsObject = {
    typesList: Array<string>,
  }
}

