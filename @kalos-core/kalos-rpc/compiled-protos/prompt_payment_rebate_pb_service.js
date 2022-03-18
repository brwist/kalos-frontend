// package: 
// file: prompt_payment_rebate.proto

var prompt_payment_rebate_pb = require("./prompt_payment_rebate_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var PromptPaymentRebateService = (function () {
  function PromptPaymentRebateService() {}
  PromptPaymentRebateService.serviceName = "PromptPaymentRebateService";
  return PromptPaymentRebateService;
}());

PromptPaymentRebateService.Create = {
  methodName: "Create",
  service: PromptPaymentRebateService,
  requestStream: false,
  responseStream: false,
  requestType: prompt_payment_rebate_pb.PromptPaymentRebate,
  responseType: prompt_payment_rebate_pb.PromptPaymentRebate
};

PromptPaymentRebateService.Get = {
  methodName: "Get",
  service: PromptPaymentRebateService,
  requestStream: false,
  responseStream: false,
  requestType: prompt_payment_rebate_pb.PromptPaymentRebate,
  responseType: prompt_payment_rebate_pb.PromptPaymentRebate
};

PromptPaymentRebateService.BatchGet = {
  methodName: "BatchGet",
  service: PromptPaymentRebateService,
  requestStream: false,
  responseStream: false,
  requestType: prompt_payment_rebate_pb.PromptPaymentRebate,
  responseType: prompt_payment_rebate_pb.PromptPaymentRebateList
};

PromptPaymentRebateService.List = {
  methodName: "List",
  service: PromptPaymentRebateService,
  requestStream: false,
  responseStream: true,
  requestType: prompt_payment_rebate_pb.PromptPaymentRebate,
  responseType: prompt_payment_rebate_pb.PromptPaymentRebate
};

PromptPaymentRebateService.Update = {
  methodName: "Update",
  service: PromptPaymentRebateService,
  requestStream: false,
  responseStream: false,
  requestType: prompt_payment_rebate_pb.PromptPaymentRebate,
  responseType: prompt_payment_rebate_pb.PromptPaymentRebate
};

PromptPaymentRebateService.Delete = {
  methodName: "Delete",
  service: PromptPaymentRebateService,
  requestStream: false,
  responseStream: false,
  requestType: prompt_payment_rebate_pb.PromptPaymentRebate,
  responseType: prompt_payment_rebate_pb.PromptPaymentRebate
};

exports.PromptPaymentRebateService = PromptPaymentRebateService;

function PromptPaymentRebateServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

PromptPaymentRebateServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PromptPaymentRebateService.Create, {
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

PromptPaymentRebateServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PromptPaymentRebateService.Get, {
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

PromptPaymentRebateServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PromptPaymentRebateService.BatchGet, {
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

PromptPaymentRebateServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(PromptPaymentRebateService.List, {
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

PromptPaymentRebateServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PromptPaymentRebateService.Update, {
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

PromptPaymentRebateServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PromptPaymentRebateService.Delete, {
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

exports.PromptPaymentRebateServiceClient = PromptPaymentRebateServiceClient;

