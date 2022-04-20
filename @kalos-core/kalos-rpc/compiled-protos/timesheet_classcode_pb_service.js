// package: 
// file: timesheet_classcode.proto

var timesheet_classcode_pb = require("./timesheet_classcode_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var TimesheetClassCodeService = (function () {
  function TimesheetClassCodeService() {}
  TimesheetClassCodeService.serviceName = "TimesheetClassCodeService";
  return TimesheetClassCodeService;
}());

TimesheetClassCodeService.Create = {
  methodName: "Create",
  service: TimesheetClassCodeService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_classcode_pb.TimesheetClassCode,
  responseType: timesheet_classcode_pb.TimesheetClassCode
};

TimesheetClassCodeService.Get = {
  methodName: "Get",
  service: TimesheetClassCodeService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_classcode_pb.TimesheetClassCode,
  responseType: timesheet_classcode_pb.TimesheetClassCode
};

TimesheetClassCodeService.BatchGet = {
  methodName: "BatchGet",
  service: TimesheetClassCodeService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_classcode_pb.TimesheetClassCode,
  responseType: timesheet_classcode_pb.TimesheetClassCodeList
};

TimesheetClassCodeService.List = {
  methodName: "List",
  service: TimesheetClassCodeService,
  requestStream: false,
  responseStream: true,
  requestType: timesheet_classcode_pb.TimesheetClassCode,
  responseType: timesheet_classcode_pb.TimesheetClassCode
};

TimesheetClassCodeService.Update = {
  methodName: "Update",
  service: TimesheetClassCodeService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_classcode_pb.TimesheetClassCode,
  responseType: timesheet_classcode_pb.TimesheetClassCode
};

TimesheetClassCodeService.Delete = {
  methodName: "Delete",
  service: TimesheetClassCodeService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_classcode_pb.TimesheetClassCode,
  responseType: timesheet_classcode_pb.TimesheetClassCode
};

exports.TimesheetClassCodeService = TimesheetClassCodeService;

function TimesheetClassCodeServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

TimesheetClassCodeServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetClassCodeService.Create, {
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

TimesheetClassCodeServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetClassCodeService.Get, {
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

TimesheetClassCodeServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetClassCodeService.BatchGet, {
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

TimesheetClassCodeServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(TimesheetClassCodeService.List, {
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

TimesheetClassCodeServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetClassCodeService.Update, {
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

TimesheetClassCodeServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetClassCodeService.Delete, {
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

exports.TimesheetClassCodeServiceClient = TimesheetClassCodeServiceClient;

