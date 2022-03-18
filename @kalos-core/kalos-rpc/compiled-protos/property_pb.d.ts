// package: 
// file: property.proto

import * as jspb from "google-protobuf";

export class Property extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  getContractId(): number;
  setContractId(value: number): void;

  getAddress(): string;
  setAddress(value: string): void;

  getCity(): string;
  setCity(value: string): void;

  getState(): string;
  setState(value: string): void;

  getZip(): string;
  setZip(value: string): void;

  getSubdivision(): string;
  setSubdivision(value: string): void;

  getDirections(): string;
  setDirections(value: string): void;

  getNotes(): string;
  setNotes(value: string): void;

  getDateCreated(): string;
  setDateCreated(value: string): void;

  getIsActive(): number;
  setIsActive(value: number): void;

  getIsResidential(): number;
  setIsResidential(value: number): void;

  getNotification(): string;
  setNotification(value: string): void;

  getFirstname(): string;
  setFirstname(value: string): void;

  getLastname(): string;
  setLastname(value: string): void;

  getBusinessname(): string;
  setBusinessname(value: string): void;

  getPhone(): string;
  setPhone(value: string): void;

  getAltphone(): string;
  setAltphone(value: string): void;

  getEmail(): string;
  setEmail(value: string): void;

  getGeolocationLat(): number;
  setGeolocationLat(value: number): void;

  getGeolocationLng(): number;
  setGeolocationLng(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  clearNotEqualsList(): void;
  getNotEqualsList(): Array<string>;
  setNotEqualsList(value: Array<string>): void;
  addNotEquals(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Property.AsObject;
  static toObject(includeInstance: boolean, msg: Property): Property.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Property, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Property;
  static deserializeBinaryFromReader(message: Property, reader: jspb.BinaryReader): Property;
}

export namespace Property {
  export type AsObject = {
    id: number,
    userId: number,
    contractId: number,
    address: string,
    city: string,
    state: string,
    zip: string,
    subdivision: string,
    directions: string,
    notes: string,
    dateCreated: string,
    isActive: number,
    isResidential: number,
    notification: string,
    firstname: string,
    lastname: string,
    businessname: string,
    phone: string,
    altphone: string,
    email: string,
    geolocationLat: number,
    geolocationLng: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
    notEqualsList: Array<string>,
  }
}

export class PropertyList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<Property>;
  setResultsList(value: Array<Property>): void;
  addResults(value?: Property, index?: number): Property;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PropertyList.AsObject;
  static toObject(includeInstance: boolean, msg: PropertyList): PropertyList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PropertyList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PropertyList;
  static deserializeBinaryFromReader(message: PropertyList, reader: jspb.BinaryReader): PropertyList;
}

export namespace PropertyList {
  export type AsObject = {
    resultsList: Array<Property.AsObject>,
    totalCount: number,
  }
}

