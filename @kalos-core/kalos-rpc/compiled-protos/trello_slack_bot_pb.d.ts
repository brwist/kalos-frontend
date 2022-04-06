// package: 
// file: trello_slack_bot.proto

import * as jspb from "google-protobuf";
import * as google_api_annotations_pb from "./google/api/annotations_pb";
import * as common_pb from "./common_pb";
import * as google_protobuf_any_pb from "google-protobuf/google/protobuf/any_pb";
import * as google_api_httpbody_pb from "./google/api/httpbody_pb";

export class Request extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  hasDetails(): boolean;
  clearDetails(): void;
  getDetails(): google_api_httpbody_pb.HttpBody | undefined;
  setDetails(value?: google_api_httpbody_pb.HttpBody): void;

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
    details?: google_api_httpbody_pb.HttpBody.AsObject,
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
  }
}

