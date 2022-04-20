// package: 
// file: task_assignment.proto

var task_assignment_pb = require("./task_assignment_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var TaskAssignmentService = (function () {
  function TaskAssignmentService() {}
  TaskAssignmentService.serviceName = "TaskAssignmentService";
  return TaskAssignmentService;
}());

TaskAssignmentService.Create = {
  methodName: "Create",
  service: TaskAssignmentService,
  requestStream: false,
  responseStream: false,
  requestType: task_assignment_pb.TaskAssignment,
  responseType: task_assignment_pb.TaskAssignment
};

TaskAssignmentService.Get = {
  methodName: "Get",
  service: TaskAssignmentService,
  requestStream: false,
  responseStream: false,
  requestType: task_assignment_pb.TaskAssignment,
  responseType: task_assignment_pb.TaskAssignment
};

TaskAssignmentService.BatchGet = {
  methodName: "BatchGet",
  service: TaskAssignmentService,
  requestStream: false,
  responseStream: false,
  requestType: task_assignment_pb.TaskAssignment,
  responseType: task_assignment_pb.TaskAssignmentList
};

TaskAssignmentService.List = {
  methodName: "List",
  service: TaskAssignmentService,
  requestStream: false,
  responseStream: true,
  requestType: task_assignment_pb.TaskAssignment,
  responseType: task_assignment_pb.TaskAssignment
};

TaskAssignmentService.Update = {
  methodName: "Update",
  service: TaskAssignmentService,
  requestStream: false,
  responseStream: false,
  requestType: task_assignment_pb.TaskAssignment,
  responseType: task_assignment_pb.TaskAssignment
};

TaskAssignmentService.Delete = {
  methodName: "Delete",
  service: TaskAssignmentService,
  requestStream: false,
  responseStream: false,
  requestType: task_assignment_pb.TaskAssignment,
  responseType: task_assignment_pb.TaskAssignment
};

exports.TaskAssignmentService = TaskAssignmentService;

function TaskAssignmentServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

TaskAssignmentServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TaskAssignmentService.Create, {
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

TaskAssignmentServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TaskAssignmentService.Get, {
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

TaskAssignmentServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TaskAssignmentService.BatchGet, {
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

TaskAssignmentServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(TaskAssignmentService.List, {
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

TaskAssignmentServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TaskAssignmentService.Update, {
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

TaskAssignmentServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TaskAssignmentService.Delete, {
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

exports.TaskAssignmentServiceClient = TaskAssignmentServiceClient;

