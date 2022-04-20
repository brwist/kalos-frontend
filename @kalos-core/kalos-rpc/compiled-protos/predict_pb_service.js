// package: 
// file: predict.proto

var predict_pb = require("./predict_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var PredictService = (function () {
  function PredictService() {}
  PredictService.serviceName = "PredictService";
  return PredictService;
}());

PredictService.PredictCostCenter = {
  methodName: "PredictCostCenter",
  service: PredictService,
  requestStream: false,
  responseStream: false,
  requestType: predict_pb.TransactionData,
  responseType: predict_pb.Prediction
};

exports.PredictService = PredictService;

function PredictServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

PredictServiceClient.prototype.predictCostCenter = function predictCostCenter(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PredictService.PredictCostCenter, {
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

exports.PredictServiceClient = PredictServiceClient;

