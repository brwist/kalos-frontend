// package: 
// file: timesheet_line.proto

var timesheet_line_pb = require("./timesheet_line_pb");
var common_pb = require("./common_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var TimesheetLineService = (function () {
  function TimesheetLineService() {}
  TimesheetLineService.serviceName = "TimesheetLineService";
  return TimesheetLineService;
}());

TimesheetLineService.Create = {
  methodName: "Create",
  service: TimesheetLineService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_line_pb.TimesheetLine,
  responseType: timesheet_line_pb.TimesheetLine
};

TimesheetLineService.Get = {
  methodName: "Get",
  service: TimesheetLineService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_line_pb.TimesheetLine,
  responseType: timesheet_line_pb.TimesheetLine
};

TimesheetLineService.GetTimesheet = {
  methodName: "GetTimesheet",
  service: TimesheetLineService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_line_pb.TimesheetReq,
  responseType: timesheet_line_pb.Timesheet
};

TimesheetLineService.BatchGet = {
  methodName: "BatchGet",
  service: TimesheetLineService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_line_pb.TimesheetLine,
  responseType: timesheet_line_pb.TimesheetLineList
};

TimesheetLineService.BatchGetPayroll = {
  methodName: "BatchGetPayroll",
  service: TimesheetLineService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_line_pb.TimesheetLine,
  responseType: timesheet_line_pb.TimesheetLineList
};

TimesheetLineService.BatchGetManager = {
  methodName: "BatchGetManager",
  service: TimesheetLineService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_line_pb.TimesheetLine,
  responseType: timesheet_line_pb.TimesheetLineList
};

TimesheetLineService.List = {
  methodName: "List",
  service: TimesheetLineService,
  requestStream: false,
  responseStream: true,
  requestType: timesheet_line_pb.TimesheetLine,
  responseType: timesheet_line_pb.TimesheetLine
};

TimesheetLineService.Update = {
  methodName: "Update",
  service: TimesheetLineService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_line_pb.TimesheetLine,
  responseType: timesheet_line_pb.TimesheetLine
};

TimesheetLineService.Delete = {
  methodName: "Delete",
  service: TimesheetLineService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_line_pb.TimesheetLine,
  responseType: timesheet_line_pb.TimesheetLine
};

TimesheetLineService.Submit = {
  methodName: "Submit",
  service: TimesheetLineService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_line_pb.SubmitApproveReq,
  responseType: common_pb.Empty
};

TimesheetLineService.Approve = {
  methodName: "Approve",
  service: TimesheetLineService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_line_pb.SubmitApproveReq,
  responseType: common_pb.Empty
};

TimesheetLineService.Process = {
  methodName: "Process",
  service: TimesheetLineService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_line_pb.SubmitApproveReq,
  responseType: common_pb.Empty
};

TimesheetLineService.Reject = {
  methodName: "Reject",
  service: TimesheetLineService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_line_pb.SubmitApproveReq,
  responseType: common_pb.Empty
};

TimesheetLineService.Deny = {
  methodName: "Deny",
  service: TimesheetLineService,
  requestStream: false,
  responseStream: false,
  requestType: timesheet_line_pb.SubmitApproveReq,
  responseType: common_pb.Empty
};

TimesheetLineService.GetIDsForPayroll = {
  methodName: "GetIDsForPayroll",
  service: TimesheetLineService,
  requestStream: false,
  responseStream: false,
  requestType: common_pb.DateRange,
  responseType: common_pb.Int32List
};

TimesheetLineService.GetReferenceURL = {
  methodName: "GetReferenceURL",
  service: TimesheetLineService,
  requestStream: false,
  responseStream: false,
  requestType: common_pb.Int32,
  responseType: common_pb.String
};

exports.TimesheetLineService = TimesheetLineService;

function TimesheetLineServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

TimesheetLineServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetLineService.Create, {
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

TimesheetLineServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetLineService.Get, {
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

TimesheetLineServiceClient.prototype.getTimesheet = function getTimesheet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetLineService.GetTimesheet, {
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

TimesheetLineServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetLineService.BatchGet, {
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

TimesheetLineServiceClient.prototype.batchGetPayroll = function batchGetPayroll(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetLineService.BatchGetPayroll, {
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

TimesheetLineServiceClient.prototype.batchGetManager = function batchGetManager(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetLineService.BatchGetManager, {
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

TimesheetLineServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(TimesheetLineService.List, {
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

TimesheetLineServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetLineService.Update, {
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

TimesheetLineServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetLineService.Delete, {
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

TimesheetLineServiceClient.prototype.submit = function submit(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetLineService.Submit, {
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

TimesheetLineServiceClient.prototype.approve = function approve(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetLineService.Approve, {
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

TimesheetLineServiceClient.prototype.process = function process(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetLineService.Process, {
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

TimesheetLineServiceClient.prototype.reject = function reject(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetLineService.Reject, {
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

TimesheetLineServiceClient.prototype.deny = function deny(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetLineService.Deny, {
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

TimesheetLineServiceClient.prototype.getIDsForPayroll = function getIDsForPayroll(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetLineService.GetIDsForPayroll, {
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

TimesheetLineServiceClient.prototype.getReferenceURL = function getReferenceURL(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimesheetLineService.GetReferenceURL, {
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

exports.TimesheetLineServiceClient = TimesheetLineServiceClient;

