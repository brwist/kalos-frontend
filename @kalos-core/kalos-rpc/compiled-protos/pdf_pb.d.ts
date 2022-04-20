// package: 
// file: pdf.proto

import * as jspb from "google-protobuf";
import * as s3_pb from "./s3_pb";

export class HTML extends jspb.Message {
  getData(): string;
  setData(value: string): void;

  getKey(): string;
  setKey(value: string): void;

  getBucket(): string;
  setBucket(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HTML.AsObject;
  static toObject(includeInstance: boolean, msg: HTML): HTML.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HTML, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HTML;
  static deserializeBinaryFromReader(message: HTML, reader: jspb.BinaryReader): HTML;
}

export namespace HTML {
  export type AsObject = {
    data: string,
    key: string,
    bucket: string,
  }
}

