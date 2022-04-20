// package: 
// file: task.proto

var task_pb = require("./task_pb");
var common_pb = require("./common_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var TaskService = (function () {
  function TaskService() {}
  TaskService.serviceName = "TaskService";
  return TaskService;
}());

TaskService.Create = {
  methodName: "Create",
  service: TaskService,
  requestStream: false,
  responseStream: false,
  requestType: task_pb.Task,
  responseType: task_pb.Task
};

TaskService.CreateProjectTask = {
  methodName: "CreateProjectTask",
  service: TaskService,
  requestStream: false,
  responseStream: false,
  requestType: task_pb.ProjectTask,
  responseType: task_pb.ProjectTask
};

TaskService.Get = {
  methodName: "Get",
  service: TaskService,
  requestStream: false,
  responseStream: false,
  requestType: task_pb.Task,
  responseType: task_pb.Task
};

TaskService.GetProjectTask = {
  methodName: "GetProjectTask",
  service: TaskService,
  requestStream: false,
  responseStream: false,
  requestType: task_pb.ProjectTask,
  responseType: task_pb.ProjectTask
};

TaskService.BatchGet = {
  methodName: "BatchGet",
  service: TaskService,
  requestStream: false,
  responseStream: false,
  requestType: task_pb.Task,
  responseType: task_pb.TaskList
};

TaskService.BatchGetProjectTasks = {
  methodName: "BatchGetProjectTasks",
  service: TaskService,
  requestStream: false,
  responseStream: false,
  requestType: task_pb.ProjectTask,
  responseType: task_pb.ProjectTaskList
};

TaskService.List = {
  methodName: "List",
  service: TaskService,
  requestStream: false,
  responseStream: true,
  requestType: task_pb.Task,
  responseType: task_pb.Task
};

TaskService.Update = {
  methodName: "Update",
  service: TaskService,
  requestStream: false,
  responseStream: false,
  requestType: task_pb.Task,
  responseType: task_pb.Task
};

TaskService.UpdateProjectTask = {
  methodName: "UpdateProjectTask",
  service: TaskService,
  requestStream: false,
  responseStream: false,
  requestType: task_pb.ProjectTask,
  responseType: task_pb.ProjectTask
};

TaskService.Delete = {
  methodName: "Delete",
  service: TaskService,
  requestStream: false,
  responseStream: false,
  requestType: task_pb.Task,
  responseType: task_pb.Task
};

TaskService.DeleteProjectTask = {
  methodName: "DeleteProjectTask",
  service: TaskService,
  requestStream: false,
  responseStream: false,
  requestType: task_pb.ProjectTask,
  responseType: task_pb.ProjectTask
};

TaskService.GetSpiffTypes = {
  methodName: "GetSpiffTypes",
  service: TaskService,
  requestStream: false,
  responseStream: false,
  requestType: task_pb.SpiffType,
  responseType: task_pb.SpiffTypeList
};

TaskService.GetToolFundBalanceByID = {
  methodName: "GetToolFundBalanceByID",
  service: TaskService,
  requestStream: false,
  responseStream: false,
  requestType: task_pb.ToolFund,
  responseType: task_pb.ToolFund
};

TaskService.GetAppliedSpiffs = {
  methodName: "GetAppliedSpiffs",
  service: TaskService,
  requestStream: false,
  responseStream: false,
  requestType: task_pb.Spiff,
  responseType: task_pb.SpiffList
};

TaskService.GetTaskStatusList = {
  methodName: "GetTaskStatusList",
  service: TaskService,
  requestStream: false,
  responseStream: false,
  requestType: task_pb.TaskStatus,
  responseType: task_pb.TaskStatusList
};

TaskService.GetTaskPriorityList = {
  methodName: "GetTaskPriorityList",
  service: TaskService,
  requestStream: false,
  responseStream: false,
  requestType: task_pb.TaskPriority,
  responseType: task_pb.TaskPriorityList
};

TaskService.GetTaskBillableTypeList = {
  methodName: "GetTaskBillableTypeList",
  service: TaskService,
  requestStream: false,
  responseStream: false,
  requestType: common_pb.Empty,
  responseType: common_pb.StringList
};

exports.TaskService = TaskService;

function TaskServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

TaskServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TaskService.Create, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TaskServiceClient.prototype.createProjectTask = function createProjectTask(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TaskService.CreateProjectTask, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TaskServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TaskService.Get, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TaskServiceClient.prototype.getProjectTask = function getProjectTask(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TaskService.GetProjectTask, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TaskServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TaskService.BatchGet, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TaskServiceClient.prototype.batchGetProjectTasks = function batchGetProjectTasks(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TaskService.BatchGetProjectTasks, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TaskServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(TaskService.List, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

TaskServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TaskService.Update, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TaskServiceClient.prototype.updateProjectTask = function updateProjectTask(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TaskService.UpdateProjectTask, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TaskServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TaskService.Delete, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TaskServiceClient.prototype.deleteProjectTask = function deleteProjectTask(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TaskService.DeleteProjectTask, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TaskServiceClient.prototype.getSpiffTypes = function getSpiffTypes(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TaskService.GetSpiffTypes, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TaskServiceClient.prototype.getToolFundBalanceByID = function getToolFundBalanceByID(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TaskService.GetToolFundBalanceByID, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TaskServiceClient.prototype.getAppliedSpiffs = function getAppliedSpiffs(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TaskService.GetAppliedSpiffs, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TaskServiceClient.prototype.getTaskStatusList = function getTaskStatusList(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TaskService.GetTaskStatusList, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TaskServiceClient.prototype.getTaskPriorityList = function getTaskPriorityList(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TaskService.GetTaskPriorityList, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TaskServiceClient.prototype.getTaskBillableTypeList = function getTaskBillableTypeList(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TaskService.GetTaskBillableTypeList, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.TaskServiceClient = TaskServiceClient;

