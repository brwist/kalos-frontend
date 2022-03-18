// package: 
// file: pending_invoice_transaction.proto

var pending_invoice_transaction_pb = require("./pending_invoice_transaction_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var PendingInvoiceTransactionService = (function () {
  function PendingInvoiceTransactionService() {}
  PendingInvoiceTransactionService.serviceName = "PendingInvoiceTransactionService";
  return PendingInvoiceTransactionService;
}());

PendingInvoiceTransactionService.Create = {
  methodName: "Create",
  service: PendingInvoiceTransactionService,
  requestStream: false,
  responseStream: false,
  requestType: pending_invoice_transaction_pb.PendingInvoiceTransaction,
  responseType: pending_invoice_transaction_pb.PendingInvoiceTransaction
};

PendingInvoiceTransactionService.Get = {
  methodName: "Get",
  service: PendingInvoiceTransactionService,
  requestStream: false,
  responseStream: false,
  requestType: pending_invoice_transaction_pb.PendingInvoiceTransaction,
  responseType: pending_invoice_transaction_pb.PendingInvoiceTransaction
};

PendingInvoiceTransactionService.BatchGet = {
  methodName: "BatchGet",
  service: PendingInvoiceTransactionService,
  requestStream: false,
  responseStream: false,
  requestType: pending_invoice_transaction_pb.PendingInvoiceTransaction,
  responseType: pending_invoice_transaction_pb.PendingInvoiceTransactionList
};

PendingInvoiceTransactionService.Update = {
  methodName: "Update",
  service: PendingInvoiceTransactionService,
  requestStream: false,
  responseStream: false,
  requestType: pending_invoice_transaction_pb.PendingInvoiceTransaction,
  responseType: pending_invoice_transaction_pb.PendingInvoiceTransaction
};

PendingInvoiceTransactionService.Delete = {
  methodName: "Delete",
  service: PendingInvoiceTransactionService,
  requestStream: false,
  responseStream: false,
  requestType: pending_invoice_transaction_pb.PendingInvoiceTransaction,
  responseType: pending_invoice_transaction_pb.PendingInvoiceTransaction
};

exports.PendingInvoiceTransactionService = PendingInvoiceTransactionService;

function PendingInvoiceTransactionServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

PendingInvoiceTransactionServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PendingInvoiceTransactionService.Create, {
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

PendingInvoiceTransactionServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PendingInvoiceTransactionService.Get, {
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

PendingInvoiceTransactionServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PendingInvoiceTransactionService.BatchGet, {
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

PendingInvoiceTransactionServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PendingInvoiceTransactionService.Update, {
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

PendingInvoiceTransactionServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PendingInvoiceTransactionService.Delete, {
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

exports.PendingInvoiceTransactionServiceClient = PendingInvoiceTransactionServiceClient;

