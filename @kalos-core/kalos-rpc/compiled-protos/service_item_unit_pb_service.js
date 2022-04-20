// package: 
// file: service_item_unit.proto

var service_item_unit_pb = require("./service_item_unit_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var ServiceItemUnitService = (function () {
  function ServiceItemUnitService() {}
  ServiceItemUnitService.serviceName = "ServiceItemUnitService";
  return ServiceItemUnitService;
}());

ServiceItemUnitService.Create = {
  methodName: "Create",
  service: ServiceItemUnitService,
  requestStream: false,
  responseStream: false,
  requestType: service_item_unit_pb.ServiceItemUnit,
  responseType: service_item_unit_pb.ServiceItemUnit
};

ServiceItemUnitService.Get = {
  methodName: "Get",
  service: ServiceItemUnitService,
  requestStream: false,
  responseStream: false,
  requestType: service_item_unit_pb.ServiceItemUnit,
  responseType: service_item_unit_pb.ServiceItemUnit
};

ServiceItemUnitService.BatchGet = {
  methodName: "BatchGet",
  service: ServiceItemUnitService,
  requestStream: false,
  responseStream: false,
  requestType: service_item_unit_pb.ServiceItemUnit,
  responseType: service_item_unit_pb.ServiceItemUnitList
};

ServiceItemUnitService.List = {
  methodName: "List",
  service: ServiceItemUnitService,
  requestStream: false,
  responseStream: true,
  requestType: service_item_unit_pb.ServiceItemUnit,
  responseType: service_item_unit_pb.ServiceItemUnit
};

ServiceItemUnitService.Update = {
  methodName: "Update",
  service: ServiceItemUnitService,
  requestStream: false,
  responseStream: false,
  requestType: service_item_unit_pb.ServiceItemUnit,
  responseType: service_item_unit_pb.ServiceItemUnit
};

ServiceItemUnitService.Delete = {
  methodName: "Delete",
  service: ServiceItemUnitService,
  requestStream: false,
  responseStream: false,
  requestType: service_item_unit_pb.ServiceItemUnit,
  responseType: service_item_unit_pb.ServiceItemUnit
};

exports.ServiceItemUnitService = ServiceItemUnitService;

function ServiceItemUnitServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

ServiceItemUnitServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServiceItemUnitService.Create, {
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

ServiceItemUnitServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServiceItemUnitService.Get, {
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

ServiceItemUnitServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServiceItemUnitService.BatchGet, {
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

ServiceItemUnitServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(ServiceItemUnitService.List, {
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

ServiceItemUnitServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServiceItemUnitService.Update, {
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

ServiceItemUnitServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServiceItemUnitService.Delete, {
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

exports.ServiceItemUnitServiceClient = ServiceItemUnitServiceClient;

