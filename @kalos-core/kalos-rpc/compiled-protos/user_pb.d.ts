// package: 
// file: user.proto

import * as jspb from "google-protobuf";
import * as services_rendered_pb from "./services_rendered_pb";
import * as property_pb from "./property_pb";
import * as timesheet_department_pb from "./timesheet_department_pb";
import * as common_pb from "./common_pb";

export class User extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getFirstname(): string;
  setFirstname(value: string): void;

  getLastname(): string;
  setLastname(value: string): void;

  getBusinessname(): string;
  setBusinessname(value: string): void;

  getCity(): string;
  setCity(value: string): void;

  getState(): string;
  setState(value: string): void;

  getZip(): string;
  setZip(value: string): void;

  getAddress(): string;
  setAddress(value: string): void;

  getPhone(): string;
  setPhone(value: string): void;

  getAltphone(): string;
  setAltphone(value: string): void;

  getCellphone(): string;
  setCellphone(value: string): void;

  getFax(): string;
  setFax(value: string): void;

  getEmail(): string;
  setEmail(value: string): void;

  getAltEmail(): string;
  setAltEmail(value: string): void;

  getPhoneEmail(): string;
  setPhoneEmail(value: string): void;

  getPreferredContact(): string;
  setPreferredContact(value: string): void;

  getReceiveemail(): number;
  setReceiveemail(value: number): void;

  getDateCreated(): string;
  setDateCreated(value: string): void;

  getLastLogin(): string;
  setLastLogin(value: string): void;

  getAnnualHoursPto(): number;
  setAnnualHoursPto(value: number): void;

  getBonusHoursPto(): number;
  setBonusHoursPto(value: number): void;

  getIsActive(): number;
  setIsActive(value: number): void;

  getIsSu(): number;
  setIsSu(value: number): void;

  getIsAdmin(): number;
  setIsAdmin(value: number): void;

  getIsOfficeStaff(): number;
  setIsOfficeStaff(value: number): void;

  getOfficeGroup(): number;
  setOfficeGroup(value: number): void;

  getIsHvacTech(): number;
  setIsHvacTech(value: number): void;

  getTechAssist(): number;
  setTechAssist(value: number): void;

  getCalendarPref(): string;
  setCalendarPref(value: string): void;

  getMultiProperty(): number;
  setMultiProperty(value: number): void;

  getIsEmployee(): number;
  setIsEmployee(value: number): void;

  getEmployeeFunctionId(): number;
  setEmployeeFunctionId(value: number): void;

  getEmployeeDepartmentId(): number;
  setEmployeeDepartmentId(value: number): void;

  getLogin(): string;
  setLogin(value: string): void;

  getPwd(): string;
  setPwd(value: string): void;

  getNotes(): string;
  setNotes(value: string): void;

  getIntNotes(): string;
  setIntNotes(value: string): void;

  getNotification(): string;
  setNotification(value: string): void;

  getBillingTerms(): string;
  setBillingTerms(value: string): void;

  getRebate(): number;
  setRebate(value: number): void;

  getDiscount(): number;
  setDiscount(value: number): void;

  getManagedBy(): number;
  setManagedBy(value: number): void;

  getCurrentStatus(): string;
  setCurrentStatus(value: string): void;

  getCurrentStatusJobNumber(): string;
  setCurrentStatusJobNumber(value: string): void;

  getCurrentStatusTimestamp(): string;
  setCurrentStatusTimestamp(value: string): void;

  getEmpTitle(): string;
  setEmpTitle(value: string): void;

  getExt(): string;
  setExt(value: string): void;

  getImage(): string;
  setImage(value: string): void;

  getServiceCalls(): number;
  setServiceCalls(value: number): void;

  getShowBilling(): number;
  setShowBilling(value: number): void;

  getPaidServiceCallStatus(): number;
  setPaidServiceCallStatus(value: number): void;

  getIsColorMute(): number;
  setIsColorMute(value: number): void;

  getServiceCallRefresh(): number;
  setServiceCallRefresh(value: number): void;

  getToolFund(): number;
  setToolFund(value: number): void;

  getSpiffFund(): number;
  setSpiffFund(value: number): void;

  getGeolocationLat(): number;
  setGeolocationLat(value: number): void;

  getGeolocationLng(): number;
  setGeolocationLng(value: number): void;

  getTimesheetAdministration(): boolean;
  setTimesheetAdministration(value: boolean): void;

  clearPropertiesList(): void;
  getPropertiesList(): Array<property_pb.Property>;
  setPropertiesList(value: Array<property_pb.Property>): void;
  addProperties(value?: property_pb.Property, index?: number): property_pb.Property;

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

  hasServicesRendered(): boolean;
  clearServicesRendered(): void;
  getServicesRendered(): services_rendered_pb.ServicesRendered | undefined;
  setServicesRendered(value?: services_rendered_pb.ServicesRendered): void;

  hasProperty(): boolean;
  clearProperty(): void;
  getProperty(): property_pb.Property | undefined;
  setProperty(value?: property_pb.Property): void;

  getWithProperties(): boolean;
  setWithProperties(value: boolean): void;

  getOverrideLimit(): boolean;
  setOverrideLimit(value: boolean): void;

  clearPermissionsList(): void;
  getPermissionsList(): Array<Permission>;
  setPermissionsList(value: Array<Permission>): void;
  addPermissions(value?: Permission, index?: number): Permission;

  getHireDate(): string;
  setHireDate(value: string): void;

  getRecommendedBy(): string;
  setRecommendedBy(value: string): void;

  clearPermissionGroupsList(): void;
  getPermissionGroupsList(): Array<PermissionGroup>;
  setPermissionGroupsList(value: Array<PermissionGroup>): void;
  addPermissionGroups(value?: PermissionGroup, index?: number): PermissionGroup;

  getDepartmentString(): string;
  setDepartmentString(value: string): void;

  hasDepartment(): boolean;
  clearDepartment(): void;
  getDepartment(): timesheet_department_pb.TimesheetDepartment | undefined;
  setDepartment(value?: timesheet_department_pb.TimesheetDepartment): void;

  getUserIdList(): string;
  setUserIdList(value: string): void;

  getDepartmentList(): string;
  setDepartmentList(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): User.AsObject;
  static toObject(includeInstance: boolean, msg: User): User.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: User, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): User;
  static deserializeBinaryFromReader(message: User, reader: jspb.BinaryReader): User;
}

export namespace User {
  export type AsObject = {
    id: number,
    firstname: string,
    lastname: string,
    businessname: string,
    city: string,
    state: string,
    zip: string,
    address: string,
    phone: string,
    altphone: string,
    cellphone: string,
    fax: string,
    email: string,
    altEmail: string,
    phoneEmail: string,
    preferredContact: string,
    receiveemail: number,
    dateCreated: string,
    lastLogin: string,
    annualHoursPto: number,
    bonusHoursPto: number,
    isActive: number,
    isSu: number,
    isAdmin: number,
    isOfficeStaff: number,
    officeGroup: number,
    isHvacTech: number,
    techAssist: number,
    calendarPref: string,
    multiProperty: number,
    isEmployee: number,
    employeeFunctionId: number,
    employeeDepartmentId: number,
    login: string,
    pwd: string,
    notes: string,
    intNotes: string,
    notification: string,
    billingTerms: string,
    rebate: number,
    discount: number,
    managedBy: number,
    currentStatus: string,
    currentStatusJobNumber: string,
    currentStatusTimestamp: string,
    empTitle: string,
    ext: string,
    image: string,
    serviceCalls: number,
    showBilling: number,
    paidServiceCallStatus: number,
    isColorMute: number,
    serviceCallRefresh: number,
    toolFund: number,
    spiffFund: number,
    geolocationLat: number,
    geolocationLng: number,
    timesheetAdministration: boolean,
    propertiesList: Array<property_pb.Property.AsObject>,
    fieldMaskList: Array<string>,
    pageNumber: number,
    orderBy: string,
    orderDir: string,
    servicesRendered?: services_rendered_pb.ServicesRendered.AsObject,
    property?: property_pb.Property.AsObject,
    withProperties: boolean,
    overrideLimit: boolean,
    permissionsList: Array<Permission.AsObject>,
    hireDate: string,
    recommendedBy: string,
    permissionGroupsList: Array<PermissionGroup.AsObject>,
    departmentString: string,
    department?: timesheet_department_pb.TimesheetDepartment.AsObject,
    userIdList: string,
    departmentList: string,
  }
}

export class UserList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<User>;
  setResultsList(value: Array<User>): void;
  addResults(value?: User, index?: number): User;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserList.AsObject;
  static toObject(includeInstance: boolean, msg: UserList): UserList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserList;
  static deserializeBinaryFromReader(message: UserList, reader: jspb.BinaryReader): UserList;
}

export namespace UserList {
  export type AsObject = {
    resultsList: Array<User.AsObject>,
    totalCount: number,
  }
}

export class CardData extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getDepartmentId(): number;
  setDepartmentId(value: number): void;

  getCardNumber(): number;
  setCardNumber(value: number): void;

  getAccount(): string;
  setAccount(value: string): void;

  getAccountNumber(): number;
  setAccountNumber(value: number): void;

  getName(): string;
  setName(value: string): void;

  getIsActive(): boolean;
  setIsActive(value: boolean): void;

  getWithDepartment(): boolean;
  setWithDepartment(value: boolean): void;

  hasDepartmentData(): boolean;
  clearDepartmentData(): void;
  getDepartmentData(): timesheet_department_pb.TimesheetDepartment | undefined;
  setDepartmentData(value?: timesheet_department_pb.TimesheetDepartment): void;

  getWithUser(): boolean;
  setWithUser(value: boolean): void;

  hasUser(): boolean;
  clearUser(): void;
  getUser(): User | undefined;
  setUser(value?: User): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardData.AsObject;
  static toObject(includeInstance: boolean, msg: CardData): CardData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CardData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardData;
  static deserializeBinaryFromReader(message: CardData, reader: jspb.BinaryReader): CardData;
}

export namespace CardData {
  export type AsObject = {
    id: number,
    departmentId: number,
    cardNumber: number,
    account: string,
    accountNumber: number,
    name: string,
    isActive: boolean,
    withDepartment: boolean,
    departmentData?: timesheet_department_pb.TimesheetDepartment.AsObject,
    withUser: boolean,
    user?: User.AsObject,
  }
}

export class CardDataList extends jspb.Message {
  clearDataList(): void;
  getDataList(): Array<CardData>;
  setDataList(value: Array<CardData>): void;
  addData(value?: CardData, index?: number): CardData;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardDataList.AsObject;
  static toObject(includeInstance: boolean, msg: CardDataList): CardDataList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CardDataList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardDataList;
  static deserializeBinaryFromReader(message: CardDataList, reader: jspb.BinaryReader): CardDataList;
}

export namespace CardDataList {
  export type AsObject = {
    dataList: Array<CardData.AsObject>,
  }
}

export class Permission extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getName(): string;
  setName(value: string): void;

  getAction(): string;
  setAction(value: string): void;

  getResource(): string;
  setResource(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Permission.AsObject;
  static toObject(includeInstance: boolean, msg: Permission): Permission.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Permission, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Permission;
  static deserializeBinaryFromReader(message: Permission, reader: jspb.BinaryReader): Permission;
}

export namespace Permission {
  export type AsObject = {
    id: number,
    name: string,
    action: string,
    resource: string,
  }
}

export class PermissionGroup extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getType(): string;
  setType(value: string): void;

  getFilterData(): string;
  setFilterData(value: string): void;

  getIsActive(): boolean;
  setIsActive(value: boolean): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PermissionGroup.AsObject;
  static toObject(includeInstance: boolean, msg: PermissionGroup): PermissionGroup.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PermissionGroup, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PermissionGroup;
  static deserializeBinaryFromReader(message: PermissionGroup, reader: jspb.BinaryReader): PermissionGroup;
}

export namespace PermissionGroup {
  export type AsObject = {
    id: number,
    name: string,
    description: string,
    type: string,
    filterData: string,
    isActive: boolean,
    fieldMaskList: Array<string>,
  }
}

export class PermissionGroupList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<PermissionGroup>;
  setResultsList(value: Array<PermissionGroup>): void;
  addResults(value?: PermissionGroup, index?: number): PermissionGroup;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PermissionGroupList.AsObject;
  static toObject(includeInstance: boolean, msg: PermissionGroupList): PermissionGroupList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PermissionGroupList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PermissionGroupList;
  static deserializeBinaryFromReader(message: PermissionGroupList, reader: jspb.BinaryReader): PermissionGroupList;
}

export namespace PermissionGroupList {
  export type AsObject = {
    resultsList: Array<PermissionGroup.AsObject>,
    totalCount: number,
  }
}

export class UserPermissionGroupReq extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): void;

  getPermissionGroupId(): number;
  setPermissionGroupId(value: number): void;

  getPermissionGroupName(): string;
  setPermissionGroupName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserPermissionGroupReq.AsObject;
  static toObject(includeInstance: boolean, msg: UserPermissionGroupReq): UserPermissionGroupReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserPermissionGroupReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserPermissionGroupReq;
  static deserializeBinaryFromReader(message: UserPermissionGroupReq, reader: jspb.BinaryReader): UserPermissionGroupReq;
}

export namespace UserPermissionGroupReq {
  export type AsObject = {
    userId: number,
    permissionGroupId: number,
    permissionGroupName: string,
  }
}

export class PermissionGroupUser extends jspb.Message {
  getPermissionGroupUserId(): number;
  setPermissionGroupUserId(value: number): void;

  getPermissionGroupId(): number;
  setPermissionGroupId(value: number): void;

  getPermissionGroupName(): string;
  setPermissionGroupName(value: string): void;

  getPermissionGroupDescription(): string;
  setPermissionGroupDescription(value: string): void;

  getPermissionGroupType(): string;
  setPermissionGroupType(value: string): void;

  getFilterData(): string;
  setFilterData(value: string): void;

  getUserId(): number;
  setUserId(value: number): void;

  getUserFirstname(): string;
  setUserFirstname(value: string): void;

  getUserLastname(): string;
  setUserLastname(value: string): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  clearNotEqualsList(): void;
  getNotEqualsList(): Array<string>;
  setNotEqualsList(value: Array<string>): void;
  addNotEquals(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PermissionGroupUser.AsObject;
  static toObject(includeInstance: boolean, msg: PermissionGroupUser): PermissionGroupUser.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PermissionGroupUser, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PermissionGroupUser;
  static deserializeBinaryFromReader(message: PermissionGroupUser, reader: jspb.BinaryReader): PermissionGroupUser;
}

export namespace PermissionGroupUser {
  export type AsObject = {
    permissionGroupUserId: number,
    permissionGroupId: number,
    permissionGroupName: string,
    permissionGroupDescription: string,
    permissionGroupType: string,
    filterData: string,
    userId: number,
    userFirstname: string,
    userLastname: string,
    fieldMaskList: Array<string>,
    notEqualsList: Array<string>,
  }
}

export class PermissionGroupUserList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<PermissionGroupUser>;
  setResultsList(value: Array<PermissionGroupUser>): void;
  addResults(value?: PermissionGroupUser, index?: number): PermissionGroupUser;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PermissionGroupUserList.AsObject;
  static toObject(includeInstance: boolean, msg: PermissionGroupUserList): PermissionGroupUserList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PermissionGroupUserList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PermissionGroupUserList;
  static deserializeBinaryFromReader(message: PermissionGroupUserList, reader: jspb.BinaryReader): PermissionGroupUserList;
}

export namespace PermissionGroupUserList {
  export type AsObject = {
    resultsList: Array<PermissionGroupUser.AsObject>,
    totalCount: number,
  }
}

export class Vehicle extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getOwnerId(): number;
  setOwnerId(value: number): void;

  getDepartmentId(): number;
  setDepartmentId(value: number): void;

  getMake(): string;
  setMake(value: string): void;

  getModel(): string;
  setModel(value: string): void;

  getYear(): string;
  setYear(value: string): void;

  getEngine(): string;
  setEngine(value: string): void;

  getIdentificationNumber(): string;
  setIdentificationNumber(value: string): void;

  getPhotoName(): string;
  setPhotoName(value: string): void;

  getGpsTrackingId(): string;
  setGpsTrackingId(value: string): void;

  getIsActive(): number;
  setIsActive(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Vehicle.AsObject;
  static toObject(includeInstance: boolean, msg: Vehicle): Vehicle.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Vehicle, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Vehicle;
  static deserializeBinaryFromReader(message: Vehicle, reader: jspb.BinaryReader): Vehicle;
}

export namespace Vehicle {
  export type AsObject = {
    id: number,
    ownerId: number,
    departmentId: number,
    make: string,
    model: string,
    year: string,
    engine: string,
    identificationNumber: string,
    photoName: string,
    gpsTrackingId: string,
    isActive: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
  }
}

export class VehicleList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<Vehicle>;
  setResultsList(value: Array<Vehicle>): void;
  addResults(value?: Vehicle, index?: number): Vehicle;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VehicleList.AsObject;
  static toObject(includeInstance: boolean, msg: VehicleList): VehicleList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VehicleList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VehicleList;
  static deserializeBinaryFromReader(message: VehicleList, reader: jspb.BinaryReader): VehicleList;
}

export namespace VehicleList {
  export type AsObject = {
    resultsList: Array<Vehicle.AsObject>,
    totalCount: number,
  }
}

