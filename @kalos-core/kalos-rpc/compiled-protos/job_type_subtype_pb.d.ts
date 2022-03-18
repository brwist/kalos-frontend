// package: 
// file: job_type_subtype.proto

import * as jspb from "google-protobuf";

export class JobTypeSubtype extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getJobTypeId(): number;
  setJobTypeId(value: number): void;

  getJobSubtypeId(): number;
  setJobSubtypeId(value: number): void;

  clearFieldMaskList(): void;
  getFieldMaskList(): Array<string>;
  setFieldMaskList(value: Array<string>): void;
  addFieldMask(value: string, index?: number): string;

  getPageNumber(): number;
  setPageNumber(value: number): void;

  getWithoutLimit(): boolean;
  setWithoutLimit(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JobTypeSubtype.AsObject;
  static toObject(includeInstance: boolean, msg: JobTypeSubtype): JobTypeSubtype.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JobTypeSubtype, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JobTypeSubtype;
  static deserializeBinaryFromReader(message: JobTypeSubtype, reader: jspb.BinaryReader): JobTypeSubtype;
}

export namespace JobTypeSubtype {
  export type AsObject = {
    id: number,
    jobTypeId: number,
    jobSubtypeId: number,
    fieldMaskList: Array<string>,
    pageNumber: number,
    withoutLimit: boolean,
  }
}

export class JobTypeSubtypeList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<JobTypeSubtype>;
  setResultsList(value: Array<JobTypeSubtype>): void;
  addResults(value?: JobTypeSubtype, index?: number): JobTypeSubtype;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JobTypeSubtypeList.AsObject;
  static toObject(includeInstance: boolean, msg: JobTypeSubtypeList): JobTypeSubtypeList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JobTypeSubtypeList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JobTypeSubtypeList;
  static deserializeBinaryFromReader(message: JobTypeSubtypeList, reader: jspb.BinaryReader): JobTypeSubtypeList;
}

export namespace JobTypeSubtypeList {
  export type AsObject = {
    resultsList: Array<JobTypeSubtype.AsObject>,
    totalCount: number,
  }
}

