// package: 
// file: activity_log.proto

var activity_log_pb = require("./activity_log_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var ActivityLogService = (function () {
  function ActivityLogService() {}
  ActivityLogService.serviceName = "ActivityLogService";
  return ActivityLogService;
}());

ActivityLogService.Create = {
  methodName: "Create",
  service: ActivityLogService,
  requestStream: false,
  responseStream: false,
  requestType: activity_log_pb.ActivityLog,
  responseType: activity_log_pb.ActivityLog
};

ActivityLogService.Get = {
  methodName: "Get",
  service: ActivityLogService,
  requestStream: false,
  responseStream: false,
  requestType: activity_log_pb.ActivityLog,
  responseType: activity_log_pb.ActivityLog
};

ActivityLogService.BatchGet = {
  methodName: "BatchGet",
  service: ActivityLogService,
  requestStream: false,
  responseStream: false,
  requestType: activity_log_pb.ActivityLog,
  responseType: activity_log_pb.ActivityLogList
};

ActivityLogService.BatchGetEventLogs = {
  methodName: "BatchGetEventLogs",
  service: ActivityLogService,
  requestStream: false,
  responseStream: false,
  requestType: activity_log_pb.ActivityLog,
  responseType: activity_log_pb.ActivityLogList
};

ActivityLogService.List = {
  methodName: "List",
  service: ActivityLogService,
  requestStream: false,
  responseStream: true,
  requestType: activity_log_pb.ActivityLog,
  responseType: activity_log_pb.ActivityLog
};

ActivityLogService.Update = {
  methodName: "Update",
  service: ActivityLogService,
  requestStream: false,
  responseStream: false,
  requestType: activity_log_pb.ActivityLog,
  responseType: activity_log_pb.ActivityLog
};

ActivityLogService.Delete = {
  methodName: "Delete",
  service: ActivityLogService,
  requestStream: false,
  responseStream: false,
  requestType: activity_log_pb.ActivityLog,
  responseType: activity_log_pb.ActivityLog
};

exports.ActivityLogService = ActivityLogService;

function ActivityLogServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

ActivityLogServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ActivityLogService.Create, {
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

ActivityLogServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ActivityLogService.Get, {
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

ActivityLogServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ActivityLogService.BatchGet, {
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

ActivityLogServiceClient.prototype.batchGetEventLogs = function batchGetEventLogs(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ActivityLogService.BatchGetEventLogs, {
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

ActivityLogServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(ActivityLogService.List, {
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

ActivityLogServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ActivityLogService.Update, {
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

ActivityLogServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ActivityLogService.Delete, {
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

exports.ActivityLogServiceClient = ActivityLogServiceClient;

