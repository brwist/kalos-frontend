// package: 
// file: system_readings_type.proto

var system_readings_type_pb = require("./system_readings_type_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var SystemReadingsTypeService = (function () {
  function SystemReadingsTypeService() {}
  SystemReadingsTypeService.serviceName = "SystemReadingsTypeService";
  return SystemReadingsTypeService;
}());

SystemReadingsTypeService.Create = {
  methodName: "Create",
  service: SystemReadingsTypeService,
  requestStream: false,
  responseStream: false,
  requestType: system_readings_type_pb.SystemReadingsType,
  responseType: system_readings_type_pb.SystemReadingsType
};

SystemReadingsTypeService.Get = {
  methodName: "Get",
  service: SystemReadingsTypeService,
  requestStream: false,
  responseStream: false,
  requestType: system_readings_type_pb.SystemReadingsType,
  responseType: system_readings_type_pb.SystemReadingsType
};

SystemReadingsTypeService.BatchGet = {
  methodName: "BatchGet",
  service: SystemReadingsTypeService,
  requestStream: false,
  responseStream: false,
  requestType: system_readings_type_pb.SystemReadingsType,
  responseType: system_readings_type_pb.SystemReadingsTypeList
};

SystemReadingsTypeService.List = {
  methodName: "List",
  service: SystemReadingsTypeService,
  requestStream: false,
  responseStream: true,
  requestType: system_readings_type_pb.SystemReadingsType,
  responseType: system_readings_type_pb.SystemReadingsType
};

SystemReadingsTypeService.Update = {
  methodName: "Update",
  service: SystemReadingsTypeService,
  requestStream: false,
  responseStream: false,
  requestType: system_readings_type_pb.SystemReadingsType,
  responseType: system_readings_type_pb.SystemReadingsType
};

SystemReadingsTypeService.Delete = {
  methodName: "Delete",
  service: SystemReadingsTypeService,
  requestStream: false,
  responseStream: false,
  requestType: system_readings_type_pb.SystemReadingsType,
  responseType: system_readings_type_pb.SystemReadingsType
};

exports.SystemReadingsTypeService = SystemReadingsTypeService;

function SystemReadingsTypeServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

SystemReadingsTypeServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SystemReadingsTypeService.Create, {
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

SystemReadingsTypeServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SystemReadingsTypeService.Get, {
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

SystemReadingsTypeServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SystemReadingsTypeService.BatchGet, {
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

SystemReadingsTypeServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(SystemReadingsTypeService.List, {
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

SystemReadingsTypeServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SystemReadingsTypeService.Update, {
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

SystemReadingsTypeServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SystemReadingsTypeService.Delete, {
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

exports.SystemReadingsTypeServiceClient = SystemReadingsTypeServiceClient;

