// package: 
// file: prompt_payment_override.proto

var prompt_payment_override_pb = require("./prompt_payment_override_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var PromptPaymentOverrideService = (function () {
  function PromptPaymentOverrideService() {}
  PromptPaymentOverrideService.serviceName = "PromptPaymentOverrideService";
  return PromptPaymentOverrideService;
}());

PromptPaymentOverrideService.Create = {
  methodName: "Create",
  service: PromptPaymentOverrideService,
  requestStream: false,
  responseStream: false,
  requestType: prompt_payment_override_pb.PromptPaymentOverride,
  responseType: prompt_payment_override_pb.PromptPaymentOverride
};

PromptPaymentOverrideService.Get = {
  methodName: "Get",
  service: PromptPaymentOverrideService,
  requestStream: false,
  responseStream: false,
  requestType: prompt_payment_override_pb.PromptPaymentOverride,
  responseType: prompt_payment_override_pb.PromptPaymentOverride
};

PromptPaymentOverrideService.BatchGet = {
  methodName: "BatchGet",
  service: PromptPaymentOverrideService,
  requestStream: false,
  responseStream: false,
  requestType: prompt_payment_override_pb.PromptPaymentOverride,
  responseType: prompt_payment_override_pb.PromptPaymentOverrideList
};

PromptPaymentOverrideService.List = {
  methodName: "List",
  service: PromptPaymentOverrideService,
  requestStream: false,
  responseStream: true,
  requestType: prompt_payment_override_pb.PromptPaymentOverride,
  responseType: prompt_payment_override_pb.PromptPaymentOverride
};

PromptPaymentOverrideService.Update = {
  methodName: "Update",
  service: PromptPaymentOverrideService,
  requestStream: false,
  responseStream: false,
  requestType: prompt_payment_override_pb.PromptPaymentOverride,
  responseType: prompt_payment_override_pb.PromptPaymentOverride
};

PromptPaymentOverrideService.Delete = {
  methodName: "Delete",
  service: PromptPaymentOverrideService,
  requestStream: false,
  responseStream: false,
  requestType: prompt_payment_override_pb.PromptPaymentOverride,
  responseType: prompt_payment_override_pb.PromptPaymentOverride
};

exports.PromptPaymentOverrideService = PromptPaymentOverrideService;

function PromptPaymentOverrideServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

PromptPaymentOverrideServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PromptPaymentOverrideService.Create, {
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

PromptPaymentOverrideServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PromptPaymentOverrideService.Get, {
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

PromptPaymentOverrideServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PromptPaymentOverrideService.BatchGet, {
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

PromptPaymentOverrideServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(PromptPaymentOverrideService.List, {
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

PromptPaymentOverrideServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PromptPaymentOverrideService.Update, {
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

PromptPaymentOverrideServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PromptPaymentOverrideService.Delete, {
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

exports.PromptPaymentOverrideServiceClient = PromptPaymentOverrideServiceClient;

