// package: 
// file: perdiem.proto

var perdiem_pb = require("./perdiem_pb");
var common_pb = require("./common_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var PerDiemService = (function () {
  function PerDiemService() {}
  PerDiemService.serviceName = "PerDiemService";
  return PerDiemService;
}());

PerDiemService.Create = {
  methodName: "Create",
  service: PerDiemService,
  requestStream: false,
  responseStream: false,
  requestType: perdiem_pb.PerDiem,
  responseType: perdiem_pb.PerDiem
};

PerDiemService.Get = {
  methodName: "Get",
  service: PerDiemService,
  requestStream: false,
  responseStream: false,
  requestType: perdiem_pb.PerDiem,
  responseType: perdiem_pb.PerDiem
};

PerDiemService.BatchGet = {
  methodName: "BatchGet",
  service: PerDiemService,
  requestStream: false,
  responseStream: false,
  requestType: perdiem_pb.PerDiem,
  responseType: perdiem_pb.PerDiemList
};

PerDiemService.Update = {
  methodName: "Update",
  service: PerDiemService,
  requestStream: false,
  responseStream: false,
  requestType: perdiem_pb.PerDiem,
  responseType: perdiem_pb.PerDiem
};

PerDiemService.Delete = {
  methodName: "Delete",
  service: PerDiemService,
  requestStream: false,
  responseStream: false,
  requestType: perdiem_pb.PerDiem,
  responseType: perdiem_pb.PerDiem
};

PerDiemService.CreateRow = {
  methodName: "CreateRow",
  service: PerDiemService,
  requestStream: false,
  responseStream: false,
  requestType: perdiem_pb.PerDiemRow,
  responseType: perdiem_pb.PerDiemRow
};

PerDiemService.UpdateRow = {
  methodName: "UpdateRow",
  service: PerDiemService,
  requestStream: false,
  responseStream: false,
  requestType: perdiem_pb.PerDiemRow,
  responseType: perdiem_pb.PerDiemRow
};

PerDiemService.GetRow = {
  methodName: "GetRow",
  service: PerDiemService,
  requestStream: false,
  responseStream: false,
  requestType: perdiem_pb.PerDiemRow,
  responseType: perdiem_pb.PerDiemRow
};

PerDiemService.DeleteRow = {
  methodName: "DeleteRow",
  service: PerDiemService,
  requestStream: false,
  responseStream: false,
  requestType: perdiem_pb.PerDiemRow,
  responseType: common_pb.Empty
};

PerDiemService.GetPerDiemReport = {
  methodName: "GetPerDiemReport",
  service: PerDiemService,
  requestStream: false,
  responseStream: false,
  requestType: perdiem_pb.PerDiemReportRequest,
  responseType: perdiem_pb.PerDiemList
};

PerDiemService.CreateTrip = {
  methodName: "CreateTrip",
  service: PerDiemService,
  requestStream: false,
  responseStream: false,
  requestType: perdiem_pb.Trip,
  responseType: perdiem_pb.Trip
};

PerDiemService.UpdateTrip = {
  methodName: "UpdateTrip",
  service: PerDiemService,
  requestStream: false,
  responseStream: false,
  requestType: perdiem_pb.Trip,
  responseType: perdiem_pb.Trip
};

PerDiemService.GetTrip = {
  methodName: "GetTrip",
  service: PerDiemService,
  requestStream: false,
  responseStream: false,
  requestType: perdiem_pb.Trip,
  responseType: perdiem_pb.Trip
};

PerDiemService.DeleteTrip = {
  methodName: "DeleteTrip",
  service: PerDiemService,
  requestStream: false,
  responseStream: false,
  requestType: perdiem_pb.Trip,
  responseType: common_pb.Empty
};

PerDiemService.BatchGetTrips = {
  methodName: "BatchGetTrips",
  service: PerDiemService,
  requestStream: false,
  responseStream: false,
  requestType: perdiem_pb.Trip,
  responseType: perdiem_pb.TripList
};

PerDiemService.GetTotalRowTripDistance = {
  methodName: "GetTotalRowTripDistance",
  service: PerDiemService,
  requestStream: false,
  responseStream: false,
  requestType: common_pb.Int32,
  responseType: common_pb.Double
};

PerDiemService.BatchDeleteTrips = {
  methodName: "BatchDeleteTrips",
  service: PerDiemService,
  requestStream: false,
  responseStream: false,
  requestType: perdiem_pb.Trip,
  responseType: perdiem_pb.Trip
};

PerDiemService.BatchGetPerDiemsByIds = {
  methodName: "BatchGetPerDiemsByIds",
  service: PerDiemService,
  requestStream: false,
  responseStream: false,
  requestType: common_pb.IntArray,
  responseType: perdiem_pb.PerDiemList
};

PerDiemService.GetDebugSQLOutput = {
  methodName: "GetDebugSQLOutput",
  service: PerDiemService,
  requestStream: false,
  responseStream: false,
  requestType: perdiem_pb.SQLRequest,
  responseType: common_pb.String
};

exports.PerDiemService = PerDiemService;

function PerDiemServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

PerDiemServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PerDiemService.Create, {
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

PerDiemServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PerDiemService.Get, {
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

PerDiemServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PerDiemService.BatchGet, {
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

PerDiemServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PerDiemService.Update, {
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

PerDiemServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PerDiemService.Delete, {
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

PerDiemServiceClient.prototype.createRow = function createRow(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PerDiemService.CreateRow, {
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

PerDiemServiceClient.prototype.updateRow = function updateRow(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PerDiemService.UpdateRow, {
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

PerDiemServiceClient.prototype.getRow = function getRow(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PerDiemService.GetRow, {
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

PerDiemServiceClient.prototype.deleteRow = function deleteRow(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PerDiemService.DeleteRow, {
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

PerDiemServiceClient.prototype.getPerDiemReport = function getPerDiemReport(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PerDiemService.GetPerDiemReport, {
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

PerDiemServiceClient.prototype.createTrip = function createTrip(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PerDiemService.CreateTrip, {
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

PerDiemServiceClient.prototype.updateTrip = function updateTrip(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PerDiemService.UpdateTrip, {
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

PerDiemServiceClient.prototype.getTrip = function getTrip(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PerDiemService.GetTrip, {
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

PerDiemServiceClient.prototype.deleteTrip = function deleteTrip(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PerDiemService.DeleteTrip, {
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

PerDiemServiceClient.prototype.batchGetTrips = function batchGetTrips(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PerDiemService.BatchGetTrips, {
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

PerDiemServiceClient.prototype.getTotalRowTripDistance = function getTotalRowTripDistance(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PerDiemService.GetTotalRowTripDistance, {
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

PerDiemServiceClient.prototype.batchDeleteTrips = function batchDeleteTrips(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PerDiemService.BatchDeleteTrips, {
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

PerDiemServiceClient.prototype.batchGetPerDiemsByIds = function batchGetPerDiemsByIds(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PerDiemService.BatchGetPerDiemsByIds, {
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

PerDiemServiceClient.prototype.getDebugSQLOutput = function getDebugSQLOutput(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PerDiemService.GetDebugSQLOutput, {
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

exports.PerDiemServiceClient = PerDiemServiceClient;

