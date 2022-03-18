// package: 
// file: stored_quote.proto

var stored_quote_pb = require("./stored_quote_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var StoredQuoteService = (function () {
  function StoredQuoteService() {}
  StoredQuoteService.serviceName = "StoredQuoteService";
  return StoredQuoteService;
}());

StoredQuoteService.Create = {
  methodName: "Create",
  service: StoredQuoteService,
  requestStream: false,
  responseStream: false,
  requestType: stored_quote_pb.StoredQuote,
  responseType: stored_quote_pb.StoredQuote
};

StoredQuoteService.Get = {
  methodName: "Get",
  service: StoredQuoteService,
  requestStream: false,
  responseStream: false,
  requestType: stored_quote_pb.StoredQuote,
  responseType: stored_quote_pb.StoredQuote
};

StoredQuoteService.BatchGet = {
  methodName: "BatchGet",
  service: StoredQuoteService,
  requestStream: false,
  responseStream: false,
  requestType: stored_quote_pb.StoredQuote,
  responseType: stored_quote_pb.StoredQuoteList
};

StoredQuoteService.List = {
  methodName: "List",
  service: StoredQuoteService,
  requestStream: false,
  responseStream: true,
  requestType: stored_quote_pb.StoredQuote,
  responseType: stored_quote_pb.StoredQuote
};

StoredQuoteService.Update = {
  methodName: "Update",
  service: StoredQuoteService,
  requestStream: false,
  responseStream: false,
  requestType: stored_quote_pb.StoredQuote,
  responseType: stored_quote_pb.StoredQuote
};

StoredQuoteService.Delete = {
  methodName: "Delete",
  service: StoredQuoteService,
  requestStream: false,
  responseStream: false,
  requestType: stored_quote_pb.StoredQuote,
  responseType: stored_quote_pb.StoredQuote
};

exports.StoredQuoteService = StoredQuoteService;

function StoredQuoteServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

StoredQuoteServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(StoredQuoteService.Create, {
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

StoredQuoteServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(StoredQuoteService.Get, {
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

StoredQuoteServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(StoredQuoteService.BatchGet, {
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

StoredQuoteServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(StoredQuoteService.List, {
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

StoredQuoteServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(StoredQuoteService.Update, {
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

StoredQuoteServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(StoredQuoteService.Delete, {
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

exports.StoredQuoteServiceClient = StoredQuoteServiceClient;

