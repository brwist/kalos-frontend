// package: 
// file: trello.proto

import * as jspb from "google-protobuf";
import * as common_pb from "./common_pb";

export class BoardPrefs extends jspb.Message {
  getPermissionLevel(): string;
  setPermissionLevel(value: string): void;

  getVoting(): string;
  setVoting(value: string): void;

  getComments(): string;
  setComments(value: string): void;

  getInvitations(): string;
  setInvitations(value: string): void;

  getSelfJoin(): boolean;
  setSelfJoin(value: boolean): void;

  getCardCovers(): boolean;
  setCardCovers(value: boolean): void;

  getCardAging(): string;
  setCardAging(value: string): void;

  getCalendarFeedEnabled(): boolean;
  setCalendarFeedEnabled(value: boolean): void;

  getBackground(): string;
  setBackground(value: string): void;

  getBackgroundColor(): string;
  setBackgroundColor(value: string): void;

  getBackgroundImage(): string;
  setBackgroundImage(value: string): void;

  getBackgroundTile(): boolean;
  setBackgroundTile(value: boolean): void;

  getBackgroundBrightness(): string;
  setBackgroundBrightness(value: string): void;

  getCanBePublic(): boolean;
  setCanBePublic(value: boolean): void;

  getCanBeOrg(): boolean;
  setCanBeOrg(value: boolean): void;

  getCanBePrivate(): boolean;
  setCanBePrivate(value: boolean): void;

  getCanInvite(): boolean;
  setCanInvite(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BoardPrefs.AsObject;
  static toObject(includeInstance: boolean, msg: BoardPrefs): BoardPrefs.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BoardPrefs, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BoardPrefs;
  static deserializeBinaryFromReader(message: BoardPrefs, reader: jspb.BinaryReader): BoardPrefs;
}

export namespace BoardPrefs {
  export type AsObject = {
    permissionLevel: string,
    voting: string,
    comments: string,
    invitations: string,
    selfJoin: boolean,
    cardCovers: boolean,
    cardAging: string,
    calendarFeedEnabled: boolean,
    background: string,
    backgroundColor: string,
    backgroundImage: string,
    backgroundTile: boolean,
    backgroundBrightness: string,
    canBePublic: boolean,
    canBeOrg: boolean,
    canBePrivate: boolean,
    canInvite: boolean,
  }
}

export class LabelNames extends jspb.Message {
  getBlack(): string;
  setBlack(value: string): void;

  getBlue(): string;
  setBlue(value: string): void;

  getGreen(): string;
  setGreen(value: string): void;

  getLime(): string;
  setLime(value: string): void;

  getOrange(): string;
  setOrange(value: string): void;

  getPink(): string;
  setPink(value: string): void;

  getPurple(): string;
  setPurple(value: string): void;

  getRed(): string;
  setRed(value: string): void;

  getSky(): string;
  setSky(value: string): void;

  getYellow(): string;
  setYellow(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LabelNames.AsObject;
  static toObject(includeInstance: boolean, msg: LabelNames): LabelNames.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LabelNames, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LabelNames;
  static deserializeBinaryFromReader(message: LabelNames, reader: jspb.BinaryReader): LabelNames;
}

export namespace LabelNames {
  export type AsObject = {
    black: string,
    blue: string,
    green: string,
    lime: string,
    orange: string,
    pink: string,
    purple: string,
    red: string,
    sky: string,
    yellow: string,
  }
}

export class Board extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getClosed(): boolean;
  setClosed(value: boolean): void;

  getOrganizationId(): string;
  setOrganizationId(value: string): void;

  getPinned(): boolean;
  setPinned(value: boolean): void;

  getStarred(): boolean;
  setStarred(value: boolean): void;

  getUrl(): string;
  setUrl(value: string): void;

  getShortUrl(): string;
  setShortUrl(value: string): void;

  hasPrefs(): boolean;
  clearPrefs(): void;
  getPrefs(): BoardPrefs | undefined;
  setPrefs(value?: BoardPrefs): void;

  getSubscribed(): boolean;
  setSubscribed(value: boolean): void;

  hasLabelNames(): boolean;
  clearLabelNames(): void;
  getLabelNames(): LabelNames | undefined;
  setLabelNames(value?: LabelNames): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Board.AsObject;
  static toObject(includeInstance: boolean, msg: Board): Board.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Board, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Board;
  static deserializeBinaryFromReader(message: Board, reader: jspb.BinaryReader): Board;
}

export namespace Board {
  export type AsObject = {
    id: string,
    name: string,
    description: string,
    closed: boolean,
    organizationId: string,
    pinned: boolean,
    starred: boolean,
    url: string,
    shortUrl: string,
    prefs?: BoardPrefs.AsObject,
    subscribed: boolean,
    labelNames?: LabelNames.AsObject,
  }
}

export class BoardList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<Board>;
  setResultsList(value: Array<Board>): void;
  addResults(value?: Board, index?: number): Board;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BoardList.AsObject;
  static toObject(includeInstance: boolean, msg: BoardList): BoardList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BoardList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BoardList;
  static deserializeBinaryFromReader(message: BoardList, reader: jspb.BinaryReader): BoardList;
}

export namespace BoardList {
  export type AsObject = {
    resultsList: Array<Board.AsObject>,
    totalCount: number,
  }
}

export class BoardIdList extends jspb.Message {
  clearIdListList(): void;
  getIdListList(): Array<string>;
  setIdListList(value: Array<string>): void;
  addIdList(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BoardIdList.AsObject;
  static toObject(includeInstance: boolean, msg: BoardIdList): BoardIdList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BoardIdList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BoardIdList;
  static deserializeBinaryFromReader(message: BoardIdList, reader: jspb.BinaryReader): BoardIdList;
}

export namespace BoardIdList {
  export type AsObject = {
    idListList: Array<string>,
  }
}

