// package: 
// file: remote_identity.proto

var remote_identity_pb = require("./remote_identity_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var RemoteIdentityService = (function () {
  function RemoteIdentityService() {}
  RemoteIdentityService.serviceName = "RemoteIdentityService";
  return RemoteIdentityService;
}());

RemoteIdentityService.Create = {
  methodName: "Create",
  service: RemoteIdentityService,
  requestStream: false,
  responseStream: false,
  requestType: remote_identity_pb.RemoteIdentity,
  responseType: remote_identity_pb.RemoteIdentity
};

RemoteIdentityService.Get = {
  methodName: "Get",
  service: RemoteIdentityService,
  requestStream: false,
  responseStream: false,
  requestType: remote_identity_pb.RemoteIdentity,
  responseType: remote_identity_pb.RemoteIdentity
};

RemoteIdentityService.BatchGet = {
  methodName: "BatchGet",
  service: RemoteIdentityService,
  requestStream: false,
  responseStream: false,
  requestType: remote_identity_pb.RemoteIdentity,
  responseType: remote_identity_pb.RemoteIdentityList
};

RemoteIdentityService.List = {
  methodName: "List",
  service: RemoteIdentityService,
  requestStream: false,
  responseStream: true,
  requestType: remote_identity_pb.RemoteIdentity,
  responseType: remote_identity_pb.RemoteIdentity
};

RemoteIdentityService.Update = {
  methodName: "Update",
  service: RemoteIdentityService,
  requestStream: false,
  responseStream: false,
  requestType: remote_identity_pb.RemoteIdentity,
  responseType: remote_identity_pb.RemoteIdentity
};

RemoteIdentityService.Delete = {
  methodName: "Delete",
  service: RemoteIdentityService,
  requestStream: false,
  responseStream: false,
  requestType: remote_identity_pb.RemoteIdentity,
  responseType: remote_identity_pb.RemoteIdentity
};

exports.RemoteIdentityService = RemoteIdentityService;

function RemoteIdentityServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

RemoteIdentityServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(RemoteIdentityService.Create, {
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

RemoteIdentityServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(RemoteIdentityService.Get, {
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

RemoteIdentityServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(RemoteIdentityService.BatchGet, {
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

RemoteIdentityServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(RemoteIdentityService.List, {
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

RemoteIdentityServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(RemoteIdentityService.Update, {
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

RemoteIdentityServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(RemoteIdentityService.Delete, {
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

exports.RemoteIdentityServiceClient = RemoteIdentityServiceClient;

