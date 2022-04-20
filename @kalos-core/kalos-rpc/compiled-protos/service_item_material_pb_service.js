// package: 
// file: service_item_material.proto

var service_item_material_pb = require("./service_item_material_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var ServiceItemMaterialService = (function () {
  function ServiceItemMaterialService() {}
  ServiceItemMaterialService.serviceName = "ServiceItemMaterialService";
  return ServiceItemMaterialService;
}());

ServiceItemMaterialService.Create = {
  methodName: "Create",
  service: ServiceItemMaterialService,
  requestStream: false,
  responseStream: false,
  requestType: service_item_material_pb.ServiceItemMaterial,
  responseType: service_item_material_pb.ServiceItemMaterial
};

ServiceItemMaterialService.Get = {
  methodName: "Get",
  service: ServiceItemMaterialService,
  requestStream: false,
  responseStream: false,
  requestType: service_item_material_pb.ServiceItemMaterial,
  responseType: service_item_material_pb.ServiceItemMaterial
};

ServiceItemMaterialService.BatchGet = {
  methodName: "BatchGet",
  service: ServiceItemMaterialService,
  requestStream: false,
  responseStream: false,
  requestType: service_item_material_pb.ServiceItemMaterial,
  responseType: service_item_material_pb.ServiceItemMaterialList
};

ServiceItemMaterialService.List = {
  methodName: "List",
  service: ServiceItemMaterialService,
  requestStream: false,
  responseStream: true,
  requestType: service_item_material_pb.ServiceItemMaterial,
  responseType: service_item_material_pb.ServiceItemMaterial
};

ServiceItemMaterialService.Update = {
  methodName: "Update",
  service: ServiceItemMaterialService,
  requestStream: false,
  responseStream: false,
  requestType: service_item_material_pb.ServiceItemMaterial,
  responseType: service_item_material_pb.ServiceItemMaterial
};

ServiceItemMaterialService.Delete = {
  methodName: "Delete",
  service: ServiceItemMaterialService,
  requestStream: false,
  responseStream: false,
  requestType: service_item_material_pb.ServiceItemMaterial,
  responseType: service_item_material_pb.ServiceItemMaterial
};

exports.ServiceItemMaterialService = ServiceItemMaterialService;

function ServiceItemMaterialServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

ServiceItemMaterialServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServiceItemMaterialService.Create, {
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

ServiceItemMaterialServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServiceItemMaterialService.Get, {
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

ServiceItemMaterialServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServiceItemMaterialService.BatchGet, {
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

ServiceItemMaterialServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(ServiceItemMaterialService.List, {
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

ServiceItemMaterialServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServiceItemMaterialService.Update, {
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

ServiceItemMaterialServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServiceItemMaterialService.Delete, {
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

exports.ServiceItemMaterialServiceClient = ServiceItemMaterialServiceClient;

