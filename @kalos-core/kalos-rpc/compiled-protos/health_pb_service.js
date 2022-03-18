// package: 
// file: health.proto

var health_pb = require("./health_pb");
var common_pb = require("./common_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var HealthCheck = (function () {
  function HealthCheck() {}
  HealthCheck.serviceName = "HealthCheck";
  return HealthCheck;
}());

HealthCheck.Status = {
  methodName: "Status",
  service: HealthCheck,
  requestStream: false,
  responseStream: false,
  requestType: common_pb.Empty,
  responseType: common_pb.String
};

exports.HealthCheck = HealthCheck;

function HealthCheckClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

HealthCheckClient.prototype.status = function status(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(HealthCheck.Status, {
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

exports.HealthCheckClient = HealthCheckClient;

