// package: 
// file: quote_document.proto

var quote_document_pb = require("./quote_document_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var QuoteDocumentService = (function () {
  function QuoteDocumentService() {}
  QuoteDocumentService.serviceName = "QuoteDocumentService";
  return QuoteDocumentService;
}());

QuoteDocumentService.Create = {
  methodName: "Create",
  service: QuoteDocumentService,
  requestStream: false,
  responseStream: false,
  requestType: quote_document_pb.QuoteDocument,
  responseType: quote_document_pb.QuoteDocument
};

QuoteDocumentService.Get = {
  methodName: "Get",
  service: QuoteDocumentService,
  requestStream: false,
  responseStream: false,
  requestType: quote_document_pb.QuoteDocument,
  responseType: quote_document_pb.QuoteDocument
};

QuoteDocumentService.BatchGet = {
  methodName: "BatchGet",
  service: QuoteDocumentService,
  requestStream: false,
  responseStream: false,
  requestType: quote_document_pb.QuoteDocument,
  responseType: quote_document_pb.QuoteDocumentList
};

QuoteDocumentService.List = {
  methodName: "List",
  service: QuoteDocumentService,
  requestStream: false,
  responseStream: true,
  requestType: quote_document_pb.QuoteDocument,
  responseType: quote_document_pb.QuoteDocument
};

QuoteDocumentService.Update = {
  methodName: "Update",
  service: QuoteDocumentService,
  requestStream: false,
  responseStream: false,
  requestType: quote_document_pb.QuoteDocument,
  responseType: quote_document_pb.QuoteDocument
};

QuoteDocumentService.Delete = {
  methodName: "Delete",
  service: QuoteDocumentService,
  requestStream: false,
  responseStream: false,
  requestType: quote_document_pb.QuoteDocument,
  responseType: quote_document_pb.QuoteDocument
};

exports.QuoteDocumentService = QuoteDocumentService;

function QuoteDocumentServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

QuoteDocumentServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(QuoteDocumentService.Create, {
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

QuoteDocumentServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(QuoteDocumentService.Get, {
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

QuoteDocumentServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(QuoteDocumentService.BatchGet, {
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

QuoteDocumentServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(QuoteDocumentService.List, {
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

QuoteDocumentServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(QuoteDocumentService.Update, {
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

QuoteDocumentServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(QuoteDocumentService.Delete, {
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

exports.QuoteDocumentServiceClient = QuoteDocumentServiceClient;

