// package: 
// file: event_assignment.proto

var event_assignment_pb = require("./event_assignment_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var EventAssignmentService = (function () {
  function EventAssignmentService() {}
  EventAssignmentService.serviceName = "EventAssignmentService";
  return EventAssignmentService;
}());

EventAssignmentService.Create = {
  methodName: "Create",
  service: EventAssignmentService,
  requestStream: false,
  responseStream: false,
  requestType: event_assignment_pb.EventAssignment,
  responseType: event_assignment_pb.EventAssignment
};

EventAssignmentService.Get = {
  methodName: "Get",
  service: EventAssignmentService,
  requestStream: false,
  responseStream: false,
  requestType: event_assignment_pb.EventAssignment,
  responseType: event_assignment_pb.EventAssignment
};

EventAssignmentService.BatchGet = {
  methodName: "BatchGet",
  service: EventAssignmentService,
  requestStream: false,
  responseStream: false,
  requestType: event_assignment_pb.EventAssignment,
  responseType: event_assignment_pb.EventAssignmentList
};

EventAssignmentService.List = {
  methodName: "List",
  service: EventAssignmentService,
  requestStream: false,
  responseStream: true,
  requestType: event_assignment_pb.EventAssignment,
  responseType: event_assignment_pb.EventAssignment
};

EventAssignmentService.Update = {
  methodName: "Update",
  service: EventAssignmentService,
  requestStream: false,
  responseStream: false,
  requestType: event_assignment_pb.EventAssignment,
  responseType: event_assignment_pb.EventAssignment
};

EventAssignmentService.Delete = {
  methodName: "Delete",
  service: EventAssignmentService,
  requestStream: false,
  responseStream: false,
  requestType: event_assignment_pb.EventAssignment,
  responseType: event_assignment_pb.EventAssignment
};

exports.EventAssignmentService = EventAssignmentService;

function EventAssignmentServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

EventAssignmentServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EventAssignmentService.Create, {
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

EventAssignmentServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EventAssignmentService.Get, {
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

EventAssignmentServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EventAssignmentService.BatchGet, {
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

EventAssignmentServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(EventAssignmentService.List, {
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

EventAssignmentServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EventAssignmentService.Update, {
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

EventAssignmentServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EventAssignmentService.Delete, {
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

exports.EventAssignmentServiceClient = EventAssignmentServiceClient;

