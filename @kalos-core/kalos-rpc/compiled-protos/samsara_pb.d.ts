// package: 
// file: samsara.proto

import * as jspb from "google-protobuf";
import * as common_pb from "./common_pb";

export class SamsaraDriversResponse extends jspb.Message {
  clearDataList(): void;
  getDataList(): Array<SamsaraDriver>;
  setDataList(value: Array<SamsaraDriver>): void;
  addData(value?: SamsaraDriver, index?: number): SamsaraDriver;

  hasPagination(): boolean;
  clearPagination(): void;
  getPagination(): SamsaraPagination | undefined;
  setPagination(value?: SamsaraPagination): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SamsaraDriversResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SamsaraDriversResponse): SamsaraDriversResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SamsaraDriversResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SamsaraDriversResponse;
  static deserializeBinaryFromReader(message: SamsaraDriversResponse, reader: jspb.BinaryReader): SamsaraDriversResponse;
}

export namespace SamsaraDriversResponse {
  export type AsObject = {
    dataList: Array<SamsaraDriver.AsObject>,
    pagination?: SamsaraPagination.AsObject,
  }
}

export class SamsaraDriver extends jspb.Message {
  clearAttributesList(): void;
  getAttributesList(): Array<SamsaraAttribute>;
  setAttributesList(value: Array<SamsaraAttribute>): void;
  addAttributes(value?: SamsaraAttribute, index?: number): SamsaraAttribute;

  hasCarrierSettings(): boolean;
  clearCarrierSettings(): void;
  getCarrierSettings(): CarrierSettings | undefined;
  setCarrierSettings(value?: CarrierSettings): void;

  getCreatedAtTime(): string;
  setCreatedAtTime(value: string): void;

  getCurrentIdCardCode(): string;
  setCurrentIdCardCode(value: string): void;

  getDriverActivationStatus(): string;
  setDriverActivationStatus(value: string): void;

  getEldAdverseWeatherExemptionEnabled(): boolean;
  setEldAdverseWeatherExemptionEnabled(value: boolean): void;

  getEldBigDayExemptionEnabled(): boolean;
  setEldBigDayExemptionEnabled(value: boolean): void;

  getEldDayStartHour(): number;
  setEldDayStartHour(value: number): void;

  getEldExempt(): boolean;
  setEldExempt(value: boolean): void;

  getEldExemptReason(): string;
  setEldExemptReason(value: string): void;

  getEldPcEnabled(): boolean;
  setEldPcEnabled(value: boolean): void;

  hasEldSettings(): boolean;
  clearEldSettings(): void;
  getEldSettings(): ELDSettings | undefined;
  setEldSettings(value?: ELDSettings): void;

  getEldYmEnabled(): boolean;
  setEldYmEnabled(value: boolean): void;

  getExternalIdsMap(): jspb.Map<string, string>;
  clearExternalIdsMap(): void;
  getId(): string;
  setId(value: string): void;

  getIsDeactivated(): boolean;
  setIsDeactivated(value: boolean): void;

  getLicenseNumber(): string;
  setLicenseNumber(value: string): void;

  getLicenseState(): string;
  setLicenseState(value: string): void;

  getLocale(): string;
  setLocale(value: string): void;

  getName(): string;
  setName(value: string): void;

  getNotes(): string;
  setNotes(value: string): void;

  getPhone(): string;
  setPhone(value: string): void;

  hasStaticAssignedVehicle(): boolean;
  clearStaticAssignedVehicle(): void;
  getStaticAssignedVehicle(): SamsaraVehicle | undefined;
  setStaticAssignedVehicle(value?: SamsaraVehicle): void;

  clearTagsList(): void;
  getTagsList(): Array<SamsaraTag>;
  setTagsList(value: Array<SamsaraTag>): void;
  addTags(value?: SamsaraTag, index?: number): SamsaraTag;

  getTimezone(): string;
  setTimezone(value: string): void;

  getUpdatedAtTime(): string;
  setUpdatedAtTime(value: string): void;

  hasUsDriverRulesetOverride(): boolean;
  clearUsDriverRulesetOverride(): void;
  getUsDriverRulesetOverride(): SamsaraDriverRuleset | undefined;
  setUsDriverRulesetOverride(value?: SamsaraDriverRuleset): void;

  getUsername(): string;
  setUsername(value: string): void;

  clearVehicleGroupTagList(): void;
  getVehicleGroupTagList(): Array<SamsaraTag>;
  setVehicleGroupTagList(value: Array<SamsaraTag>): void;
  addVehicleGroupTag(value?: SamsaraTag, index?: number): SamsaraTag;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SamsaraDriver.AsObject;
  static toObject(includeInstance: boolean, msg: SamsaraDriver): SamsaraDriver.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SamsaraDriver, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SamsaraDriver;
  static deserializeBinaryFromReader(message: SamsaraDriver, reader: jspb.BinaryReader): SamsaraDriver;
}

export namespace SamsaraDriver {
  export type AsObject = {
    attributesList: Array<SamsaraAttribute.AsObject>,
    carrierSettings?: CarrierSettings.AsObject,
    createdAtTime: string,
    currentIdCardCode: string,
    driverActivationStatus: string,
    eldAdverseWeatherExemptionEnabled: boolean,
    eldBigDayExemptionEnabled: boolean,
    eldDayStartHour: number,
    eldExempt: boolean,
    eldExemptReason: string,
    eldPcEnabled: boolean,
    eldSettings?: ELDSettings.AsObject,
    eldYmEnabled: boolean,
    externalIdsMap: Array<[string, string]>,
    id: string,
    isDeactivated: boolean,
    licenseNumber: string,
    licenseState: string,
    locale: string,
    name: string,
    notes: string,
    phone: string,
    staticAssignedVehicle?: SamsaraVehicle.AsObject,
    tagsList: Array<SamsaraTag.AsObject>,
    timezone: string,
    updatedAtTime: string,
    usDriverRulesetOverride?: SamsaraDriverRuleset.AsObject,
    username: string,
    vehicleGroupTagList: Array<SamsaraTag.AsObject>,
  }
}

export class SamsaraLocationResponse extends jspb.Message {
  clearDataList(): void;
  getDataList(): Array<SamsaraVehicleLocation>;
  setDataList(value: Array<SamsaraVehicleLocation>): void;
  addData(value?: SamsaraVehicleLocation, index?: number): SamsaraVehicleLocation;

  hasPagination(): boolean;
  clearPagination(): void;
  getPagination(): SamsaraPagination | undefined;
  setPagination(value?: SamsaraPagination): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SamsaraLocationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SamsaraLocationResponse): SamsaraLocationResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SamsaraLocationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SamsaraLocationResponse;
  static deserializeBinaryFromReader(message: SamsaraLocationResponse, reader: jspb.BinaryReader): SamsaraLocationResponse;
}

export namespace SamsaraLocationResponse {
  export type AsObject = {
    dataList: Array<SamsaraVehicleLocation.AsObject>,
    pagination?: SamsaraPagination.AsObject,
  }
}

export class SamsaraVehicleLocation extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  hasLocation(): boolean;
  clearLocation(): void;
  getLocation(): SamsaraLocationEvent | undefined;
  setLocation(value?: SamsaraLocationEvent): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SamsaraVehicleLocation.AsObject;
  static toObject(includeInstance: boolean, msg: SamsaraVehicleLocation): SamsaraVehicleLocation.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SamsaraVehicleLocation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SamsaraVehicleLocation;
  static deserializeBinaryFromReader(message: SamsaraVehicleLocation, reader: jspb.BinaryReader): SamsaraVehicleLocation;
}

export namespace SamsaraVehicleLocation {
  export type AsObject = {
    id: string,
    location?: SamsaraLocationEvent.AsObject,
    name: string,
  }
}

export class SamsaraLocationEvent extends jspb.Message {
  getHeading(): number;
  setHeading(value: number): void;

  getLatitude(): number;
  setLatitude(value: number): void;

  getLongitude(): number;
  setLongitude(value: number): void;

  hasReverseGeo(): boolean;
  clearReverseGeo(): void;
  getReverseGeo(): SamsaraReverseGeo | undefined;
  setReverseGeo(value?: SamsaraReverseGeo): void;

  getSpeed(): number;
  setSpeed(value: number): void;

  getTime(): string;
  setTime(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SamsaraLocationEvent.AsObject;
  static toObject(includeInstance: boolean, msg: SamsaraLocationEvent): SamsaraLocationEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SamsaraLocationEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SamsaraLocationEvent;
  static deserializeBinaryFromReader(message: SamsaraLocationEvent, reader: jspb.BinaryReader): SamsaraLocationEvent;
}

export namespace SamsaraLocationEvent {
  export type AsObject = {
    heading: number,
    latitude: number,
    longitude: number,
    reverseGeo?: SamsaraReverseGeo.AsObject,
    speed: number,
    time: string,
  }
}

export class SamsaraReverseGeo extends jspb.Message {
  getFormattedLocation(): string;
  setFormattedLocation(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SamsaraReverseGeo.AsObject;
  static toObject(includeInstance: boolean, msg: SamsaraReverseGeo): SamsaraReverseGeo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SamsaraReverseGeo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SamsaraReverseGeo;
  static deserializeBinaryFromReader(message: SamsaraReverseGeo, reader: jspb.BinaryReader): SamsaraReverseGeo;
}

export namespace SamsaraReverseGeo {
  export type AsObject = {
    formattedLocation: string,
  }
}

export class SamsaraAddressResponse extends jspb.Message {
  clearDataList(): void;
  getDataList(): Array<SamsaraAddress>;
  setDataList(value: Array<SamsaraAddress>): void;
  addData(value?: SamsaraAddress, index?: number): SamsaraAddress;

  hasPagination(): boolean;
  clearPagination(): void;
  getPagination(): SamsaraPagination | undefined;
  setPagination(value?: SamsaraPagination): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SamsaraAddressResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SamsaraAddressResponse): SamsaraAddressResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SamsaraAddressResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SamsaraAddressResponse;
  static deserializeBinaryFromReader(message: SamsaraAddressResponse, reader: jspb.BinaryReader): SamsaraAddressResponse;
}

export namespace SamsaraAddressResponse {
  export type AsObject = {
    dataList: Array<SamsaraAddress.AsObject>,
    pagination?: SamsaraPagination.AsObject,
  }
}

export class SamsaraAddressResponseSingular extends jspb.Message {
  hasData(): boolean;
  clearData(): void;
  getData(): SamsaraAddress | undefined;
  setData(value?: SamsaraAddress): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SamsaraAddressResponseSingular.AsObject;
  static toObject(includeInstance: boolean, msg: SamsaraAddressResponseSingular): SamsaraAddressResponseSingular.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SamsaraAddressResponseSingular, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SamsaraAddressResponseSingular;
  static deserializeBinaryFromReader(message: SamsaraAddressResponseSingular, reader: jspb.BinaryReader): SamsaraAddressResponseSingular;
}

export namespace SamsaraAddressResponseSingular {
  export type AsObject = {
    data?: SamsaraAddress.AsObject,
  }
}

export class SamsaraAddress extends jspb.Message {
  clearAddressTypesList(): void;
  getAddressTypesList(): Array<string>;
  setAddressTypesList(value: Array<string>): void;
  addAddressTypes(value: string, index?: number): string;

  clearContactsList(): void;
  getContactsList(): Array<SamsaraContact>;
  setContactsList(value: Array<SamsaraContact>): void;
  addContacts(value?: SamsaraContact, index?: number): SamsaraContact;

  clearContactIdsList(): void;
  getContactIdsList(): Array<string>;
  setContactIdsList(value: Array<string>): void;
  addContactIds(value: string, index?: number): string;

  getCreatedAtTime(): string;
  setCreatedAtTime(value: string): void;

  getFormattedAddress(): string;
  setFormattedAddress(value: string): void;

  getExternalIdsMap(): jspb.Map<string, string>;
  clearExternalIdsMap(): void;
  hasGeofence(): boolean;
  clearGeofence(): void;
  getGeofence(): SamsaraGeofence | undefined;
  setGeofence(value?: SamsaraGeofence): void;

  getId(): string;
  setId(value: string): void;

  getNotes(): string;
  setNotes(value: string): void;

  clearTagsList(): void;
  getTagsList(): Array<SamsaraTag>;
  setTagsList(value: Array<SamsaraTag>): void;
  addTags(value?: SamsaraTag, index?: number): SamsaraTag;

  clearTagIdsList(): void;
  getTagIdsList(): Array<string>;
  setTagIdsList(value: Array<string>): void;
  addTagIds(value: string, index?: number): string;

  getLatitude(): number;
  setLatitude(value: number): void;

  getLongitude(): number;
  setLongitude(value: number): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SamsaraAddress.AsObject;
  static toObject(includeInstance: boolean, msg: SamsaraAddress): SamsaraAddress.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SamsaraAddress, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SamsaraAddress;
  static deserializeBinaryFromReader(message: SamsaraAddress, reader: jspb.BinaryReader): SamsaraAddress;
}

export namespace SamsaraAddress {
  export type AsObject = {
    addressTypesList: Array<string>,
    contactsList: Array<SamsaraContact.AsObject>,
    contactIdsList: Array<string>,
    createdAtTime: string,
    formattedAddress: string,
    externalIdsMap: Array<[string, string]>,
    geofence?: SamsaraGeofence.AsObject,
    id: string,
    notes: string,
    tagsList: Array<SamsaraTag.AsObject>,
    tagIdsList: Array<string>,
    latitude: number,
    longitude: number,
    name: string,
  }
}

export class SamsaraGeofence extends jspb.Message {
  hasCircle(): boolean;
  clearCircle(): void;
  getCircle(): SamsaraCircularFence | undefined;
  setCircle(value?: SamsaraCircularFence): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SamsaraGeofence.AsObject;
  static toObject(includeInstance: boolean, msg: SamsaraGeofence): SamsaraGeofence.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SamsaraGeofence, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SamsaraGeofence;
  static deserializeBinaryFromReader(message: SamsaraGeofence, reader: jspb.BinaryReader): SamsaraGeofence;
}

export namespace SamsaraGeofence {
  export type AsObject = {
    circle?: SamsaraCircularFence.AsObject,
  }
}

export class SamsaraCircularFence extends jspb.Message {
  getLatitude(): number;
  setLatitude(value: number): void;

  getLongitude(): number;
  setLongitude(value: number): void;

  getRadiusMeters(): number;
  setRadiusMeters(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SamsaraCircularFence.AsObject;
  static toObject(includeInstance: boolean, msg: SamsaraCircularFence): SamsaraCircularFence.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SamsaraCircularFence, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SamsaraCircularFence;
  static deserializeBinaryFromReader(message: SamsaraCircularFence, reader: jspb.BinaryReader): SamsaraCircularFence;
}

export namespace SamsaraCircularFence {
  export type AsObject = {
    latitude: number,
    longitude: number,
    radiusMeters: number,
  }
}

export class SamsaraContact extends jspb.Message {
  getFirstName(): string;
  setFirstName(value: string): void;

  getId(): string;
  setId(value: string): void;

  getLastName(): string;
  setLastName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SamsaraContact.AsObject;
  static toObject(includeInstance: boolean, msg: SamsaraContact): SamsaraContact.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SamsaraContact, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SamsaraContact;
  static deserializeBinaryFromReader(message: SamsaraContact, reader: jspb.BinaryReader): SamsaraContact;
}

export namespace SamsaraContact {
  export type AsObject = {
    firstName: string,
    id: string,
    lastName: string,
  }
}

export class SamsaraPagination extends jspb.Message {
  getEndCursor(): string;
  setEndCursor(value: string): void;

  getHasNextPage(): boolean;
  setHasNextPage(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SamsaraPagination.AsObject;
  static toObject(includeInstance: boolean, msg: SamsaraPagination): SamsaraPagination.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SamsaraPagination, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SamsaraPagination;
  static deserializeBinaryFromReader(message: SamsaraPagination, reader: jspb.BinaryReader): SamsaraPagination;
}

export namespace SamsaraPagination {
  export type AsObject = {
    endCursor: string,
    hasNextPage: boolean,
  }
}

export class SamsaraDriverRuleset extends jspb.Message {
  getCycle(): string;
  setCycle(value: string): void;

  getRestart(): string;
  setRestart(value: string): void;

  getRestbreak(): string;
  setRestbreak(value: string): void;

  getUsStateToOverride(): string;
  setUsStateToOverride(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SamsaraDriverRuleset.AsObject;
  static toObject(includeInstance: boolean, msg: SamsaraDriverRuleset): SamsaraDriverRuleset.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SamsaraDriverRuleset, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SamsaraDriverRuleset;
  static deserializeBinaryFromReader(message: SamsaraDriverRuleset, reader: jspb.BinaryReader): SamsaraDriverRuleset;
}

export namespace SamsaraDriverRuleset {
  export type AsObject = {
    cycle: string,
    restart: string,
    restbreak: string,
    usStateToOverride: string,
  }
}

export class SamsaraTag extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  getParentTagId(): string;
  setParentTagId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SamsaraTag.AsObject;
  static toObject(includeInstance: boolean, msg: SamsaraTag): SamsaraTag.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SamsaraTag, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SamsaraTag;
  static deserializeBinaryFromReader(message: SamsaraTag, reader: jspb.BinaryReader): SamsaraTag;
}

export namespace SamsaraTag {
  export type AsObject = {
    id: string,
    name: string,
    parentTagId: string,
  }
}

export class SamsaraVehicle extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SamsaraVehicle.AsObject;
  static toObject(includeInstance: boolean, msg: SamsaraVehicle): SamsaraVehicle.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SamsaraVehicle, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SamsaraVehicle;
  static deserializeBinaryFromReader(message: SamsaraVehicle, reader: jspb.BinaryReader): SamsaraVehicle;
}

export namespace SamsaraVehicle {
  export type AsObject = {
    id: string,
    name: string,
  }
}

export class SamsaraAttribute extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  clearNumberValuesList(): void;
  getNumberValuesList(): Array<number>;
  setNumberValuesList(value: Array<number>): void;
  addNumberValues(value: number, index?: number): number;

  clearStringValuesList(): void;
  getStringValuesList(): Array<string>;
  setStringValuesList(value: Array<string>): void;
  addStringValues(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SamsaraAttribute.AsObject;
  static toObject(includeInstance: boolean, msg: SamsaraAttribute): SamsaraAttribute.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SamsaraAttribute, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SamsaraAttribute;
  static deserializeBinaryFromReader(message: SamsaraAttribute, reader: jspb.BinaryReader): SamsaraAttribute;
}

export namespace SamsaraAttribute {
  export type AsObject = {
    id: string,
    name: string,
    numberValuesList: Array<number>,
    stringValuesList: Array<string>,
  }
}

export class CarrierSettings extends jspb.Message {
  getCarrierName(): string;
  setCarrierName(value: string): void;

  getDotNumber(): number;
  setDotNumber(value: number): void;

  getHomeTerminalAddress(): string;
  setHomeTerminalAddress(value: string): void;

  getHomeTerminalName(): string;
  setHomeTerminalName(value: string): void;

  getMainOfficeAddress(): string;
  setMainOfficeAddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CarrierSettings.AsObject;
  static toObject(includeInstance: boolean, msg: CarrierSettings): CarrierSettings.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CarrierSettings, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CarrierSettings;
  static deserializeBinaryFromReader(message: CarrierSettings, reader: jspb.BinaryReader): CarrierSettings;
}

export namespace CarrierSettings {
  export type AsObject = {
    carrierName: string,
    dotNumber: number,
    homeTerminalAddress: string,
    homeTerminalName: string,
    mainOfficeAddress: string,
  }
}

export class ELDSettings extends jspb.Message {
  clearRulesetsList(): void;
  getRulesetsList(): Array<string>;
  setRulesetsList(value: Array<string>): void;
  addRulesets(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ELDSettings.AsObject;
  static toObject(includeInstance: boolean, msg: ELDSettings): ELDSettings.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ELDSettings, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ELDSettings;
  static deserializeBinaryFromReader(message: ELDSettings, reader: jspb.BinaryReader): ELDSettings;
}

export namespace ELDSettings {
  export type AsObject = {
    rulesetsList: Array<string>,
  }
}

