// package: 
// file: transaction.proto

var transaction_pb = require("./transaction_pb");
var transaction_account_pb = require("./transaction_account_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var TransactionService = (function () {
  function TransactionService() {}
  TransactionService.serviceName = "TransactionService";
  return TransactionService;
}());

TransactionService.Create = {
  methodName: "Create",
  service: TransactionService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_pb.Transaction,
  responseType: transaction_pb.Transaction
};

TransactionService.Get = {
  methodName: "Get",
  service: TransactionService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_pb.Transaction,
  responseType: transaction_pb.Transaction
};

TransactionService.BatchGet = {
  methodName: "BatchGet",
  service: TransactionService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_pb.Transaction,
  responseType: transaction_pb.TransactionList
};

TransactionService.List = {
  methodName: "List",
  service: TransactionService,
  requestStream: false,
  responseStream: true,
  requestType: transaction_pb.Transaction,
  responseType: transaction_pb.Transaction
};

TransactionService.Search = {
  methodName: "Search",
  service: TransactionService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_pb.Transaction,
  responseType: transaction_pb.TransactionList
};

TransactionService.Update = {
  methodName: "Update",
  service: TransactionService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_pb.Transaction,
  responseType: transaction_pb.Transaction
};

TransactionService.Delete = {
  methodName: "Delete",
  service: TransactionService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_pb.Transaction,
  responseType: transaction_pb.Transaction
};

TransactionService.RecordPage = {
  methodName: "RecordPage",
  service: TransactionService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_pb.RecordPageReq,
  responseType: transaction_pb.TransactionList
};

TransactionService.CreateTransactionAccount = {
  methodName: "CreateTransactionAccount",
  service: TransactionService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_account_pb.TransactionAccount,
  responseType: transaction_account_pb.TransactionAccount
};

TransactionService.GetTransactionAccount = {
  methodName: "GetTransactionAccount",
  service: TransactionService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_account_pb.TransactionAccount,
  responseType: transaction_account_pb.TransactionAccount
};

TransactionService.BatchGetTransactionAccount = {
  methodName: "BatchGetTransactionAccount",
  service: TransactionService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_account_pb.TransactionAccount,
  responseType: transaction_account_pb.TransactionAccountList
};

TransactionService.UpdateTransactionAccount = {
  methodName: "UpdateTransactionAccount",
  service: TransactionService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_account_pb.TransactionAccount,
  responseType: transaction_account_pb.TransactionAccount
};

TransactionService.DeleteTransactionAccount = {
  methodName: "DeleteTransactionAccount",
  service: TransactionService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_account_pb.TransactionAccount,
  responseType: transaction_account_pb.TransactionAccount
};

exports.TransactionService = TransactionService;

function TransactionServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

TransactionServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionService.Create, {
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

TransactionServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionService.Get, {
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

TransactionServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionService.BatchGet, {
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

TransactionServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(TransactionService.List, {
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

TransactionServiceClient.prototype.search = function search(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionService.Search, {
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

TransactionServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionService.Update, {
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

TransactionServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionService.Delete, {
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

TransactionServiceClient.prototype.recordPage = function recordPage(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionService.RecordPage, {
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

TransactionServiceClient.prototype.createTransactionAccount = function createTransactionAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionService.CreateTransactionAccount, {
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

TransactionServiceClient.prototype.getTransactionAccount = function getTransactionAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionService.GetTransactionAccount, {
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

TransactionServiceClient.prototype.batchGetTransactionAccount = function batchGetTransactionAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionService.BatchGetTransactionAccount, {
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

TransactionServiceClient.prototype.updateTransactionAccount = function updateTransactionAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionService.UpdateTransactionAccount, {
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

TransactionServiceClient.prototype.deleteTransactionAccount = function deleteTransactionAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionService.DeleteTransactionAccount, {
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

exports.TransactionServiceClient = TransactionServiceClient;

