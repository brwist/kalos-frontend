// package: 
// file: trello_slack_bot.proto

var trello_slack_bot_pb = require("./trello_slack_bot_pb");
var common_pb = require("./common_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var TrelloSlackBot = (function () {
  function TrelloSlackBot() {}
  TrelloSlackBot.serviceName = "TrelloSlackBot";
  return TrelloSlackBot;
}());

TrelloSlackBot.Status = {
  methodName: "Status",
  service: TrelloSlackBot,
  requestStream: false,
  responseStream: false,
  requestType: common_pb.Empty,
  responseType: common_pb.String
};

TrelloSlackBot.Help = {
  methodName: "Help",
  service: TrelloSlackBot,
  requestStream: false,
  responseStream: false,
  requestType: trello_slack_bot_pb.Request,
  responseType: common_pb.String
};

exports.TrelloSlackBot = TrelloSlackBot;

function TrelloSlackBotClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

TrelloSlackBotClient.prototype.status = function status(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TrelloSlackBot.Status, {
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

TrelloSlackBotClient.prototype.help = function help(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TrelloSlackBot.Help, {
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

exports.TrelloSlackBotClient = TrelloSlackBotClient;

