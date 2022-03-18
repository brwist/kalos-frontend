// package: 
// file: user.proto

import * as user_pb from "./user_pb";
import * as common_pb from "./common_pb";
import {grpc} from "@improbable-eng/grpc-web";

type UserServiceCreate = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_pb.User;
  readonly responseType: typeof user_pb.User;
};

type UserServiceGet = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_pb.User;
  readonly responseType: typeof user_pb.User;
};

type UserServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_pb.User;
  readonly responseType: typeof user_pb.UserList;
};

type UserServiceList = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof user_pb.User;
  readonly responseType: typeof user_pb.User;
};

type UserServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_pb.User;
  readonly responseType: typeof user_pb.User;
};

type UserServiceDelete = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_pb.User;
  readonly responseType: typeof user_pb.User;
};

type UserServiceGetCardList = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_pb.CardData;
  readonly responseType: typeof user_pb.CardDataList;
};

type UserServiceGetUserManager = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_pb.User;
  readonly responseType: typeof user_pb.User;
};

type UserServiceCreatePermissionGroup = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_pb.PermissionGroup;
  readonly responseType: typeof common_pb.Int32;
};

type UserServiceGetPermissionGroupUser = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_pb.PermissionGroupUser;
  readonly responseType: typeof user_pb.PermissionGroupUser;
};

type UserServiceBatchGetPermissionGroupUser = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_pb.PermissionGroupUser;
  readonly responseType: typeof user_pb.PermissionGroupUserList;
};

type UserServiceDeletePermissionGroup = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof common_pb.Int32;
  readonly responseType: typeof common_pb.Empty;
};

type UserServiceUpdatePermissionGroup = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_pb.PermissionGroup;
  readonly responseType: typeof common_pb.Empty;
};

type UserServiceAddUserToPermissionGroup = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_pb.PermissionGroupUser;
  readonly responseType: typeof common_pb.Bool;
};

type UserServiceRemoveUserFromPermissionGroup = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_pb.PermissionGroupUser;
  readonly responseType: typeof common_pb.Empty;
};

type UserServiceUserInPermissionGroup = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_pb.PermissionGroupUser;
  readonly responseType: typeof common_pb.Bool;
};

type UserServiceBatchGetUserPermissions = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_pb.PermissionGroupUser;
  readonly responseType: typeof user_pb.PermissionGroupUserList;
};

type UserServiceBatchGetPermissions = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_pb.PermissionGroup;
  readonly responseType: typeof user_pb.PermissionGroupList;
};

type UserServiceGetUserIdsInPermissionGroup = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof common_pb.Int32;
  readonly responseType: typeof common_pb.Int32List;
};

type UserServiceCreateVehicle = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_pb.Vehicle;
  readonly responseType: typeof common_pb.Int32;
};

type UserServiceGetVehicle = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_pb.Vehicle;
  readonly responseType: typeof user_pb.Vehicle;
};

type UserServiceBatchGetVehicle = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_pb.Vehicle;
  readonly responseType: typeof user_pb.VehicleList;
};

type UserServiceUpdateVehicle = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof user_pb.Vehicle;
  readonly responseType: typeof common_pb.Empty;
};

type UserServiceDeleteVehicle = {
  readonly methodName: string;
  readonly service: typeof UserService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof common_pb.Int32;
  readonly responseType: typeof common_pb.Empty;
};

export class UserService {
  static readonly serviceName: string;
  static readonly Create: UserServiceCreate;
  static readonly Get: UserServiceGet;
  static readonly BatchGet: UserServiceBatchGet;
  static readonly List: UserServiceList;
  static readonly Update: UserServiceUpdate;
  static readonly Delete: UserServiceDelete;
  static readonly GetCardList: UserServiceGetCardList;
  static readonly GetUserManager: UserServiceGetUserManager;
  static readonly CreatePermissionGroup: UserServiceCreatePermissionGroup;
  static readonly GetPermissionGroupUser: UserServiceGetPermissionGroupUser;
  static readonly BatchGetPermissionGroupUser: UserServiceBatchGetPermissionGroupUser;
  static readonly DeletePermissionGroup: UserServiceDeletePermissionGroup;
  static readonly UpdatePermissionGroup: UserServiceUpdatePermissionGroup;
  static readonly AddUserToPermissionGroup: UserServiceAddUserToPermissionGroup;
  static readonly RemoveUserFromPermissionGroup: UserServiceRemoveUserFromPermissionGroup;
  static readonly UserInPermissionGroup: UserServiceUserInPermissionGroup;
  static readonly BatchGetUserPermissions: UserServiceBatchGetUserPermissions;
  static readonly BatchGetPermissions: UserServiceBatchGetPermissions;
  static readonly GetUserIdsInPermissionGroup: UserServiceGetUserIdsInPermissionGroup;
  static readonly CreateVehicle: UserServiceCreateVehicle;
  static readonly GetVehicle: UserServiceGetVehicle;
  static readonly BatchGetVehicle: UserServiceBatchGetVehicle;
  static readonly UpdateVehicle: UserServiceUpdateVehicle;
  static readonly DeleteVehicle: UserServiceDeleteVehicle;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class UserServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: user_pb.User,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: user_pb.User|null) => void
  ): UnaryResponse;
  create(
    requestMessage: user_pb.User,
    callback: (error: ServiceError|null, responseMessage: user_pb.User|null) => void
  ): UnaryResponse;
  get(
    requestMessage: user_pb.User,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: user_pb.User|null) => void
  ): UnaryResponse;
  get(
    requestMessage: user_pb.User,
    callback: (error: ServiceError|null, responseMessage: user_pb.User|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: user_pb.User,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: user_pb.UserList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: user_pb.User,
    callback: (error: ServiceError|null, responseMessage: user_pb.UserList|null) => void
  ): UnaryResponse;
  list(requestMessage: user_pb.User, metadata?: grpc.Metadata): ResponseStream<user_pb.User>;
  update(
    requestMessage: user_pb.User,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: user_pb.User|null) => void
  ): UnaryResponse;
  update(
    requestMessage: user_pb.User,
    callback: (error: ServiceError|null, responseMessage: user_pb.User|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: user_pb.User,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: user_pb.User|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: user_pb.User,
    callback: (error: ServiceError|null, responseMessage: user_pb.User|null) => void
  ): UnaryResponse;
  getCardList(
    requestMessage: user_pb.CardData,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: user_pb.CardDataList|null) => void
  ): UnaryResponse;
  getCardList(
    requestMessage: user_pb.CardData,
    callback: (error: ServiceError|null, responseMessage: user_pb.CardDataList|null) => void
  ): UnaryResponse;
  getUserManager(
    requestMessage: user_pb.User,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: user_pb.User|null) => void
  ): UnaryResponse;
  getUserManager(
    requestMessage: user_pb.User,
    callback: (error: ServiceError|null, responseMessage: user_pb.User|null) => void
  ): UnaryResponse;
  createPermissionGroup(
    requestMessage: user_pb.PermissionGroup,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Int32|null) => void
  ): UnaryResponse;
  createPermissionGroup(
    requestMessage: user_pb.PermissionGroup,
    callback: (error: ServiceError|null, responseMessage: common_pb.Int32|null) => void
  ): UnaryResponse;
  getPermissionGroupUser(
    requestMessage: user_pb.PermissionGroupUser,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: user_pb.PermissionGroupUser|null) => void
  ): UnaryResponse;
  getPermissionGroupUser(
    requestMessage: user_pb.PermissionGroupUser,
    callback: (error: ServiceError|null, responseMessage: user_pb.PermissionGroupUser|null) => void
  ): UnaryResponse;
  batchGetPermissionGroupUser(
    requestMessage: user_pb.PermissionGroupUser,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: user_pb.PermissionGroupUserList|null) => void
  ): UnaryResponse;
  batchGetPermissionGroupUser(
    requestMessage: user_pb.PermissionGroupUser,
    callback: (error: ServiceError|null, responseMessage: user_pb.PermissionGroupUserList|null) => void
  ): UnaryResponse;
  deletePermissionGroup(
    requestMessage: common_pb.Int32,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  deletePermissionGroup(
    requestMessage: common_pb.Int32,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  updatePermissionGroup(
    requestMessage: user_pb.PermissionGroup,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  updatePermissionGroup(
    requestMessage: user_pb.PermissionGroup,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  addUserToPermissionGroup(
    requestMessage: user_pb.PermissionGroupUser,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Bool|null) => void
  ): UnaryResponse;
  addUserToPermissionGroup(
    requestMessage: user_pb.PermissionGroupUser,
    callback: (error: ServiceError|null, responseMessage: common_pb.Bool|null) => void
  ): UnaryResponse;
  removeUserFromPermissionGroup(
    requestMessage: user_pb.PermissionGroupUser,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  removeUserFromPermissionGroup(
    requestMessage: user_pb.PermissionGroupUser,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  userInPermissionGroup(
    requestMessage: user_pb.PermissionGroupUser,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Bool|null) => void
  ): UnaryResponse;
  userInPermissionGroup(
    requestMessage: user_pb.PermissionGroupUser,
    callback: (error: ServiceError|null, responseMessage: common_pb.Bool|null) => void
  ): UnaryResponse;
  batchGetUserPermissions(
    requestMessage: user_pb.PermissionGroupUser,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: user_pb.PermissionGroupUserList|null) => void
  ): UnaryResponse;
  batchGetUserPermissions(
    requestMessage: user_pb.PermissionGroupUser,
    callback: (error: ServiceError|null, responseMessage: user_pb.PermissionGroupUserList|null) => void
  ): UnaryResponse;
  batchGetPermissions(
    requestMessage: user_pb.PermissionGroup,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: user_pb.PermissionGroupList|null) => void
  ): UnaryResponse;
  batchGetPermissions(
    requestMessage: user_pb.PermissionGroup,
    callback: (error: ServiceError|null, responseMessage: user_pb.PermissionGroupList|null) => void
  ): UnaryResponse;
  getUserIdsInPermissionGroup(
    requestMessage: common_pb.Int32,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Int32List|null) => void
  ): UnaryResponse;
  getUserIdsInPermissionGroup(
    requestMessage: common_pb.Int32,
    callback: (error: ServiceError|null, responseMessage: common_pb.Int32List|null) => void
  ): UnaryResponse;
  createVehicle(
    requestMessage: user_pb.Vehicle,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Int32|null) => void
  ): UnaryResponse;
  createVehicle(
    requestMessage: user_pb.Vehicle,
    callback: (error: ServiceError|null, responseMessage: common_pb.Int32|null) => void
  ): UnaryResponse;
  getVehicle(
    requestMessage: user_pb.Vehicle,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: user_pb.Vehicle|null) => void
  ): UnaryResponse;
  getVehicle(
    requestMessage: user_pb.Vehicle,
    callback: (error: ServiceError|null, responseMessage: user_pb.Vehicle|null) => void
  ): UnaryResponse;
  batchGetVehicle(
    requestMessage: user_pb.Vehicle,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: user_pb.VehicleList|null) => void
  ): UnaryResponse;
  batchGetVehicle(
    requestMessage: user_pb.Vehicle,
    callback: (error: ServiceError|null, responseMessage: user_pb.VehicleList|null) => void
  ): UnaryResponse;
  updateVehicle(
    requestMessage: user_pb.Vehicle,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  updateVehicle(
    requestMessage: user_pb.Vehicle,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  deleteVehicle(
    requestMessage: common_pb.Int32,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
  deleteVehicle(
    requestMessage: common_pb.Int32,
    callback: (error: ServiceError|null, responseMessage: common_pb.Empty|null) => void
  ): UnaryResponse;
}

