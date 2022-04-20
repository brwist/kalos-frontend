// package: 
// file: pending_billing.proto

var pending_billing_pb = require("./pending_billing_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var PendingBillingService = (function () {
  function PendingBillingService() {}
  PendingBillingService.serviceName = "PendingBillingService";
  return PendingBillingService;
}());

PendingBillingService.Get = {
  methodName: "Get",
  service: PendingBillingService,
  requestStream: false,
  responseStream: false,
  requestType: pending_billing_pb.PendingBilling,
  responseType: pending_billing_pb.PendingBilling
};

PendingBillingService.BatchGet = {
  methodName: "BatchGet",
  service: PendingBillingService,
  requestStream: false,
  responseStream: false,
  requestType: pending_billing_pb.PendingBilling,
  responseType: pending_billing_pb.PendingBillingList
};

PendingBillingService.List = {
  methodName: "List",
  service: PendingBillingService,
  requestStream: false,
  responseStream: true,
  requestType: pending_billing_pb.PendingBilling,
  responseType: pending_billing_pb.PendingBilling
};

exports.PendingBillingService = PendingBillingService;

function PendingBillingServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

PendingBillingServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PendingBillingService.Get, {
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

PendingBillingServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PendingBillingService.BatchGet, {
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

PendingBillingServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(PendingBillingService.List, {
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

exports.PendingBillingServiceClient = PendingBillingServiceClient;

