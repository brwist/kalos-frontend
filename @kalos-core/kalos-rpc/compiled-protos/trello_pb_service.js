// package: 
// file: trello.proto

var trello_pb = require("./trello_pb");
var common_pb = require("./common_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var TrelloService = (function () {
  function TrelloService() {}
  TrelloService.serviceName = "TrelloService";
  return TrelloService;
}());

TrelloService.GetBoardById = {
  methodName: "GetBoardById",
  service: TrelloService,
  requestStream: false,
  responseStream: false,
  requestType: common_pb.String,
  responseType: trello_pb.Board
};

TrelloService.BatchGetBoardsById = {
  methodName: "BatchGetBoardsById",
  service: TrelloService,
  requestStream: false,
  responseStream: false,
  requestType: trello_pb.BoardIdList,
  responseType: trello_pb.BoardList
};

TrelloService.CreateBoard = {
  methodName: "CreateBoard",
  service: TrelloService,
  requestStream: false,
  responseStream: false,
  requestType: trello_pb.Board,
  responseType: trello_pb.Board
};

TrelloService.UpdateBoard = {
  methodName: "UpdateBoard",
  service: TrelloService,
  requestStream: false,
  responseStream: false,
  requestType: trello_pb.Board,
  responseType: trello_pb.Board
};

TrelloService.DeleteBoardById = {
  methodName: "DeleteBoardById",
  service: TrelloService,
  requestStream: false,
  responseStream: false,
  requestType: common_pb.String,
  responseType: common_pb.Empty
};

exports.TrelloService = TrelloService;

function TrelloServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

TrelloServiceClient.prototype.getBoardById = function getBoardById(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TrelloService.GetBoardById, {
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

TrelloServiceClient.prototype.batchGetBoardsById = function batchGetBoardsById(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TrelloService.BatchGetBoardsById, {
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

TrelloServiceClient.prototype.createBoard = function createBoard(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TrelloService.CreateBoard, {
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

TrelloServiceClient.prototype.updateBoard = function updateBoard(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TrelloService.UpdateBoard, {
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

TrelloServiceClient.prototype.deleteBoardById = function deleteBoardById(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TrelloService.DeleteBoardById, {
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

exports.TrelloServiceClient = TrelloServiceClient;

