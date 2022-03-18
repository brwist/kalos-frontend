// package: 
// file: projects_activity_log.proto

var projects_activity_log_pb = require("./projects_activity_log_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var ProjectsActivityLogService = (function () {
  function ProjectsActivityLogService() {}
  ProjectsActivityLogService.serviceName = "ProjectsActivityLogService";
  return ProjectsActivityLogService;
}());

ProjectsActivityLogService.Create = {
  methodName: "Create",
  service: ProjectsActivityLogService,
  requestStream: false,
  responseStream: false,
  requestType: projects_activity_log_pb.ProjectsActivityLog,
  responseType: projects_activity_log_pb.ProjectsActivityLog
};

ProjectsActivityLogService.Get = {
  methodName: "Get",
  service: ProjectsActivityLogService,
  requestStream: false,
  responseStream: false,
  requestType: projects_activity_log_pb.ProjectsActivityLog,
  responseType: projects_activity_log_pb.ProjectsActivityLog
};

ProjectsActivityLogService.BatchGet = {
  methodName: "BatchGet",
  service: ProjectsActivityLogService,
  requestStream: false,
  responseStream: false,
  requestType: projects_activity_log_pb.ProjectsActivityLog,
  responseType: projects_activity_log_pb.ProjectsActivityLogList
};

ProjectsActivityLogService.List = {
  methodName: "List",
  service: ProjectsActivityLogService,
  requestStream: false,
  responseStream: true,
  requestType: projects_activity_log_pb.ProjectsActivityLog,
  responseType: projects_activity_log_pb.ProjectsActivityLog
};

ProjectsActivityLogService.Update = {
  methodName: "Update",
  service: ProjectsActivityLogService,
  requestStream: false,
  responseStream: false,
  requestType: projects_activity_log_pb.ProjectsActivityLog,
  responseType: projects_activity_log_pb.ProjectsActivityLog
};

ProjectsActivityLogService.Delete = {
  methodName: "Delete",
  service: ProjectsActivityLogService,
  requestStream: false,
  responseStream: false,
  requestType: projects_activity_log_pb.ProjectsActivityLog,
  responseType: projects_activity_log_pb.ProjectsActivityLog
};

exports.ProjectsActivityLogService = ProjectsActivityLogService;

function ProjectsActivityLogServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

ProjectsActivityLogServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ProjectsActivityLogService.Create, {
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

ProjectsActivityLogServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ProjectsActivityLogService.Get, {
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

ProjectsActivityLogServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ProjectsActivityLogService.BatchGet, {
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

ProjectsActivityLogServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(ProjectsActivityLogService.List, {
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

ProjectsActivityLogServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ProjectsActivityLogService.Update, {
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

ProjectsActivityLogServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ProjectsActivityLogService.Delete, {
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

exports.ProjectsActivityLogServiceClient = ProjectsActivityLogServiceClient;

