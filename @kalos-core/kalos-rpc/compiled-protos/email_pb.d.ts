// package: 
// file: email.proto

import * as jspb from "google-protobuf";
import * as common_pb from "./common_pb";
import * as document_pb from "./document_pb";

export class SQSEmail extends jspb.Message {
  getBody(): string;
  setBody(value: string): void;

  getSubject(): string;
  setSubject(value: string): void;

  getTo(): string;
  setTo(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SQSEmail.AsObject;
  static toObject(includeInstance: boolean, msg: SQSEmail): SQSEmail.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SQSEmail, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SQSEmail;
  static deserializeBinaryFromReader(message: SQSEmail, reader: jspb.BinaryReader): SQSEmail;
}

export namespace SQSEmail {
  export type AsObject = {
    body: string,
    subject: string,
    to: string,
  }
}

export class Email extends jspb.Message {
  getRecipient(): string;
  setRecipient(value: string): void;

  getFromKey(): string;
  setFromKey(value: string): void;

  getBody(): string;
  setBody(value: string): void;

  getSent(): number;
  setSent(value: number): void;

  getError(): string;
  setError(value: string): void;

  getSubject(): string;
  setSubject(value: string): void;

  getFromOverride(): string;
  setFromOverride(value: string): void;

  getDownloadUrl(): string;
  setDownloadUrl(value: string): void;

  getAddress(): string;
  setAddress(value: string): void;

  getUserId(): number;
  setUserId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Email.AsObject;
  static toObject(includeInstance: boolean, msg: Email): Email.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Email, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Email;
  static deserializeBinaryFromReader(message: Email, reader: jspb.BinaryReader): Email;
}

export namespace Email {
  export type AsObject = {
    recipient: string,
    fromKey: string,
    body: string,
    sent: number,
    error: string,
    subject: string,
    fromOverride: string,
    downloadUrl: string,
    address: string,
    userId: number,
  }
}

export class SQSEmailAndDocument extends jspb.Message {
  hasEmail(): boolean;
  clearEmail(): void;
  getEmail(): SQSEmail | undefined;
  setEmail(value?: SQSEmail): void;

  hasDocument(): boolean;
  clearDocument(): void;
  getDocument(): document_pb.Document | undefined;
  setDocument(value?: document_pb.Document): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SQSEmailAndDocument.AsObject;
  static toObject(includeInstance: boolean, msg: SQSEmailAndDocument): SQSEmailAndDocument.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SQSEmailAndDocument, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SQSEmailAndDocument;
  static deserializeBinaryFromReader(message: SQSEmailAndDocument, reader: jspb.BinaryReader): SQSEmailAndDocument;
}

export namespace SQSEmailAndDocument {
  export type AsObject = {
    email?: SQSEmail.AsObject,
    document?: document_pb.Document.AsObject,
  }
}

export class InvoiceBodyRequest extends jspb.Message {
  getFilename(): string;
  setFilename(value: string): void;

  getPropertyId(): number;
  setPropertyId(value: number): void;

  getInvoiceId(): number;
  setInvoiceId(value: number): void;

  getType(): number;
  setType(value: number): void;

  getDescription(): string;
  setDescription(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InvoiceBodyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: InvoiceBodyRequest): InvoiceBodyRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InvoiceBodyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InvoiceBodyRequest;
  static deserializeBinaryFromReader(message: InvoiceBodyRequest, reader: jspb.BinaryReader): InvoiceBodyRequest;
}

export namespace InvoiceBodyRequest {
  export type AsObject = {
    filename: string,
    propertyId: number,
    invoiceId: number,
    type: number,
    description: string,
  }
}

