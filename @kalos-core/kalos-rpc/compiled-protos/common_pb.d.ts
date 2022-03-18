// package: 
// file: common.proto

import * as jspb from "google-protobuf";

export class Int32 extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Int32.AsObject;
  static toObject(includeInstance: boolean, msg: Int32): Int32.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Int32, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Int32;
  static deserializeBinaryFromReader(message: Int32, reader: jspb.BinaryReader): Int32;
}

export namespace Int32 {
  export type AsObject = {
    value: number,
  }
}

export class Double extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Double.AsObject;
  static toObject(includeInstance: boolean, msg: Double): Double.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Double, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Double;
  static deserializeBinaryFromReader(message: Double, reader: jspb.BinaryReader): Double;
}

export namespace Double {
  export type AsObject = {
    value: number,
  }
}

export class Int32List extends jspb.Message {
  clearValuesList(): void;
  getValuesList(): Array<number>;
  setValuesList(value: Array<number>): void;
  addValues(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Int32List.AsObject;
  static toObject(includeInstance: boolean, msg: Int32List): Int32List.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Int32List, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Int32List;
  static deserializeBinaryFromReader(message: Int32List, reader: jspb.BinaryReader): Int32List;
}

export namespace Int32List {
  export type AsObject = {
    valuesList: Array<number>,
  }
}

export class String extends jspb.Message {
  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): String.AsObject;
  static toObject(includeInstance: boolean, msg: String): String.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: String, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): String;
  static deserializeBinaryFromReader(message: String, reader: jspb.BinaryReader): String;
}

export namespace String {
  export type AsObject = {
    value: string,
  }
}

export class StringList extends jspb.Message {
  clearValuesList(): void;
  getValuesList(): Array<string>;
  setValuesList(value: Array<string>): void;
  addValues(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StringList.AsObject;
  static toObject(includeInstance: boolean, msg: StringList): StringList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StringList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StringList;
  static deserializeBinaryFromReader(message: StringList, reader: jspb.BinaryReader): StringList;
}

export namespace StringList {
  export type AsObject = {
    valuesList: Array<string>,
  }
}

export class DateRange extends jspb.Message {
  getStart(): string;
  setStart(value: string): void;

  getEnd(): string;
  setEnd(value: string): void;

  getField(): string;
  setField(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DateRange.AsObject;
  static toObject(includeInstance: boolean, msg: DateRange): DateRange.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DateRange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DateRange;
  static deserializeBinaryFromReader(message: DateRange, reader: jspb.BinaryReader): DateRange;
}

export namespace DateRange {
  export type AsObject = {
    start: string,
    end: string,
    field: string,
  }
}

export class Empty extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Empty.AsObject;
  static toObject(includeInstance: boolean, msg: Empty): Empty.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Empty, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Empty;
  static deserializeBinaryFromReader(message: Empty, reader: jspb.BinaryReader): Empty;
}

export namespace Empty {
  export type AsObject = {
  }
}

export class IntArray extends jspb.Message {
  clearIdsList(): void;
  getIdsList(): Array<number>;
  setIdsList(value: Array<number>): void;
  addIds(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IntArray.AsObject;
  static toObject(includeInstance: boolean, msg: IntArray): IntArray.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: IntArray, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IntArray;
  static deserializeBinaryFromReader(message: IntArray, reader: jspb.BinaryReader): IntArray;
}

export namespace IntArray {
  export type AsObject = {
    idsList: Array<number>,
  }
}

export class Bool extends jspb.Message {
  getValue(): boolean;
  setValue(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Bool.AsObject;
  static toObject(includeInstance: boolean, msg: Bool): Bool.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Bool, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Bool;
  static deserializeBinaryFromReader(message: Bool, reader: jspb.BinaryReader): Bool;
}

export namespace Bool {
  export type AsObject = {
    value: boolean,
  }
}

