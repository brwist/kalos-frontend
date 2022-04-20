// package: 
// file: transaction_account.proto

var transaction_account_pb = require("./transaction_account_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var TransactionAccountService = (function () {
  function TransactionAccountService() {}
  TransactionAccountService.serviceName = "TransactionAccountService";
  return TransactionAccountService;
}());

TransactionAccountService.Create = {
  methodName: "Create",
  service: TransactionAccountService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_account_pb.TransactionAccount,
  responseType: transaction_account_pb.TransactionAccount
};

TransactionAccountService.Get = {
  methodName: "Get",
  service: TransactionAccountService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_account_pb.TransactionAccount,
  responseType: transaction_account_pb.TransactionAccount
};

TransactionAccountService.BatchGet = {
  methodName: "BatchGet",
  service: TransactionAccountService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_account_pb.TransactionAccount,
  responseType: transaction_account_pb.TransactionAccountList
};

TransactionAccountService.List = {
  methodName: "List",
  service: TransactionAccountService,
  requestStream: false,
  responseStream: true,
  requestType: transaction_account_pb.TransactionAccount,
  responseType: transaction_account_pb.TransactionAccount
};

TransactionAccountService.Update = {
  methodName: "Update",
  service: TransactionAccountService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_account_pb.TransactionAccount,
  responseType: transaction_account_pb.TransactionAccount
};

TransactionAccountService.Delete = {
  methodName: "Delete",
  service: TransactionAccountService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_account_pb.TransactionAccount,
  responseType: transaction_account_pb.TransactionAccount
};

exports.TransactionAccountService = TransactionAccountService;

function TransactionAccountServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

TransactionAccountServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionAccountService.Create, {
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

TransactionAccountServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionAccountService.Get, {
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

TransactionAccountServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionAccountService.BatchGet, {
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

TransactionAccountServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(TransactionAccountService.List, {
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

TransactionAccountServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionAccountService.Update, {
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

TransactionAccountServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionAccountService.Delete, {
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

exports.TransactionAccountServiceClient = TransactionAccountServiceClient;

