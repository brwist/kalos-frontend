// package: 
// file: job_type.proto

import * as jspb from "google-protobuf";

export class JobType extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JobType.AsObject;
  static toObject(includeInstance: boolean, msg: JobType): JobType.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JobType, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JobType;
  static deserializeBinaryFromReader(message: JobType, reader: jspb.BinaryReader): JobType;
}

export namespace JobType {
  export type AsObject = {
    id: number,
    name: string,
  }
}

export class JobTypeList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<JobType>;
  setResultsList(value: Array<JobType>): void;
  addResults(value?: JobType, index?: number): JobType;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JobTypeList.AsObject;
  static toObject(includeInstance: boolean, msg: JobTypeList): JobTypeList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JobTypeList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JobTypeList;
  static deserializeBinaryFromReader(message: JobTypeList, reader: jspb.BinaryReader): JobTypeList;
}

export namespace JobTypeList {
  export type AsObject = {
    resultsList: Array<JobType.AsObject>,
    totalCount: number,
  }
}

