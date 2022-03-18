// package: 
// file: phone_call_log.proto

var phone_call_log_pb = require("./phone_call_log_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var PhoneCallLogService = (function () {
  function PhoneCallLogService() {}
  PhoneCallLogService.serviceName = "PhoneCallLogService";
  return PhoneCallLogService;
}());

PhoneCallLogService.Create = {
  methodName: "Create",
  service: PhoneCallLogService,
  requestStream: false,
  responseStream: false,
  requestType: phone_call_log_pb.PhoneCallLog,
  responseType: phone_call_log_pb.PhoneCallLog
};

PhoneCallLogService.Get = {
  methodName: "Get",
  service: PhoneCallLogService,
  requestStream: false,
  responseStream: false,
  requestType: phone_call_log_pb.PhoneCallLog,
  responseType: phone_call_log_pb.PhoneCallLog
};

PhoneCallLogService.BatchGet = {
  methodName: "BatchGet",
  service: PhoneCallLogService,
  requestStream: false,
  responseStream: false,
  requestType: phone_call_log_pb.PhoneCallLog,
  responseType: phone_call_log_pb.PhoneCallLogList
};

PhoneCallLogService.List = {
  methodName: "List",
  service: PhoneCallLogService,
  requestStream: false,
  responseStream: true,
  requestType: phone_call_log_pb.PhoneCallLog,
  responseType: phone_call_log_pb.PhoneCallLog
};

PhoneCallLogService.Update = {
  methodName: "Update",
  service: PhoneCallLogService,
  requestStream: false,
  responseStream: false,
  requestType: phone_call_log_pb.PhoneCallLog,
  responseType: phone_call_log_pb.PhoneCallLog
};

PhoneCallLogService.Delete = {
  methodName: "Delete",
  service: PhoneCallLogService,
  requestStream: false,
  responseStream: false,
  requestType: phone_call_log_pb.PhoneCallLog,
  responseType: phone_call_log_pb.PhoneCallLog
};

exports.PhoneCallLogService = PhoneCallLogService;

function PhoneCallLogServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

PhoneCallLogServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PhoneCallLogService.Create, {
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

PhoneCallLogServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PhoneCallLogService.Get, {
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

PhoneCallLogServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PhoneCallLogService.BatchGet, {
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

PhoneCallLogServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(PhoneCallLogService.List, {
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

PhoneCallLogServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PhoneCallLogService.Update, {
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

PhoneCallLogServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PhoneCallLogService.Delete, {
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

exports.PhoneCallLogServiceClient = PhoneCallLogServiceClient;

