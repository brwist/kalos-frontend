// package: 
// file: event_deletion.proto

var event_deletion_pb = require("./event_deletion_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var EventDeletionService = (function () {
  function EventDeletionService() {}
  EventDeletionService.serviceName = "EventDeletionService";
  return EventDeletionService;
}());

EventDeletionService.Create = {
  methodName: "Create",
  service: EventDeletionService,
  requestStream: false,
  responseStream: false,
  requestType: event_deletion_pb.EventDeletion,
  responseType: event_deletion_pb.EventDeletion
};

EventDeletionService.Get = {
  methodName: "Get",
  service: EventDeletionService,
  requestStream: false,
  responseStream: false,
  requestType: event_deletion_pb.EventDeletion,
  responseType: event_deletion_pb.EventDeletion
};

EventDeletionService.BatchGet = {
  methodName: "BatchGet",
  service: EventDeletionService,
  requestStream: false,
  responseStream: false,
  requestType: event_deletion_pb.EventDeletion,
  responseType: event_deletion_pb.EventDeletionList
};

EventDeletionService.List = {
  methodName: "List",
  service: EventDeletionService,
  requestStream: false,
  responseStream: true,
  requestType: event_deletion_pb.EventDeletion,
  responseType: event_deletion_pb.EventDeletion
};

EventDeletionService.Update = {
  methodName: "Update",
  service: EventDeletionService,
  requestStream: false,
  responseStream: false,
  requestType: event_deletion_pb.EventDeletion,
  responseType: event_deletion_pb.EventDeletion
};

EventDeletionService.Delete = {
  methodName: "Delete",
  service: EventDeletionService,
  requestStream: false,
  responseStream: false,
  requestType: event_deletion_pb.EventDeletion,
  responseType: event_deletion_pb.EventDeletion
};

exports.EventDeletionService = EventDeletionService;

function EventDeletionServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

EventDeletionServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EventDeletionService.Create, {
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

EventDeletionServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EventDeletionService.Get, {
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

EventDeletionServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EventDeletionService.BatchGet, {
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

EventDeletionServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(EventDeletionService.List, {
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

EventDeletionServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EventDeletionService.Update, {
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

EventDeletionServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EventDeletionService.Delete, {
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

exports.EventDeletionServiceClient = EventDeletionServiceClient;

