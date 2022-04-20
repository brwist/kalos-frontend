// package: 
// file: employee_function.proto

var employee_function_pb = require("./employee_function_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var EmployeeFunctionService = (function () {
  function EmployeeFunctionService() {}
  EmployeeFunctionService.serviceName = "EmployeeFunctionService";
  return EmployeeFunctionService;
}());

EmployeeFunctionService.Create = {
  methodName: "Create",
  service: EmployeeFunctionService,
  requestStream: false,
  responseStream: false,
  requestType: employee_function_pb.EmployeeFunction,
  responseType: employee_function_pb.EmployeeFunction
};

EmployeeFunctionService.Get = {
  methodName: "Get",
  service: EmployeeFunctionService,
  requestStream: false,
  responseStream: false,
  requestType: employee_function_pb.EmployeeFunction,
  responseType: employee_function_pb.EmployeeFunction
};

EmployeeFunctionService.BatchGet = {
  methodName: "BatchGet",
  service: EmployeeFunctionService,
  requestStream: false,
  responseStream: false,
  requestType: employee_function_pb.EmployeeFunction,
  responseType: employee_function_pb.EmployeeFunctionList
};

EmployeeFunctionService.List = {
  methodName: "List",
  service: EmployeeFunctionService,
  requestStream: false,
  responseStream: true,
  requestType: employee_function_pb.EmployeeFunction,
  responseType: employee_function_pb.EmployeeFunction
};

EmployeeFunctionService.Update = {
  methodName: "Update",
  service: EmployeeFunctionService,
  requestStream: false,
  responseStream: false,
  requestType: employee_function_pb.EmployeeFunction,
  responseType: employee_function_pb.EmployeeFunction
};

EmployeeFunctionService.Delete = {
  methodName: "Delete",
  service: EmployeeFunctionService,
  requestStream: false,
  responseStream: false,
  requestType: employee_function_pb.EmployeeFunction,
  responseType: employee_function_pb.EmployeeFunction
};

exports.EmployeeFunctionService = EmployeeFunctionService;

function EmployeeFunctionServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

EmployeeFunctionServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EmployeeFunctionService.Create, {
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

EmployeeFunctionServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EmployeeFunctionService.Get, {
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

EmployeeFunctionServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EmployeeFunctionService.BatchGet, {
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

EmployeeFunctionServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(EmployeeFunctionService.List, {
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

EmployeeFunctionServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EmployeeFunctionService.Update, {
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

EmployeeFunctionServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EmployeeFunctionService.Delete, {
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

exports.EmployeeFunctionServiceClient = EmployeeFunctionServiceClient;

