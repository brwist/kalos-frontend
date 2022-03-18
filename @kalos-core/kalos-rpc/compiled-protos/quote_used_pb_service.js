// package: 
// file: quote_used.proto

var quote_used_pb = require("./quote_used_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var QuoteUsedService = (function () {
  function QuoteUsedService() {}
  QuoteUsedService.serviceName = "QuoteUsedService";
  return QuoteUsedService;
}());

QuoteUsedService.Create = {
  methodName: "Create",
  service: QuoteUsedService,
  requestStream: false,
  responseStream: false,
  requestType: quote_used_pb.QuoteUsed,
  responseType: quote_used_pb.QuoteUsed
};

QuoteUsedService.Get = {
  methodName: "Get",
  service: QuoteUsedService,
  requestStream: false,
  responseStream: false,
  requestType: quote_used_pb.QuoteUsed,
  responseType: quote_used_pb.QuoteUsed
};

QuoteUsedService.BatchGet = {
  methodName: "BatchGet",
  service: QuoteUsedService,
  requestStream: false,
  responseStream: false,
  requestType: quote_used_pb.QuoteUsed,
  responseType: quote_used_pb.QuoteUsedList
};

QuoteUsedService.List = {
  methodName: "List",
  service: QuoteUsedService,
  requestStream: false,
  responseStream: true,
  requestType: quote_used_pb.QuoteUsed,
  responseType: quote_used_pb.QuoteUsed
};

QuoteUsedService.Update = {
  methodName: "Update",
  service: QuoteUsedService,
  requestStream: false,
  responseStream: false,
  requestType: quote_used_pb.QuoteUsed,
  responseType: quote_used_pb.QuoteUsed
};

QuoteUsedService.Delete = {
  methodName: "Delete",
  service: QuoteUsedService,
  requestStream: false,
  responseStream: false,
  requestType: quote_used_pb.QuoteUsed,
  responseType: quote_used_pb.QuoteUsed
};

exports.QuoteUsedService = QuoteUsedService;

function QuoteUsedServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

QuoteUsedServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(QuoteUsedService.Create, {
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

QuoteUsedServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(QuoteUsedService.Get, {
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

QuoteUsedServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(QuoteUsedService.BatchGet, {
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

QuoteUsedServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(QuoteUsedService.List, {
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

QuoteUsedServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(QuoteUsedService.Update, {
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

QuoteUsedServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(QuoteUsedService.Delete, {
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

exports.QuoteUsedServiceClient = QuoteUsedServiceClient;

