// package: 
// file: trello_slack_bot.proto

import * as jspb from "google-protobuf";
import * as google_api_annotations_pb from "./google/api/annotations_pb";
import * as common_pb from "./common_pb";
import * as google_protobuf_any_pb from "google-protobuf/google/protobuf/any_pb";
import * as google_api_httpbody_pb from "./google/api/httpbody_pb";
import * as google_rpc_error_details_pb from "./google/rpc/error_details_pb";

export class HelpRequest extends jspb.Message {
  hasRawBody(): boolean;
  clearRawBody(): void;
  getRawBody(): google_api_httpbody_pb.HttpBody | undefined;
  setRawBody(value?: google_api_httpbody_pb.HttpBody): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HelpRequest.AsObject;
  static toObject(includeInstance: boolean, msg: HelpRequest): HelpRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HelpRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HelpRequest;
  static deserializeBinaryFromReader(message: HelpRequest, reader: jspb.BinaryReader): HelpRequest;
}

export namespace HelpRequest {
  export type AsObject = {
    rawBody?: google_api_httpbody_pb.HttpBody.AsObject,
  }
}

export class Request extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  getToken(): string;
  setToken(value: string): void;

  getTeamId(): string;
  setTeamId(value: string): void;

  getTeamDomain(): string;
  setTeamDomain(value: string): void;

  getEnterpriseId(): string;
  setEnterpriseId(value: string): void;

  getChannelId(): string;
  setChannelId(value: string): void;

  getChannelName(): string;
  setChannelName(value: string): void;

  getUserId(): string;
  setUserId(value: string): void;

  getUserName(): string;
  setUserName(value: string): void;

  getCommand(): string;
  setCommand(value: string): void;

  getText(): string;
  setText(value: string): void;

  getResponseUrl(): string;
  setResponseUrl(value: string): void;

  getTriggerId(): string;
  setTriggerId(value: string): void;

  getApiAppId(): string;
  setApiAppId(value: string): void;

  hasBody(): boolean;
  clearBody(): void;
  getBody(): google_api_httpbody_pb.HttpBody | undefined;
  setBody(value?: google_api_httpbody_pb.HttpBody): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Request.AsObject;
  static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Request;
  static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
}

export namespace Request {
  export type AsObject = {
    message: string,
    token: string,
    teamId: string,
    teamDomain: string,
    enterpriseId: string,
    channelId: string,
    channelName: string,
    userId: string,
    userName: string,
    command: string,
    text: string,
    responseUrl: string,
    triggerId: string,
    apiAppId: string,
    body?: google_api_httpbody_pb.HttpBody.AsObject,
  }
}

export class MessageBox extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  clearSectionsList(): void;
  getSectionsList(): Array<string>;
  setSectionsList(value: Array<string>): void;
  addSections(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageBox.AsObject;
  static toObject(includeInstance: boolean, msg: MessageBox): MessageBox.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MessageBox, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageBox;
  static deserializeBinaryFromReader(message: MessageBox, reader: jspb.BinaryReader): MessageBox;
}

export namespace MessageBox {
  export type AsObject = {
    title: string,
    description: string,
    sectionsList: Array<string>,
  }
}

export class Section extends jspb.Message {
  getText(): string;
  setText(value: string): void;

  getToken(): string;
  setToken(value: string): void;

  getTeamId(): string;
  setTeamId(value: string): void;

  getTeamDomain(): string;
  setTeamDomain(value: string): void;

  getEnterpriseId(): string;
  setEnterpriseId(value: string): void;

  getChannelId(): string;
  setChannelId(value: string): void;

  getChannelName(): string;
  setChannelName(value: string): void;

  getUserId(): string;
  setUserId(value: string): void;

  getUserName(): string;
  setUserName(value: string): void;

  getCommand(): string;
  setCommand(value: string): void;

  getResponseUrl(): string;
  setResponseUrl(value: string): void;

  getTriggerId(): string;
  setTriggerId(value: string): void;

  getApiAppId(): string;
  setApiAppId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Section.AsObject;
  static toObject(includeInstance: boolean, msg: Section): Section.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Section, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Section;
  static deserializeBinaryFromReader(message: Section, reader: jspb.BinaryReader): Section;
}

export namespace Section {
  export type AsObject = {
    text: string,
    token: string,
    teamId: string,
    teamDomain: string,
    enterpriseId: string,
    channelId: string,
    channelName: string,
    userId: string,
    userName: string,
    command: string,
    responseUrl: string,
    triggerId: string,
    apiAppId: string,
  }
}

