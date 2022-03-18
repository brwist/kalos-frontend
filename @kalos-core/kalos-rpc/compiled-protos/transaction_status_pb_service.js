// package: 
// file: transaction_status.proto

var transaction_status_pb = require("./transaction_status_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var TransactionStatusService = (function () {
  function TransactionStatusService() {}
  TransactionStatusService.serviceName = "TransactionStatusService";
  return TransactionStatusService;
}());

TransactionStatusService.Get = {
  methodName: "Get",
  service: TransactionStatusService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_status_pb.TransactionStatus,
  responseType: transaction_status_pb.TransactionStatus
};

TransactionStatusService.BatchGet = {
  methodName: "BatchGet",
  service: TransactionStatusService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_status_pb.TransactionStatus,
  responseType: transaction_status_pb.TransactionStatusList
};

TransactionStatusService.List = {
  methodName: "List",
  service: TransactionStatusService,
  requestStream: false,
  responseStream: true,
  requestType: transaction_status_pb.TransactionStatus,
  responseType: transaction_status_pb.TransactionStatus
};

exports.TransactionStatusService = TransactionStatusService;

function TransactionStatusServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

TransactionStatusServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionStatusService.Get, {
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

TransactionStatusServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionStatusService.BatchGet, {
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

TransactionStatusServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(TransactionStatusService.List, {
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

exports.TransactionStatusServiceClient = TransactionStatusServiceClient;

