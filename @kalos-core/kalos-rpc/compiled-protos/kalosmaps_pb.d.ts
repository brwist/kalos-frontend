// package: 
// file: kalosmaps.proto

import * as jspb from "google-protobuf";
import * as common_pb from "./common_pb";

export class MatrixRequest extends jspb.Message {
  clearOriginsList(): void;
  getOriginsList(): Array<Coordinates>;
  setOriginsList(value: Array<Coordinates>): void;
  addOrigins(value?: Coordinates, index?: number): Coordinates;

  hasDestination(): boolean;
  clearDestination(): void;
  getDestination(): Coordinates | undefined;
  setDestination(value?: Coordinates): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MatrixRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MatrixRequest): MatrixRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MatrixRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MatrixRequest;
  static deserializeBinaryFromReader(message: MatrixRequest, reader: jspb.BinaryReader): MatrixRequest;
}

export namespace MatrixRequest {
  export type AsObject = {
    originsList: Array<Coordinates.AsObject>,
    destination?: Coordinates.AsObject,
  }
}

export class DistanceMatrixResponse extends jspb.Message {
  clearOriginaddressesList(): void;
  getOriginaddressesList(): Array<string>;
  setOriginaddressesList(value: Array<string>): void;
  addOriginaddresses(value: string, index?: number): string;

  clearDestinationaddressesList(): void;
  getDestinationaddressesList(): Array<string>;
  setDestinationaddressesList(value: Array<string>): void;
  addDestinationaddresses(value: string, index?: number): string;

  clearRowsList(): void;
  getRowsList(): Array<DistanceMatrixElementRow>;
  setRowsList(value: Array<DistanceMatrixElementRow>): void;
  addRows(value?: DistanceMatrixElementRow, index?: number): DistanceMatrixElementRow;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DistanceMatrixResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DistanceMatrixResponse): DistanceMatrixResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DistanceMatrixResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DistanceMatrixResponse;
  static deserializeBinaryFromReader(message: DistanceMatrixResponse, reader: jspb.BinaryReader): DistanceMatrixResponse;
}

export namespace DistanceMatrixResponse {
  export type AsObject = {
    originaddressesList: Array<string>,
    destinationaddressesList: Array<string>,
    rowsList: Array<DistanceMatrixElementRow.AsObject>,
  }
}

export class Place extends jspb.Message {
  getStreetNumber(): number;
  setStreetNumber(value: number): void;

  getRoadName(): string;
  setRoadName(value: string): void;

  getCity(): string;
  setCity(value: string): void;

  getState(): string;
  setState(value: string): void;

  getCountry(): string;
  setCountry(value: string): void;

  getZipCode(): string;
  setZipCode(value: string): void;

  hasCoords(): boolean;
  clearCoords(): void;
  getCoords(): Coordinates | undefined;
  setCoords(value?: Coordinates): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Place.AsObject;
  static toObject(includeInstance: boolean, msg: Place): Place.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Place, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Place;
  static deserializeBinaryFromReader(message: Place, reader: jspb.BinaryReader): Place;
}

export namespace Place {
  export type AsObject = {
    streetNumber: number,
    roadName: string,
    city: string,
    state: string,
    country: string,
    zipCode: string,
    coords?: Coordinates.AsObject,
  }
}

export class Places extends jspb.Message {
  clearDataList(): void;
  getDataList(): Array<Place>;
  setDataList(value: Array<Place>): void;
  addData(value?: Place, index?: number): Place;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Places.AsObject;
  static toObject(includeInstance: boolean, msg: Places): Places.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Places, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Places;
  static deserializeBinaryFromReader(message: Places, reader: jspb.BinaryReader): Places;
}

export namespace Places {
  export type AsObject = {
    dataList: Array<Place.AsObject>,
  }
}

export class TripData extends jspb.Message {
  getDistanceInMeters(): number;
  setDistanceInMeters(value: number): void;

  getTimeInMs(): number;
  setTimeInMs(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TripData.AsObject;
  static toObject(includeInstance: boolean, msg: TripData): TripData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TripData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TripData;
  static deserializeBinaryFromReader(message: TripData, reader: jspb.BinaryReader): TripData;
}

export namespace TripData {
  export type AsObject = {
    distanceInMeters: number,
    timeInMs: number,
  }

  export class HumanReadableTime extends jspb.Message {
    getDays(): number;
    setDays(value: number): void;

    getHours(): number;
    setHours(value: number): void;

    getMinutes(): number;
    setMinutes(value: number): void;

    getSeconds(): number;
    setSeconds(value: number): void;

    getDisplay(): string;
    setDisplay(value: string): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HumanReadableTime.AsObject;
    static toObject(includeInstance: boolean, msg: HumanReadableTime): HumanReadableTime.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HumanReadableTime, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HumanReadableTime;
    static deserializeBinaryFromReader(message: HumanReadableTime, reader: jspb.BinaryReader): HumanReadableTime;
  }

  export namespace HumanReadableTime {
    export type AsObject = {
      days: number,
      hours: number,
      minutes: number,
      seconds: number,
      display: string,
    }
  }
}

export class Coordinates extends jspb.Message {
  getLatitude(): number;
  setLatitude(value: number): void;

  getLongitude(): number;
  setLongitude(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Coordinates.AsObject;
  static toObject(includeInstance: boolean, msg: Coordinates): Coordinates.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Coordinates, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Coordinates;
  static deserializeBinaryFromReader(message: Coordinates, reader: jspb.BinaryReader): Coordinates;
}

export namespace Coordinates {
  export type AsObject = {
    latitude: number,
    longitude: number,
  }
}

export class DistanceMatrixElementRow extends jspb.Message {
  clearDistancematrixelementList(): void;
  getDistancematrixelementList(): Array<DistanceMatrixElement>;
  setDistancematrixelementList(value: Array<DistanceMatrixElement>): void;
  addDistancematrixelement(value?: DistanceMatrixElement, index?: number): DistanceMatrixElement;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DistanceMatrixElementRow.AsObject;
  static toObject(includeInstance: boolean, msg: DistanceMatrixElementRow): DistanceMatrixElementRow.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DistanceMatrixElementRow, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DistanceMatrixElementRow;
  static deserializeBinaryFromReader(message: DistanceMatrixElementRow, reader: jspb.BinaryReader): DistanceMatrixElementRow;
}

export namespace DistanceMatrixElementRow {
  export type AsObject = {
    distancematrixelementList: Array<DistanceMatrixElement.AsObject>,
  }
}

export class DistanceMatrixElement extends jspb.Message {
  getStatus(): string;
  setStatus(value: string): void;

  getDuration(): number;
  setDuration(value: number): void;

  getDurationintraffic(): number;
  setDurationintraffic(value: number): void;

  hasDistance(): boolean;
  clearDistance(): void;
  getDistance(): Distance | undefined;
  setDistance(value?: Distance): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DistanceMatrixElement.AsObject;
  static toObject(includeInstance: boolean, msg: DistanceMatrixElement): DistanceMatrixElement.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DistanceMatrixElement, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DistanceMatrixElement;
  static deserializeBinaryFromReader(message: DistanceMatrixElement, reader: jspb.BinaryReader): DistanceMatrixElement;
}

export namespace DistanceMatrixElement {
  export type AsObject = {
    status: string,
    duration: number,
    durationintraffic: number,
    distance?: Distance.AsObject,
  }
}

export class Distance extends jspb.Message {
  getHumanreadable(): string;
  setHumanreadable(value: string): void;

  getMeters(): number;
  setMeters(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Distance.AsObject;
  static toObject(includeInstance: boolean, msg: Distance): Distance.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Distance, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Distance;
  static deserializeBinaryFromReader(message: Distance, reader: jspb.BinaryReader): Distance;
}

export namespace Distance {
  export type AsObject = {
    humanreadable: string,
    meters: number,
  }
}

export class CoordinatesList extends jspb.Message {
  clearDataList(): void;
  getDataList(): Array<Coordinates>;
  setDataList(value: Array<Coordinates>): void;
  addData(value?: Coordinates, index?: number): Coordinates;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CoordinatesList.AsObject;
  static toObject(includeInstance: boolean, msg: CoordinatesList): CoordinatesList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CoordinatesList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CoordinatesList;
  static deserializeBinaryFromReader(message: CoordinatesList, reader: jspb.BinaryReader): CoordinatesList;
}

export namespace CoordinatesList {
  export type AsObject = {
    dataList: Array<Coordinates.AsObject>,
  }
}

