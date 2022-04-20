// package: 
// file: quote_part.proto

var quote_part_pb = require("./quote_part_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var QuotePartService = (function () {
  function QuotePartService() {}
  QuotePartService.serviceName = "QuotePartService";
  return QuotePartService;
}());

QuotePartService.Create = {
  methodName: "Create",
  service: QuotePartService,
  requestStream: false,
  responseStream: false,
  requestType: quote_part_pb.QuotePart,
  responseType: quote_part_pb.QuotePart
};

QuotePartService.Get = {
  methodName: "Get",
  service: QuotePartService,
  requestStream: false,
  responseStream: false,
  requestType: quote_part_pb.QuotePart,
  responseType: quote_part_pb.QuotePart
};

QuotePartService.BatchGet = {
  methodName: "BatchGet",
  service: QuotePartService,
  requestStream: false,
  responseStream: false,
  requestType: quote_part_pb.QuotePart,
  responseType: quote_part_pb.QuotePartList
};

QuotePartService.List = {
  methodName: "List",
  service: QuotePartService,
  requestStream: false,
  responseStream: true,
  requestType: quote_part_pb.QuotePart,
  responseType: quote_part_pb.QuotePart
};

QuotePartService.Update = {
  methodName: "Update",
  service: QuotePartService,
  requestStream: false,
  responseStream: false,
  requestType: quote_part_pb.QuotePart,
  responseType: quote_part_pb.QuotePart
};

QuotePartService.Delete = {
  methodName: "Delete",
  service: QuotePartService,
  requestStream: false,
  responseStream: false,
  requestType: quote_part_pb.QuotePart,
  responseType: quote_part_pb.QuotePart
};

exports.QuotePartService = QuotePartService;

function QuotePartServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

QuotePartServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(QuotePartService.Create, {
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

QuotePartServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(QuotePartService.Get, {
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

QuotePartServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(QuotePartService.BatchGet, {
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

QuotePartServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(QuotePartService.List, {
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

QuotePartServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(QuotePartService.Update, {
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

QuotePartServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(QuotePartService.Delete, {
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

exports.QuotePartServiceClient = QuotePartServiceClient;

