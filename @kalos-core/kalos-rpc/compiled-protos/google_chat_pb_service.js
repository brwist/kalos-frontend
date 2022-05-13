// package: 
// file: google_chat.proto

var google_chat_pb = require("./google_chat_pb");
var common_pb = require("./common_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var GoogleChat = (function () {
  function GoogleChat() {}
  GoogleChat.serviceName = "GoogleChat";
  return GoogleChat;
}());

GoogleChat.Status = {
  methodName: "Status",
  service: GoogleChat,
  requestStream: false,
  responseStream: false,
  requestType: common_pb.Empty,
  responseType: common_pb.String
};

GoogleChat.SendMessageViaPost = {
  methodName: "SendMessageViaPost",
  service: GoogleChat,
  requestStream: false,
  responseStream: false,
  requestType: google_chat_pb.InitialRequest,
  responseType: common_pb.String
};

GoogleChat.MessageInChannel = {
  methodName: "MessageInChannel",
  service: GoogleChat,
  requestStream: false,
  responseStream: false,
  requestType: google_chat_pb.Message,
  responseType: common_pb.Empty
};

exports.GoogleChat = GoogleChat;

function GoogleChatClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

GoogleChatClient.prototype.status = function status(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(GoogleChat.Status, {
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

GoogleChatClient.prototype.sendMessageViaPost = function sendMessageViaPost(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(GoogleChat.SendMessageViaPost, {
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

GoogleChatClient.prototype.messageInChannel = function messageInChannel(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(GoogleChat.MessageInChannel, {
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

exports.GoogleChatClient = GoogleChatClient;

