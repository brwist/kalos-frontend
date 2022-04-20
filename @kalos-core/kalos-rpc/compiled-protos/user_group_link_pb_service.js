// package: 
// file: user_group_link.proto

var user_group_link_pb = require("./user_group_link_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var UserGroupLinkService = (function () {
  function UserGroupLinkService() {}
  UserGroupLinkService.serviceName = "UserGroupLinkService";
  return UserGroupLinkService;
}());

UserGroupLinkService.Create = {
  methodName: "Create",
  service: UserGroupLinkService,
  requestStream: false,
  responseStream: false,
  requestType: user_group_link_pb.UserGroupLink,
  responseType: user_group_link_pb.UserGroupLink
};

UserGroupLinkService.Get = {
  methodName: "Get",
  service: UserGroupLinkService,
  requestStream: false,
  responseStream: false,
  requestType: user_group_link_pb.UserGroupLink,
  responseType: user_group_link_pb.UserGroupLink
};

UserGroupLinkService.BatchGet = {
  methodName: "BatchGet",
  service: UserGroupLinkService,
  requestStream: false,
  responseStream: false,
  requestType: user_group_link_pb.UserGroupLink,
  responseType: user_group_link_pb.UserGroupLinkList
};

UserGroupLinkService.List = {
  methodName: "List",
  service: UserGroupLinkService,
  requestStream: false,
  responseStream: true,
  requestType: user_group_link_pb.UserGroupLink,
  responseType: user_group_link_pb.UserGroupLink
};

UserGroupLinkService.Update = {
  methodName: "Update",
  service: UserGroupLinkService,
  requestStream: false,
  responseStream: false,
  requestType: user_group_link_pb.UserGroupLink,
  responseType: user_group_link_pb.UserGroupLink
};

UserGroupLinkService.Delete = {
  methodName: "Delete",
  service: UserGroupLinkService,
  requestStream: false,
  responseStream: false,
  requestType: user_group_link_pb.UserGroupLink,
  responseType: user_group_link_pb.UserGroupLink
};

exports.UserGroupLinkService = UserGroupLinkService;

function UserGroupLinkServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

UserGroupLinkServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(UserGroupLinkService.Create, {
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

UserGroupLinkServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(UserGroupLinkService.Get, {
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

UserGroupLinkServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(UserGroupLinkService.BatchGet, {
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

UserGroupLinkServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(UserGroupLinkService.List, {
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

UserGroupLinkServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(UserGroupLinkService.Update, {
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

UserGroupLinkServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(UserGroupLinkService.Delete, {
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

exports.UserGroupLinkServiceClient = UserGroupLinkServiceClient;

