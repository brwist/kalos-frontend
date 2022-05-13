// package: 
// file: google_chat.proto

import * as jspb from "google-protobuf";
import * as common_pb from "./common_pb";
import * as google_api_annotations_pb from "./google/api/annotations_pb";
import * as google_protobuf_any_pb from "google-protobuf/google/protobuf/any_pb";

export class InitialRequest extends jspb.Message {
  hasReq(): boolean;
  clearReq(): void;
  getReq(): HttpRequest | undefined;
  setReq(value?: HttpRequest): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitialRequest.AsObject;
  static toObject(includeInstance: boolean, msg: InitialRequest): InitialRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InitialRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitialRequest;
  static deserializeBinaryFromReader(message: InitialRequest, reader: jspb.BinaryReader): InitialRequest;
}

export namespace InitialRequest {
  export type AsObject = {
    req?: HttpRequest.AsObject,
  }
}

export class HttpRequest extends jspb.Message {
  getHttpMethod(): string;
  setHttpMethod(value: string): void;

  getRequestUrl(): string;
  setRequestUrl(value: string): void;

  getBody(): string;
  setBody(value: string): void;

  getGoogleSpaceId(): string;
  setGoogleSpaceId(value: string): void;

  getContentType(): string;
  setContentType(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HttpRequest.AsObject;
  static toObject(includeInstance: boolean, msg: HttpRequest): HttpRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HttpRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HttpRequest;
  static deserializeBinaryFromReader(message: HttpRequest, reader: jspb.BinaryReader): HttpRequest;
}

export namespace HttpRequest {
  export type AsObject = {
    httpMethod: string,
    requestUrl: string,
    body: string,
    googleSpaceId: string,
    contentType: string,
  }
}

export class Message extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  getSpaceId(): string;
  setSpaceId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Message.AsObject;
  static toObject(includeInstance: boolean, msg: Message): Message.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Message, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Message;
  static deserializeBinaryFromReader(message: Message, reader: jspb.BinaryReader): Message;
}

export namespace Message {
  export type AsObject = {
    message: string,
    spaceId: string,
  }
}

export class Space extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  getHistory(): number;
  setHistory(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Space.AsObject;
  static toObject(includeInstance: boolean, msg: Space): Space.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Space, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Space;
  static deserializeBinaryFromReader(message: Space, reader: jspb.BinaryReader): Space;
}

export namespace Space {
  export type AsObject = {
    id: string,
    name: string,
    history: number,
  }
}

