// package: 
// file: job_subtype.proto

import * as jspb from "google-protobuf";

export class JobSubtype extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getName(): string;
  setName(value: string): void;

  getClassCode(): number;
  setClassCode(value: number): void;

  getSubtypeCode(): string;
  setSubtypeCode(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JobSubtype.AsObject;
  static toObject(includeInstance: boolean, msg: JobSubtype): JobSubtype.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JobSubtype, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JobSubtype;
  static deserializeBinaryFromReader(message: JobSubtype, reader: jspb.BinaryReader): JobSubtype;
}

export namespace JobSubtype {
  export type AsObject = {
    id: number,
    name: string,
    classCode: number,
    subtypeCode: string,
  }
}

export class JobSubtypeList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<JobSubtype>;
  setResultsList(value: Array<JobSubtype>): void;
  addResults(value?: JobSubtype, index?: number): JobSubtype;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JobSubtypeList.AsObject;
  static toObject(includeInstance: boolean, msg: JobSubtypeList): JobSubtypeList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JobSubtypeList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JobSubtypeList;
  static deserializeBinaryFromReader(message: JobSubtypeList, reader: jspb.BinaryReader): JobSubtypeList;
}

export namespace JobSubtypeList {
  export type AsObject = {
    resultsList: Array<JobSubtype.AsObject>,
    totalCount: number,
  }
}

