// package: 
// file: kalosmaps.proto

var kalosmaps_pb = require("./kalosmaps_pb");
var common_pb = require("./common_pb");
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
  requestType: kalosmaps_pb.Place,
  responseType: kalosmaps_pb.Coordinates
};

MapService.DistanceMatrix = {
  methodName: "DistanceMatrix",
  service: MapService,
  requestStream: false,
  responseStream: false,
  requestType: kalosmaps_pb.MatrixRequest,
  responseType: kalosmaps_pb.DistanceMatrixResponse
};

MapService.Elevation = {
  methodName: "Elevation",
  service: MapService,
  requestStream: false,
  responseStream: false,
  requestType: kalosmaps_pb.Coordinates,
  responseType: common_pb.Double
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

MapServiceClient.prototype.distanceMatrix = function distanceMatrix(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MapService.DistanceMatrix, {
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

MapServiceClient.prototype.elevation = function elevation(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MapService.Elevation, {
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

