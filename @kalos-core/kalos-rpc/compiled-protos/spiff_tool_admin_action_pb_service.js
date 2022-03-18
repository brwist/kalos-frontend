// package: 
// file: spiff_tool_admin_action.proto

var spiff_tool_admin_action_pb = require("./spiff_tool_admin_action_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var SpiffToolAdminActionService = (function () {
  function SpiffToolAdminActionService() {}
  SpiffToolAdminActionService.serviceName = "SpiffToolAdminActionService";
  return SpiffToolAdminActionService;
}());

SpiffToolAdminActionService.Create = {
  methodName: "Create",
  service: SpiffToolAdminActionService,
  requestStream: false,
  responseStream: false,
  requestType: spiff_tool_admin_action_pb.SpiffToolAdminAction,
  responseType: spiff_tool_admin_action_pb.SpiffToolAdminAction
};

SpiffToolAdminActionService.Get = {
  methodName: "Get",
  service: SpiffToolAdminActionService,
  requestStream: false,
  responseStream: false,
  requestType: spiff_tool_admin_action_pb.SpiffToolAdminAction,
  responseType: spiff_tool_admin_action_pb.SpiffToolAdminAction
};

SpiffToolAdminActionService.BatchGet = {
  methodName: "BatchGet",
  service: SpiffToolAdminActionService,
  requestStream: false,
  responseStream: false,
  requestType: spiff_tool_admin_action_pb.SpiffToolAdminAction,
  responseType: spiff_tool_admin_action_pb.SpiffToolAdminActionList
};

SpiffToolAdminActionService.List = {
  methodName: "List",
  service: SpiffToolAdminActionService,
  requestStream: false,
  responseStream: true,
  requestType: spiff_tool_admin_action_pb.SpiffToolAdminAction,
  responseType: spiff_tool_admin_action_pb.SpiffToolAdminAction
};

SpiffToolAdminActionService.Update = {
  methodName: "Update",
  service: SpiffToolAdminActionService,
  requestStream: false,
  responseStream: false,
  requestType: spiff_tool_admin_action_pb.SpiffToolAdminAction,
  responseType: spiff_tool_admin_action_pb.SpiffToolAdminAction
};

SpiffToolAdminActionService.Delete = {
  methodName: "Delete",
  service: SpiffToolAdminActionService,
  requestStream: false,
  responseStream: false,
  requestType: spiff_tool_admin_action_pb.SpiffToolAdminAction,
  responseType: spiff_tool_admin_action_pb.SpiffToolAdminAction
};

exports.SpiffToolAdminActionService = SpiffToolAdminActionService;

function SpiffToolAdminActionServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

SpiffToolAdminActionServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SpiffToolAdminActionService.Create, {
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

SpiffToolAdminActionServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SpiffToolAdminActionService.Get, {
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

SpiffToolAdminActionServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SpiffToolAdminActionService.BatchGet, {
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

SpiffToolAdminActionServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(SpiffToolAdminActionService.List, {
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

SpiffToolAdminActionServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SpiffToolAdminActionService.Update, {
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

SpiffToolAdminActionServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SpiffToolAdminActionService.Delete, {
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

exports.SpiffToolAdminActionServiceClient = SpiffToolAdminActionServiceClient;

