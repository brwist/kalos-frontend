// package: 
// file: transaction_activity.proto

var transaction_activity_pb = require("./transaction_activity_pb");
var common_pb = require("./common_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var TransactionActivityService = (function () {
  function TransactionActivityService() {}
  TransactionActivityService.serviceName = "TransactionActivityService";
  return TransactionActivityService;
}());

TransactionActivityService.Create = {
  methodName: "Create",
  service: TransactionActivityService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_activity_pb.TransactionActivity,
  responseType: transaction_activity_pb.TransactionActivity
};

TransactionActivityService.Get = {
  methodName: "Get",
  service: TransactionActivityService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_activity_pb.TransactionActivity,
  responseType: transaction_activity_pb.TransactionActivity
};

TransactionActivityService.BatchGet = {
  methodName: "BatchGet",
  service: TransactionActivityService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_activity_pb.TransactionActivity,
  responseType: transaction_activity_pb.TransactionActivityList
};

TransactionActivityService.List = {
  methodName: "List",
  service: TransactionActivityService,
  requestStream: false,
  responseStream: true,
  requestType: transaction_activity_pb.TransactionActivity,
  responseType: transaction_activity_pb.TransactionActivity
};

TransactionActivityService.Update = {
  methodName: "Update",
  service: TransactionActivityService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_activity_pb.TransactionActivity,
  responseType: transaction_activity_pb.TransactionActivity
};

TransactionActivityService.Delete = {
  methodName: "Delete",
  service: TransactionActivityService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_activity_pb.TransactionActivity,
  responseType: transaction_activity_pb.TransactionActivity
};

TransactionActivityService.MergeTransactionActivityLogs = {
  methodName: "MergeTransactionActivityLogs",
  service: TransactionActivityService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_activity_pb.MergeTransactionIds,
  responseType: common_pb.Empty
};

exports.TransactionActivityService = TransactionActivityService;

function TransactionActivityServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

TransactionActivityServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionActivityService.Create, {
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

TransactionActivityServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionActivityService.Get, {
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

TransactionActivityServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionActivityService.BatchGet, {
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

TransactionActivityServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(TransactionActivityService.List, {
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

TransactionActivityServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionActivityService.Update, {
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

TransactionActivityServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionActivityService.Delete, {
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

TransactionActivityServiceClient.prototype.mergeTransactionActivityLogs = function mergeTransactionActivityLogs(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionActivityService.MergeTransactionActivityLogs, {
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

exports.TransactionActivityServiceClient = TransactionActivityServiceClient;

