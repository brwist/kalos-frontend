// package: 
// file: timeoff_request.proto

var timeoff_request_pb = require("./timeoff_request_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var TimeoffRequestService = (function () {
  function TimeoffRequestService() {}
  TimeoffRequestService.serviceName = "TimeoffRequestService";
  return TimeoffRequestService;
}());

TimeoffRequestService.Create = {
  methodName: "Create",
  service: TimeoffRequestService,
  requestStream: false,
  responseStream: false,
  requestType: timeoff_request_pb.TimeoffRequest,
  responseType: timeoff_request_pb.TimeoffRequest
};

TimeoffRequestService.Get = {
  methodName: "Get",
  service: TimeoffRequestService,
  requestStream: false,
  responseStream: false,
  requestType: timeoff_request_pb.TimeoffRequest,
  responseType: timeoff_request_pb.TimeoffRequest
};

TimeoffRequestService.BatchGet = {
  methodName: "BatchGet",
  service: TimeoffRequestService,
  requestStream: false,
  responseStream: false,
  requestType: timeoff_request_pb.TimeoffRequest,
  responseType: timeoff_request_pb.TimeoffRequestList
};

TimeoffRequestService.List = {
  methodName: "List",
  service: TimeoffRequestService,
  requestStream: false,
  responseStream: true,
  requestType: timeoff_request_pb.TimeoffRequest,
  responseType: timeoff_request_pb.TimeoffRequest
};

TimeoffRequestService.Update = {
  methodName: "Update",
  service: TimeoffRequestService,
  requestStream: false,
  responseStream: false,
  requestType: timeoff_request_pb.TimeoffRequest,
  responseType: timeoff_request_pb.TimeoffRequest
};

TimeoffRequestService.Delete = {
  methodName: "Delete",
  service: TimeoffRequestService,
  requestStream: false,
  responseStream: false,
  requestType: timeoff_request_pb.TimeoffRequest,
  responseType: timeoff_request_pb.TimeoffRequest
};

TimeoffRequestService.PTOInquiry = {
  methodName: "PTOInquiry",
  service: TimeoffRequestService,
  requestStream: false,
  responseStream: false,
  requestType: timeoff_request_pb.PTO,
  responseType: timeoff_request_pb.PTO
};

TimeoffRequestService.GetTimeoffRequestTypes = {
  methodName: "GetTimeoffRequestTypes",
  service: TimeoffRequestService,
  requestStream: false,
  responseStream: false,
  requestType: timeoff_request_pb.TimeoffRequestType,
  responseType: timeoff_request_pb.TimeoffRequestTypeList
};

exports.TimeoffRequestService = TimeoffRequestService;

function TimeoffRequestServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

TimeoffRequestServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimeoffRequestService.Create, {
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

TimeoffRequestServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimeoffRequestService.Get, {
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

TimeoffRequestServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimeoffRequestService.BatchGet, {
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

TimeoffRequestServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(TimeoffRequestService.List, {
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

TimeoffRequestServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimeoffRequestService.Update, {
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

TimeoffRequestServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimeoffRequestService.Delete, {
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

TimeoffRequestServiceClient.prototype.pTOInquiry = function pTOInquiry(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimeoffRequestService.PTOInquiry, {
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

TimeoffRequestServiceClient.prototype.getTimeoffRequestTypes = function getTimeoffRequestTypes(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TimeoffRequestService.GetTimeoffRequestTypes, {
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

exports.TimeoffRequestServiceClient = TimeoffRequestServiceClient;

