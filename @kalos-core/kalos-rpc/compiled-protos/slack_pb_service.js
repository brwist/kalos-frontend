// package: 
// file: slack.proto

var slack_pb = require("./slack_pb");
var common_pb = require("./common_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var SlackService = (function () {
  function SlackService() {}
  SlackService.serviceName = "SlackService";
  return SlackService;
}());

SlackService.DirectMessageUserById = {
  methodName: "DirectMessageUserById",
  service: SlackService,
  requestStream: false,
  responseStream: false,
  requestType: slack_pb.DMReq,
  responseType: common_pb.Bool
};

SlackService.Dispatch = {
  methodName: "Dispatch",
  service: SlackService,
  requestStream: false,
  responseStream: false,
  requestType: slack_pb.DispatchReq,
  responseType: common_pb.Bool
};

SlackService.FirstCall = {
  methodName: "FirstCall",
  service: SlackService,
  requestStream: false,
  responseStream: false,
  requestType: slack_pb.FCReq,
  responseType: common_pb.Bool
};

exports.SlackService = SlackService;

function SlackServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

SlackServiceClient.prototype.directMessageUserById = function directMessageUserById(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SlackService.DirectMessageUserById, {
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

SlackServiceClient.prototype.dispatch = function dispatch(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SlackService.Dispatch, {
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

SlackServiceClient.prototype.firstCall = function firstCall(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SlackService.FirstCall, {
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

exports.SlackServiceClient = SlackServiceClient;

