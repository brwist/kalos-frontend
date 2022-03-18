// package: 
// file: vendor_order.proto

var vendor_order_pb = require("./vendor_order_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var VendorOrderService = (function () {
  function VendorOrderService() {}
  VendorOrderService.serviceName = "VendorOrderService";
  return VendorOrderService;
}());

VendorOrderService.Create = {
  methodName: "Create",
  service: VendorOrderService,
  requestStream: false,
  responseStream: false,
  requestType: vendor_order_pb.VendorOrder,
  responseType: vendor_order_pb.VendorOrder
};

VendorOrderService.Get = {
  methodName: "Get",
  service: VendorOrderService,
  requestStream: false,
  responseStream: false,
  requestType: vendor_order_pb.VendorOrder,
  responseType: vendor_order_pb.VendorOrder
};

VendorOrderService.BatchGet = {
  methodName: "BatchGet",
  service: VendorOrderService,
  requestStream: false,
  responseStream: false,
  requestType: vendor_order_pb.VendorOrder,
  responseType: vendor_order_pb.VendorOrderList
};

VendorOrderService.List = {
  methodName: "List",
  service: VendorOrderService,
  requestStream: false,
  responseStream: true,
  requestType: vendor_order_pb.VendorOrder,
  responseType: vendor_order_pb.VendorOrder
};

VendorOrderService.Update = {
  methodName: "Update",
  service: VendorOrderService,
  requestStream: false,
  responseStream: false,
  requestType: vendor_order_pb.VendorOrder,
  responseType: vendor_order_pb.VendorOrder
};

VendorOrderService.Delete = {
  methodName: "Delete",
  service: VendorOrderService,
  requestStream: false,
  responseStream: false,
  requestType: vendor_order_pb.VendorOrder,
  responseType: vendor_order_pb.VendorOrder
};

exports.VendorOrderService = VendorOrderService;

function VendorOrderServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

VendorOrderServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(VendorOrderService.Create, {
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

VendorOrderServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(VendorOrderService.Get, {
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

VendorOrderServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(VendorOrderService.BatchGet, {
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

VendorOrderServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(VendorOrderService.List, {
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

VendorOrderServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(VendorOrderService.Update, {
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

VendorOrderServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(VendorOrderService.Delete, {
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

exports.VendorOrderServiceClient = VendorOrderServiceClient;

