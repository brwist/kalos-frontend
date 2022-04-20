// package: 
// file: timesheet_department_group.proto

var timesheet_department_group_pb = require("./timesheet_department_group_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var TimesheetDepartmentGroupService = (function () {
  function TimesheetDepartmentGroupService() {}
  TimesheetDepartmentGroupService.serviceName = "TimesheetDepartmentGroupService";
  return TimesheetDepartmentGroupService;
}());

TimesheetDepartmentGroupService.Create = {
  methodName: "Create",
  service: TimesheetDepartmentGroupService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_department_group_pb.TimesheetDepartmentGroup,
  responseType: timesheet_department_group_pb.TimesheetDepartmentGroup
};

TimesheetDepartmentGroupService.Get = {
  methodName: "Get",
  service: TimesheetDepartmentGroupService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_department_group_pb.TimesheetDepartmentGroup,
  responseType: timesheet_department_group_pb.TimesheetDepartmentGroup
};

TimesheetDepartmentGroupService.BatchGet = {
  methodName: "BatchGet",
  service: TimesheetDepartmentGroupService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_department_group_pb.TimesheetDepartmentGroup,
  responseType: timesheet_department_group_pb.TimesheetDepartmentGroupList
};

TimesheetDepartmentGroupService.List = {
  methodName: "List",
  service: TimesheetDepartmentGroupService,
  requestStream: false,
  responseStream: true,
  requestType: timesheet_department_group_pb.TimesheetDepartmentGroup,
  responseType: timesheet_department_group_pb.TimesheetDepartmentGroup
};

TimesheetDepartmentGroupService.Update = {
  methodName: "Update",
  service: TimesheetDepartmentGroupService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_department_group_pb.TimesheetDepartmentGroup,
  responseType: timesheet_department_group_pb.TimesheetDepartmentGroup
};

TimesheetDepartmentGroupService.Delete = {
  methodName: "Delete",
  service: TimesheetDepartmentGroupService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_department_group_pb.TimesheetDepartmentGroup,
  responseType: timesheet_department_group_pb.TimesheetDepartmentGroup
};

exports.TimesheetDepartmentGroupService = TimesheetDepartmentGroupService;

function TimesheetDepartmentGroupServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

TimesheetDepartmentGroupServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetDepartmentGroupService.Create, {
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

TimesheetDepartmentGroupServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetDepartmentGroupService.Get, {
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

TimesheetDepartmentGroupServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetDepartmentGroupService.BatchGet, {
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

TimesheetDepartmentGroupServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(TimesheetDepartmentGroupService.List, {
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

TimesheetDepartmentGroupServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetDepartmentGroupService.Update, {
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

TimesheetDepartmentGroupServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetDepartmentGroupService.Delete, {
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

exports.TimesheetDepartmentGroupServiceClient = TimesheetDepartmentGroupServiceClient;

