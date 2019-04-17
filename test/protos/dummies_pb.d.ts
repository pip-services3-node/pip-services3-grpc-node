// package: dummies
// file: dummies.proto

import * as jspb from "google-protobuf";

export class ErrorDescription extends jspb.Message {
  getCategory(): string;
  setCategory(value: string): void;

  getCode(): string;
  setCode(value: string): void;

  getCorrelationId(): string;
  setCorrelationId(value: string): void;

  getStatus(): string;
  setStatus(value: string): void;

  getMessage(): string;
  setMessage(value: string): void;

  getCause(): string;
  setCause(value: string): void;

  getStackTrace(): string;
  setStackTrace(value: string): void;

  getDetailsMap(): jspb.Map<string, string>;
  clearDetailsMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ErrorDescription.AsObject;
  static toObject(includeInstance: boolean, msg: ErrorDescription): ErrorDescription.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ErrorDescription, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ErrorDescription;
  static deserializeBinaryFromReader(message: ErrorDescription, reader: jspb.BinaryReader): ErrorDescription;
}

export namespace ErrorDescription {
  export type AsObject = {
    category: string,
    code: string,
    correlationId: string,
    status: string,
    message: string,
    cause: string,
    stackTrace: string,
    detailsMap: Array<[string, string]>,
  }
}

export class PagingParams extends jspb.Message {
  getSkip(): number;
  setSkip(value: number): void;

  getTake(): number;
  setTake(value: number): void;

  getTotal(): boolean;
  setTotal(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PagingParams.AsObject;
  static toObject(includeInstance: boolean, msg: PagingParams): PagingParams.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PagingParams, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PagingParams;
  static deserializeBinaryFromReader(message: PagingParams, reader: jspb.BinaryReader): PagingParams;
}

export namespace PagingParams {
  export type AsObject = {
    skip: number,
    take: number,
    total: boolean,
  }
}

export class Dummy extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getKey(): string;
  setKey(value: string): void;

  getContent(): string;
  setContent(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Dummy.AsObject;
  static toObject(includeInstance: boolean, msg: Dummy): Dummy.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Dummy, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Dummy;
  static deserializeBinaryFromReader(message: Dummy, reader: jspb.BinaryReader): Dummy;
}

export namespace Dummy {
  export type AsObject = {
    id: string,
    key: string,
    content: string,
  }
}

export class DummiesPage extends jspb.Message {
  getTotal(): number;
  setTotal(value: number): void;

  clearDataList(): void;
  getDataList(): Array<Dummy>;
  setDataList(value: Array<Dummy>): void;
  addData(value?: Dummy, index?: number): Dummy;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DummiesPage.AsObject;
  static toObject(includeInstance: boolean, msg: DummiesPage): DummiesPage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DummiesPage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DummiesPage;
  static deserializeBinaryFromReader(message: DummiesPage, reader: jspb.BinaryReader): DummiesPage;
}

export namespace DummiesPage {
  export type AsObject = {
    total: number,
    dataList: Array<Dummy.AsObject>,
  }
}

export class DummiesPageRequest extends jspb.Message {
  getCorrelationId(): string;
  setCorrelationId(value: string): void;

  getFilterMap(): jspb.Map<string, string>;
  clearFilterMap(): void;
  hasPaging(): boolean;
  clearPaging(): void;
  getPaging(): PagingParams | undefined;
  setPaging(value?: PagingParams): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DummiesPageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DummiesPageRequest): DummiesPageRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DummiesPageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DummiesPageRequest;
  static deserializeBinaryFromReader(message: DummiesPageRequest, reader: jspb.BinaryReader): DummiesPageRequest;
}

export namespace DummiesPageRequest {
  export type AsObject = {
    correlationId: string,
    filterMap: Array<[string, string]>,
    paging?: PagingParams.AsObject,
  }
}

export class DummyIdRequest extends jspb.Message {
  getCorrelationId(): string;
  setCorrelationId(value: string): void;

  getDummyId(): string;
  setDummyId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DummyIdRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DummyIdRequest): DummyIdRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DummyIdRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DummyIdRequest;
  static deserializeBinaryFromReader(message: DummyIdRequest, reader: jspb.BinaryReader): DummyIdRequest;
}

export namespace DummyIdRequest {
  export type AsObject = {
    correlationId: string,
    dummyId: string,
  }
}

export class DummyObjectRequest extends jspb.Message {
  getCorrelationId(): string;
  setCorrelationId(value: string): void;

  hasDummy(): boolean;
  clearDummy(): void;
  getDummy(): Dummy | undefined;
  setDummy(value?: Dummy): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DummyObjectRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DummyObjectRequest): DummyObjectRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DummyObjectRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DummyObjectRequest;
  static deserializeBinaryFromReader(message: DummyObjectRequest, reader: jspb.BinaryReader): DummyObjectRequest;
}

export namespace DummyObjectRequest {
  export type AsObject = {
    correlationId: string,
    dummy?: Dummy.AsObject,
  }
}

