// package: 
// file: service_reading_line.proto

var service_reading_line_pb = require("./service_reading_line_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var ServiceReadingLineService = (function () {
  function ServiceReadingLineService() {}
  ServiceReadingLineService.serviceName = "ServiceReadingLineService";
  return ServiceReadingLineService;
}());

ServiceReadingLineService.Create = {
  methodName: "Create",
  service: ServiceReadingLineService,
  requestStream: false,
  responseStream: false,
  requestType: service_reading_line_pb.ServiceReadingLine,
  responseType: service_reading_line_pb.ServiceReadingLine
};

ServiceReadingLineService.Get = {
  methodName: "Get",
  service: ServiceReadingLineService,
  requestStream: false,
  responseStream: false,
  requestType: service_reading_line_pb.ServiceReadingLine,
  responseType: service_reading_line_pb.ServiceReadingLine
};

ServiceReadingLineService.BatchGet = {
  methodName: "BatchGet",
  service: ServiceReadingLineService,
  requestStream: false,
  responseStream: false,
  requestType: service_reading_line_pb.ServiceReadingLine,
  responseType: service_reading_line_pb.ServiceReadingLineList
};

ServiceReadingLineService.List = {
  methodName: "List",
  service: ServiceReadingLineService,
  requestStream: false,
  responseStream: true,
  requestType: service_reading_line_pb.ServiceReadingLine,
  responseType: service_reading_line_pb.ServiceReadingLine
};

ServiceReadingLineService.Update = {
  methodName: "Update",
  service: ServiceReadingLineService,
  requestStream: false,
  responseStream: false,
  requestType: service_reading_line_pb.ServiceReadingLine,
  responseType: service_reading_line_pb.ServiceReadingLine
};

ServiceReadingLineService.Delete = {
  methodName: "Delete",
  service: ServiceReadingLineService,
  requestStream: false,
  responseStream: false,
  requestType: service_reading_line_pb.ServiceReadingLine,
  responseType: service_reading_line_pb.ServiceReadingLine
};

exports.ServiceReadingLineService = ServiceReadingLineService;

function ServiceReadingLineServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

ServiceReadingLineServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServiceReadingLineService.Create, {
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

ServiceReadingLineServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServiceReadingLineService.Get, {
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

ServiceReadingLineServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServiceReadingLineService.BatchGet, {
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

ServiceReadingLineServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(ServiceReadingLineService.List, {
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

ServiceReadingLineServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServiceReadingLineService.Update, {
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

ServiceReadingLineServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServiceReadingLineService.Delete, {
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

exports.ServiceReadingLineServiceClient = ServiceReadingLineServiceClient;

