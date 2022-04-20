// package: 
// file: stock_vendor.proto

var stock_vendor_pb = require("./stock_vendor_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var StockVendorService = (function () {
  function StockVendorService() {}
  StockVendorService.serviceName = "StockVendorService";
  return StockVendorService;
}());

StockVendorService.Create = {
  methodName: "Create",
  service: StockVendorService,
  requestStream: false,
  responseStream: false,
  requestType: stock_vendor_pb.StockVendor,
  responseType: stock_vendor_pb.StockVendor
};

StockVendorService.Get = {
  methodName: "Get",
  service: StockVendorService,
  requestStream: false,
  responseStream: false,
  requestType: stock_vendor_pb.StockVendor,
  responseType: stock_vendor_pb.StockVendor
};

StockVendorService.BatchGet = {
  methodName: "BatchGet",
  service: StockVendorService,
  requestStream: false,
  responseStream: false,
  requestType: stock_vendor_pb.StockVendor,
  responseType: stock_vendor_pb.StockVendorList
};

StockVendorService.List = {
  methodName: "List",
  service: StockVendorService,
  requestStream: false,
  responseStream: true,
  requestType: stock_vendor_pb.StockVendor,
  responseType: stock_vendor_pb.StockVendor
};

StockVendorService.Update = {
  methodName: "Update",
  service: StockVendorService,
  requestStream: false,
  responseStream: false,
  requestType: stock_vendor_pb.StockVendor,
  responseType: stock_vendor_pb.StockVendor
};

StockVendorService.Delete = {
  methodName: "Delete",
  service: StockVendorService,
  requestStream: false,
  responseStream: false,
  requestType: stock_vendor_pb.StockVendor,
  responseType: stock_vendor_pb.StockVendor
};

exports.StockVendorService = StockVendorService;

function StockVendorServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

StockVendorServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(StockVendorService.Create, {
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

StockVendorServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(StockVendorService.Get, {
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

StockVendorServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(StockVendorService.BatchGet, {
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

StockVendorServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(StockVendorService.List, {
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

StockVendorServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(StockVendorService.Update, {
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

StockVendorServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(StockVendorService.Delete, {
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

exports.StockVendorServiceClient = StockVendorServiceClient;

