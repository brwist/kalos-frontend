// package: 
// file: samsara.proto

var samsara_pb = require("./samsara_pb");
var common_pb = require("./common_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var SamsaraService = (function () {
  function SamsaraService() {}
  SamsaraService.serviceName = "SamsaraService";
  return SamsaraService;
}());

SamsaraService.BatchGetDrivers = {
  methodName: "BatchGetDrivers",
  service: SamsaraService,
  requestStream: false,
  responseStream: false,
  requestType: common_pb.Empty,
  responseType: samsara_pb.SamsaraDriversResponse
};

SamsaraService.BatchGetLocations = {
  methodName: "BatchGetLocations",
  service: SamsaraService,
  requestStream: false,
  responseStream: false,
  requestType: common_pb.Empty,
  responseType: samsara_pb.SamsaraLocationResponse
};

SamsaraService.CreateAddress = {
  methodName: "CreateAddress",
  service: SamsaraService,
  requestStream: false,
  responseStream: false,
  requestType: samsara_pb.SamsaraAddress,
  responseType: common_pb.String
};

exports.SamsaraService = SamsaraService;

function SamsaraServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

SamsaraServiceClient.prototype.batchGetDrivers = function batchGetDrivers(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SamsaraService.BatchGetDrivers, {
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

SamsaraServiceClient.prototype.batchGetLocations = function batchGetLocations(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SamsaraService.BatchGetLocations, {
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

SamsaraServiceClient.prototype.createAddress = function createAddress(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SamsaraService.CreateAddress, {
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

exports.SamsaraServiceClient = SamsaraServiceClient;

