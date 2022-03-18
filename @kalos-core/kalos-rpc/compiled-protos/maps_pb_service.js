// package: 
// file: maps.proto

var maps_pb = require("./maps_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var MapService = (function () {
  function MapService() {}
  MapService.serviceName = "MapService";
  return MapService;
}());

MapService.Geocode = {
  methodName: "Geocode",
  service: MapService,
  requestStream: false,
  responseStream: false,
  requestType: maps_pb.Place,
  responseType: maps_pb.Coordinates
};

exports.MapService = MapService;

function MapServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

MapServiceClient.prototype.geocode = function geocode(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MapService.Geocode, {
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

exports.MapServiceClient = MapServiceClient;

