// package: 
// file: timesheet_department.proto

var timesheet_department_pb = require("./timesheet_department_pb");
var common_pb = require("./common_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var TimesheetDepartmentService = (function () {
  function TimesheetDepartmentService() {}
  TimesheetDepartmentService.serviceName = "TimesheetDepartmentService";
  return TimesheetDepartmentService;
}());

TimesheetDepartmentService.Create = {
  methodName: "Create",
  service: TimesheetDepartmentService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_department_pb.TimesheetDepartment,
  responseType: timesheet_department_pb.TimesheetDepartment
};

TimesheetDepartmentService.Get = {
  methodName: "Get",
  service: TimesheetDepartmentService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_department_pb.TimesheetDepartment,
  responseType: timesheet_department_pb.TimesheetDepartment
};

TimesheetDepartmentService.BatchGet = {
  methodName: "BatchGet",
  service: TimesheetDepartmentService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_department_pb.TimesheetDepartment,
  responseType: timesheet_department_pb.TimesheetDepartmentList
};

TimesheetDepartmentService.List = {
  methodName: "List",
  service: TimesheetDepartmentService,
  requestStream: false,
  responseStream: true,
  requestType: timesheet_department_pb.TimesheetDepartment,
  responseType: timesheet_department_pb.TimesheetDepartment
};

TimesheetDepartmentService.Update = {
  methodName: "Update",
  service: TimesheetDepartmentService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_department_pb.TimesheetDepartment,
  responseType: timesheet_department_pb.TimesheetDepartment
};

TimesheetDepartmentService.Delete = {
  methodName: "Delete",
  service: TimesheetDepartmentService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_department_pb.TimesheetDepartment,
  responseType: timesheet_department_pb.TimesheetDepartment
};

TimesheetDepartmentService.BatchGetDepartmentsByIds = {
  methodName: "BatchGetDepartmentsByIds",
  service: TimesheetDepartmentService,
  requestStream: false,
  responseStream: false,
  requestType: common_pb.IntArray,
  responseType: timesheet_department_pb.TimesheetDepartmentList
};

exports.TimesheetDepartmentService = TimesheetDepartmentService;

function TimesheetDepartmentServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

TimesheetDepartmentServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetDepartmentService.Create, {
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

TimesheetDepartmentServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetDepartmentService.Get, {
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

TimesheetDepartmentServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetDepartmentService.BatchGet, {
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

TimesheetDepartmentServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(TimesheetDepartmentService.List, {
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

TimesheetDepartmentServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetDepartmentService.Update, {
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

TimesheetDepartmentServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetDepartmentService.Delete, {
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

TimesheetDepartmentServiceClient.prototype.batchGetDepartmentsByIds = function batchGetDepartmentsByIds(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetDepartmentService.BatchGetDepartmentsByIds, {
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

exports.TimesheetDepartmentServiceClient = TimesheetDepartmentServiceClient;

