// package: 
// file: contract_frequency.proto

var contract_frequency_pb = require("./contract_frequency_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var ContractFrequencyService = (function () {
  function ContractFrequencyService() {}
  ContractFrequencyService.serviceName = "ContractFrequencyService";
  return ContractFrequencyService;
}());

ContractFrequencyService.Create = {
  methodName: "Create",
  service: ContractFrequencyService,
  requestStream: false,
  responseStream: false,
  requestType: contract_frequency_pb.ContractFrequency,
  responseType: contract_frequency_pb.ContractFrequency
};

ContractFrequencyService.Get = {
  methodName: "Get",
  service: ContractFrequencyService,
  requestStream: false,
  responseStream: false,
  requestType: contract_frequency_pb.ContractFrequency,
  responseType: contract_frequency_pb.ContractFrequency
};

ContractFrequencyService.BatchGet = {
  methodName: "BatchGet",
  service: ContractFrequencyService,
  requestStream: false,
  responseStream: false,
  requestType: contract_frequency_pb.ContractFrequency,
  responseType: contract_frequency_pb.ContractFrequencyList
};

ContractFrequencyService.List = {
  methodName: "List",
  service: ContractFrequencyService,
  requestStream: false,
  responseStream: true,
  requestType: contract_frequency_pb.ContractFrequency,
  responseType: contract_frequency_pb.ContractFrequency
};

ContractFrequencyService.Update = {
  methodName: "Update",
  service: ContractFrequencyService,
  requestStream: false,
  responseStream: false,
  requestType: contract_frequency_pb.ContractFrequency,
  responseType: contract_frequency_pb.ContractFrequency
};

ContractFrequencyService.Delete = {
  methodName: "Delete",
  service: ContractFrequencyService,
  requestStream: false,
  responseStream: false,
  requestType: contract_frequency_pb.ContractFrequency,
  responseType: contract_frequency_pb.ContractFrequency
};

exports.ContractFrequencyService = ContractFrequencyService;

function ContractFrequencyServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

ContractFrequencyServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ContractFrequencyService.Create, {
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

ContractFrequencyServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ContractFrequencyService.Get, {
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

ContractFrequencyServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ContractFrequencyService.BatchGet, {
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

ContractFrequencyServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(ContractFrequencyService.List, {
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

ContractFrequencyServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ContractFrequencyService.Update, {
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

ContractFrequencyServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ContractFrequencyService.Delete, {
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

exports.ContractFrequencyServiceClient = ContractFrequencyServiceClient;

