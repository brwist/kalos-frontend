// package: 
// file: services_rendered.proto

var services_rendered_pb = require("./services_rendered_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var ServicesRenderedService = (function () {
  function ServicesRenderedService() {}
  ServicesRenderedService.serviceName = "ServicesRenderedService";
  return ServicesRenderedService;
}());

ServicesRenderedService.Create = {
  methodName: "Create",
  service: ServicesRenderedService,
  requestStream: false,
  responseStream: false,
  requestType: services_rendered_pb.ServicesRendered,
  responseType: services_rendered_pb.ServicesRendered
};

ServicesRenderedService.Get = {
  methodName: "Get",
  service: ServicesRenderedService,
  requestStream: false,
  responseStream: false,
  requestType: services_rendered_pb.ServicesRendered,
  responseType: services_rendered_pb.ServicesRendered
};

ServicesRenderedService.BatchGet = {
  methodName: "BatchGet",
  service: ServicesRenderedService,
  requestStream: false,
  responseStream: false,
  requestType: services_rendered_pb.ServicesRendered,
  responseType: services_rendered_pb.ServicesRenderedList
};

ServicesRenderedService.List = {
  methodName: "List",
  service: ServicesRenderedService,
  requestStream: false,
  responseStream: true,
  requestType: services_rendered_pb.ServicesRendered,
  responseType: services_rendered_pb.ServicesRendered
};

ServicesRenderedService.Update = {
  methodName: "Update",
  service: ServicesRenderedService,
  requestStream: false,
  responseStream: false,
  requestType: services_rendered_pb.ServicesRendered,
  responseType: services_rendered_pb.ServicesRendered
};

ServicesRenderedService.Delete = {
  methodName: "Delete",
  service: ServicesRenderedService,
  requestStream: false,
  responseStream: false,
  requestType: services_rendered_pb.ServicesRendered,
  responseType: services_rendered_pb.ServicesRendered
};

exports.ServicesRenderedService = ServicesRenderedService;

function ServicesRenderedServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

ServicesRenderedServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServicesRenderedService.Create, {
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

ServicesRenderedServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServicesRenderedService.Get, {
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

ServicesRenderedServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServicesRenderedService.BatchGet, {
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

ServicesRenderedServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(ServicesRenderedService.List, {
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

ServicesRenderedServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServicesRenderedService.Update, {
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

ServicesRenderedServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ServicesRenderedService.Delete, {
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

exports.ServicesRenderedServiceClient = ServicesRenderedServiceClient;

