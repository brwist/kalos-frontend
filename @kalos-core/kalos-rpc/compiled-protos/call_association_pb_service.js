// package: 
// file: call_association.proto

var call_association_pb = require("./call_association_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var CallAssociationService = (function () {
  function CallAssociationService() {}
  CallAssociationService.serviceName = "CallAssociationService";
  return CallAssociationService;
}());

CallAssociationService.Create = {
  methodName: "Create",
  service: CallAssociationService,
  requestStream: false,
  responseStream: false,
  requestType: call_association_pb.CallAssociation,
  responseType: call_association_pb.CallAssociation
};

CallAssociationService.Get = {
  methodName: "Get",
  service: CallAssociationService,
  requestStream: false,
  responseStream: false,
  requestType: call_association_pb.CallAssociation,
  responseType: call_association_pb.CallAssociation
};

CallAssociationService.BatchGet = {
  methodName: "BatchGet",
  service: CallAssociationService,
  requestStream: false,
  responseStream: false,
  requestType: call_association_pb.CallAssociation,
  responseType: call_association_pb.CallAssociationList
};

CallAssociationService.List = {
  methodName: "List",
  service: CallAssociationService,
  requestStream: false,
  responseStream: true,
  requestType: call_association_pb.CallAssociation,
  responseType: call_association_pb.CallAssociation
};

CallAssociationService.Update = {
  methodName: "Update",
  service: CallAssociationService,
  requestStream: false,
  responseStream: false,
  requestType: call_association_pb.CallAssociation,
  responseType: call_association_pb.CallAssociation
};

CallAssociationService.Delete = {
  methodName: "Delete",
  service: CallAssociationService,
  requestStream: false,
  responseStream: false,
  requestType: call_association_pb.CallAssociation,
  responseType: call_association_pb.CallAssociation
};

exports.CallAssociationService = CallAssociationService;

function CallAssociationServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

CallAssociationServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(CallAssociationService.Create, {
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

CallAssociationServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(CallAssociationService.Get, {
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

CallAssociationServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(CallAssociationService.BatchGet, {
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

CallAssociationServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(CallAssociationService.List, {
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

CallAssociationServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(CallAssociationService.Update, {
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

CallAssociationServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(CallAssociationService.Delete, {
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

exports.CallAssociationServiceClient = CallAssociationServiceClient;

