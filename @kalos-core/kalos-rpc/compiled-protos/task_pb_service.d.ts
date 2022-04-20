// package: 
// file: task.proto

import * as task_pb from "./task_pb";
import * as common_pb from "./common_pb";
import {grpc} from "@improbable-eng/grpc-web";

type TaskServiceCreate = {
  readonly methodName: string;
  readonly service: typeof TaskService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_pb.Task;
  readonly responseType: typeof task_pb.Task;
};

type TaskServiceCreateProjectTask = {
  readonly methodName: string;
  readonly service: typeof TaskService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_pb.ProjectTask;
  readonly responseType: typeof task_pb.ProjectTask;
};

type TaskServiceGet = {
  readonly methodName: string;
  readonly service: typeof TaskService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_pb.Task;
  readonly responseType: typeof task_pb.Task;
};

type TaskServiceGetProjectTask = {
  readonly methodName: string;
  readonly service: typeof TaskService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_pb.ProjectTask;
  readonly responseType: typeof task_pb.ProjectTask;
};

type TaskServiceBatchGet = {
  readonly methodName: string;
  readonly service: typeof TaskService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_pb.Task;
  readonly responseType: typeof task_pb.TaskList;
};

type TaskServiceBatchGetProjectTasks = {
  readonly methodName: string;
  readonly service: typeof TaskService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_pb.ProjectTask;
  readonly responseType: typeof task_pb.ProjectTaskList;
};

type TaskServiceList = {
  readonly methodName: string;
  readonly service: typeof TaskService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof task_pb.Task;
  readonly responseType: typeof task_pb.Task;
};

type TaskServiceUpdate = {
  readonly methodName: string;
  readonly service: typeof TaskService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_pb.Task;
  readonly responseType: typeof task_pb.Task;
};

type TaskServiceUpdateProjectTask = {
  readonly methodName: string;
  readonly service: typeof TaskService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_pb.ProjectTask;
  readonly responseType: typeof task_pb.ProjectTask;
};

type TaskServiceDelete = {
  readonly methodName: string;
  readonly service: typeof TaskService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_pb.Task;
  readonly responseType: typeof task_pb.Task;
};

type TaskServiceDeleteProjectTask = {
  readonly methodName: string;
  readonly service: typeof TaskService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_pb.ProjectTask;
  readonly responseType: typeof task_pb.ProjectTask;
};

type TaskServiceGetSpiffTypes = {
  readonly methodName: string;
  readonly service: typeof TaskService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_pb.SpiffType;
  readonly responseType: typeof task_pb.SpiffTypeList;
};

type TaskServiceGetToolFundBalanceByID = {
  readonly methodName: string;
  readonly service: typeof TaskService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_pb.ToolFund;
  readonly responseType: typeof task_pb.ToolFund;
};

type TaskServiceGetAppliedSpiffs = {
  readonly methodName: string;
  readonly service: typeof TaskService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_pb.Spiff;
  readonly responseType: typeof task_pb.SpiffList;
};

type TaskServiceGetTaskStatusList = {
  readonly methodName: string;
  readonly service: typeof TaskService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_pb.TaskStatus;
  readonly responseType: typeof task_pb.TaskStatusList;
};

type TaskServiceGetTaskPriorityList = {
  readonly methodName: string;
  readonly service: typeof TaskService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof task_pb.TaskPriority;
  readonly responseType: typeof task_pb.TaskPriorityList;
};

type TaskServiceGetTaskBillableTypeList = {
  readonly methodName: string;
  readonly service: typeof TaskService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof common_pb.Empty;
  readonly responseType: typeof common_pb.StringList;
};

export class TaskService {
  static readonly serviceName: string;
  static readonly Create: TaskServiceCreate;
  static readonly CreateProjectTask: TaskServiceCreateProjectTask;
  static readonly Get: TaskServiceGet;
  static readonly GetProjectTask: TaskServiceGetProjectTask;
  static readonly BatchGet: TaskServiceBatchGet;
  static readonly BatchGetProjectTasks: TaskServiceBatchGetProjectTasks;
  static readonly List: TaskServiceList;
  static readonly Update: TaskServiceUpdate;
  static readonly UpdateProjectTask: TaskServiceUpdateProjectTask;
  static readonly Delete: TaskServiceDelete;
  static readonly DeleteProjectTask: TaskServiceDeleteProjectTask;
  static readonly GetSpiffTypes: TaskServiceGetSpiffTypes;
  static readonly GetToolFundBalanceByID: TaskServiceGetToolFundBalanceByID;
  static readonly GetAppliedSpiffs: TaskServiceGetAppliedSpiffs;
  static readonly GetTaskStatusList: TaskServiceGetTaskStatusList;
  static readonly GetTaskPriorityList: TaskServiceGetTaskPriorityList;
  static readonly GetTaskBillableTypeList: TaskServiceGetTaskBillableTypeList;
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

export class TaskServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: task_pb.Task,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_pb.Task|null) => void
  ): UnaryResponse;
  create(
    requestMessage: task_pb.Task,
    callback: (error: ServiceError|null, responseMessage: task_pb.Task|null) => void
  ): UnaryResponse;
  createProjectTask(
    requestMessage: task_pb.ProjectTask,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_pb.ProjectTask|null) => void
  ): UnaryResponse;
  createProjectTask(
    requestMessage: task_pb.ProjectTask,
    callback: (error: ServiceError|null, responseMessage: task_pb.ProjectTask|null) => void
  ): UnaryResponse;
  get(
    requestMessage: task_pb.Task,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_pb.Task|null) => void
  ): UnaryResponse;
  get(
    requestMessage: task_pb.Task,
    callback: (error: ServiceError|null, responseMessage: task_pb.Task|null) => void
  ): UnaryResponse;
  getProjectTask(
    requestMessage: task_pb.ProjectTask,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_pb.ProjectTask|null) => void
  ): UnaryResponse;
  getProjectTask(
    requestMessage: task_pb.ProjectTask,
    callback: (error: ServiceError|null, responseMessage: task_pb.ProjectTask|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: task_pb.Task,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_pb.TaskList|null) => void
  ): UnaryResponse;
  batchGet(
    requestMessage: task_pb.Task,
    callback: (error: ServiceError|null, responseMessage: task_pb.TaskList|null) => void
  ): UnaryResponse;
  batchGetProjectTasks(
    requestMessage: task_pb.ProjectTask,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_pb.ProjectTaskList|null) => void
  ): UnaryResponse;
  batchGetProjectTasks(
    requestMessage: task_pb.ProjectTask,
    callback: (error: ServiceError|null, responseMessage: task_pb.ProjectTaskList|null) => void
  ): UnaryResponse;
  list(requestMessage: task_pb.Task, metadata?: grpc.Metadata): ResponseStream<task_pb.Task>;
  update(
    requestMessage: task_pb.Task,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_pb.Task|null) => void
  ): UnaryResponse;
  update(
    requestMessage: task_pb.Task,
    callback: (error: ServiceError|null, responseMessage: task_pb.Task|null) => void
  ): UnaryResponse;
  updateProjectTask(
    requestMessage: task_pb.ProjectTask,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_pb.ProjectTask|null) => void
  ): UnaryResponse;
  updateProjectTask(
    requestMessage: task_pb.ProjectTask,
    callback: (error: ServiceError|null, responseMessage: task_pb.ProjectTask|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: task_pb.Task,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_pb.Task|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: task_pb.Task,
    callback: (error: ServiceError|null, responseMessage: task_pb.Task|null) => void
  ): UnaryResponse;
  deleteProjectTask(
    requestMessage: task_pb.ProjectTask,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_pb.ProjectTask|null) => void
  ): UnaryResponse;
  deleteProjectTask(
    requestMessage: task_pb.ProjectTask,
    callback: (error: ServiceError|null, responseMessage: task_pb.ProjectTask|null) => void
  ): UnaryResponse;
  getSpiffTypes(
    requestMessage: task_pb.SpiffType,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_pb.SpiffTypeList|null) => void
  ): UnaryResponse;
  getSpiffTypes(
    requestMessage: task_pb.SpiffType,
    callback: (error: ServiceError|null, responseMessage: task_pb.SpiffTypeList|null) => void
  ): UnaryResponse;
  getToolFundBalanceByID(
    requestMessage: task_pb.ToolFund,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_pb.ToolFund|null) => void
  ): UnaryResponse;
  getToolFundBalanceByID(
    requestMessage: task_pb.ToolFund,
    callback: (error: ServiceError|null, responseMessage: task_pb.ToolFund|null) => void
  ): UnaryResponse;
  getAppliedSpiffs(
    requestMessage: task_pb.Spiff,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_pb.SpiffList|null) => void
  ): UnaryResponse;
  getAppliedSpiffs(
    requestMessage: task_pb.Spiff,
    callback: (error: ServiceError|null, responseMessage: task_pb.SpiffList|null) => void
  ): UnaryResponse;
  getTaskStatusList(
    requestMessage: task_pb.TaskStatus,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_pb.TaskStatusList|null) => void
  ): UnaryResponse;
  getTaskStatusList(
    requestMessage: task_pb.TaskStatus,
    callback: (error: ServiceError|null, responseMessage: task_pb.TaskStatusList|null) => void
  ): UnaryResponse;
  getTaskPriorityList(
    requestMessage: task_pb.TaskPriority,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: task_pb.TaskPriorityList|null) => void
  ): UnaryResponse;
  getTaskPriorityList(
    requestMessage: task_pb.TaskPriority,
    callback: (error: ServiceError|null, responseMessage: task_pb.TaskPriorityList|null) => void
  ): UnaryResponse;
  getTaskBillableTypeList(
    requestMessage: common_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: common_pb.StringList|null) => void
  ): UnaryResponse;
  getTaskBillableTypeList(
    requestMessage: common_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: common_pb.StringList|null) => void
  ): UnaryResponse;
}

