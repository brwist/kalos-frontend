// package: 
// file: service_item_image.proto

var service_item_image_pb = require("./service_item_image_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var ServiceItemImageService = (function () {
  function ServiceItemImageService() {}
  ServiceItemImageService.serviceName = "ServiceItemImageService";
  return ServiceItemImageService;
}());

ServiceItemImageService.Create = {
  methodName: "Create",
  service: ServiceItemImageService,
  requestStream: false,
  responseStream: false,
  requestType: service_item_image_pb.ServiceItemImage,
  responseType: service_item_image_pb.ServiceItemImage
};

ServiceItemImageService.Get = {
  methodName: "Get",
  service: ServiceItemImageService,
  requestStream: false,
  responseStream: false,
  requestType: service_item_image_pb.ServiceItemImage,
  responseType: service_item_image_pb.ServiceItemImage
};

ServiceItemImageService.BatchGet = {
  methodName: "BatchGet",
  service: ServiceItemImageService,
  requestStream: false,
  responseStream: false,
  requestType: service_item_image_pb.ServiceItemImage,
  responseType: service_item_image_pb.ServiceItemImageList
};

ServiceItemImageService.List = {
  methodName: "List",
  service: ServiceItemImageService,
  requestStream: false,
  responseStream: true,
  requestType: service_item_image_pb.ServiceItemImage,
  responseType: service_item_image_pb.ServiceItemImage
};

ServiceItemImageService.Update = {
  methodName: "Update",
  service: ServiceItemImageService,
  requestStream: false,
  responseStream: false,
  requestType: service_item_image_pb.ServiceItemImage,
  responseType: service_item_image_pb.ServiceItemImage
};

ServiceItemImageService.Delete = {
  methodName: "Delete",
  service: ServiceItemImageService,
  requestStream: false,
  responseStream: false,
  requestType: service_item_image_pb.ServiceItemImage,
  responseType: service_item_image_pb.ServiceItemImage
};

exports.ServiceItemImageService = ServiceItemImageService;

function ServiceItemImageServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

ServiceItemImageServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServiceItemImageService.Create, {
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

ServiceItemImageServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServiceItemImageService.Get, {
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

ServiceItemImageServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServiceItemImageService.BatchGet, {
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

ServiceItemImageServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(ServiceItemImageService.List, {
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

ServiceItemImageServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServiceItemImageService.Update, {
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

ServiceItemImageServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServiceItemImageService.Delete, {
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

exports.ServiceItemImageServiceClient = ServiceItemImageServiceClient;

