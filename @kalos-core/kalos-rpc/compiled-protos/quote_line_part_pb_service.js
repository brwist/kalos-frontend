// package: 
// file: quote_line_part.proto

var quote_line_part_pb = require("./quote_line_part_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var QuoteLinePartService = (function () {
  function QuoteLinePartService() {}
  QuoteLinePartService.serviceName = "QuoteLinePartService";
  return QuoteLinePartService;
}());

QuoteLinePartService.Create = {
  methodName: "Create",
  service: QuoteLinePartService,
  requestStream: false,
  responseStream: false,
  requestType: quote_line_part_pb.QuoteLinePart,
  responseType: quote_line_part_pb.QuoteLinePart
};

QuoteLinePartService.Get = {
  methodName: "Get",
  service: QuoteLinePartService,
  requestStream: false,
  responseStream: false,
  requestType: quote_line_part_pb.QuoteLinePart,
  responseType: quote_line_part_pb.QuoteLinePart
};

QuoteLinePartService.BatchGet = {
  methodName: "BatchGet",
  service: QuoteLinePartService,
  requestStream: false,
  responseStream: false,
  requestType: quote_line_part_pb.QuoteLinePart,
  responseType: quote_line_part_pb.QuoteLinePartList
};

QuoteLinePartService.List = {
  methodName: "List",
  service: QuoteLinePartService,
  requestStream: false,
  responseStream: true,
  requestType: quote_line_part_pb.QuoteLinePart,
  responseType: quote_line_part_pb.QuoteLinePart
};

QuoteLinePartService.Update = {
  methodName: "Update",
  service: QuoteLinePartService,
  requestStream: false,
  responseStream: false,
  requestType: quote_line_part_pb.QuoteLinePart,
  responseType: quote_line_part_pb.QuoteLinePart
};

QuoteLinePartService.Delete = {
  methodName: "Delete",
  service: QuoteLinePartService,
  requestStream: false,
  responseStream: false,
  requestType: quote_line_part_pb.QuoteLinePart,
  responseType: quote_line_part_pb.QuoteLinePart
};

exports.QuoteLinePartService = QuoteLinePartService;

function QuoteLinePartServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

QuoteLinePartServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(QuoteLinePartService.Create, {
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

QuoteLinePartServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(QuoteLinePartService.Get, {
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

QuoteLinePartServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(QuoteLinePartService.BatchGet, {
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

QuoteLinePartServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(QuoteLinePartService.List, {
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

QuoteLinePartServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(QuoteLinePartService.Update, {
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

QuoteLinePartServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(QuoteLinePartService.Delete, {
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

exports.QuoteLinePartServiceClient = QuoteLinePartServiceClient;

