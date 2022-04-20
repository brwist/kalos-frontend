// package: 
// file: transaction_document.proto

var transaction_document_pb = require("./transaction_document_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var TransactionDocumentService = (function () {
  function TransactionDocumentService() {}
  TransactionDocumentService.serviceName = "TransactionDocumentService";
  return TransactionDocumentService;
}());

TransactionDocumentService.Create = {
  methodName: "Create",
  service: TransactionDocumentService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_document_pb.TransactionDocument,
  responseType: transaction_document_pb.TransactionDocument
};

TransactionDocumentService.Get = {
  methodName: "Get",
  service: TransactionDocumentService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_document_pb.TransactionDocument,
  responseType: transaction_document_pb.TransactionDocument
};

TransactionDocumentService.BatchGet = {
  methodName: "BatchGet",
  service: TransactionDocumentService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_document_pb.TransactionDocument,
  responseType: transaction_document_pb.TransactionDocumentList
};

TransactionDocumentService.List = {
  methodName: "List",
  service: TransactionDocumentService,
  requestStream: false,
  responseStream: true,
  requestType: transaction_document_pb.TransactionDocument,
  responseType: transaction_document_pb.TransactionDocument
};

TransactionDocumentService.Update = {
  methodName: "Update",
  service: TransactionDocumentService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_document_pb.TransactionDocument,
  responseType: transaction_document_pb.TransactionDocument
};

TransactionDocumentService.Delete = {
  methodName: "Delete",
  service: TransactionDocumentService,
  requestStream: false,
  responseStream: false,
  requestType: transaction_document_pb.TransactionDocument,
  responseType: transaction_document_pb.TransactionDocument
};

exports.TransactionDocumentService = TransactionDocumentService;

function TransactionDocumentServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

TransactionDocumentServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionDocumentService.Create, {
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

TransactionDocumentServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionDocumentService.Get, {
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

TransactionDocumentServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionDocumentService.BatchGet, {
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

TransactionDocumentServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(TransactionDocumentService.List, {
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

TransactionDocumentServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionDocumentService.Update, {
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

TransactionDocumentServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionDocumentService.Delete, {
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

exports.TransactionDocumentServiceClient = TransactionDocumentServiceClient;

