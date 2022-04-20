// package: 
// file: job_subtype.proto

var job_subtype_pb = require("./job_subtype_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var JobSubtypeService = (function () {
  function JobSubtypeService() {}
  JobSubtypeService.serviceName = "JobSubtypeService";
  return JobSubtypeService;
}());

JobSubtypeService.Get = {
  methodName: "Get",
  service: JobSubtypeService,
  requestStream: false,
  responseStream: false,
  requestType: job_subtype_pb.JobSubtype,
  responseType: job_subtype_pb.JobSubtype
};

JobSubtypeService.BatchGet = {
  methodName: "BatchGet",
  service: JobSubtypeService,
  requestStream: false,
  responseStream: false,
  requestType: job_subtype_pb.JobSubtype,
  responseType: job_subtype_pb.JobSubtypeList
};

JobSubtypeService.List = {
  methodName: "List",
  service: JobSubtypeService,
  requestStream: false,
  responseStream: true,
  requestType: job_subtype_pb.JobSubtype,
  responseType: job_subtype_pb.JobSubtype
};

exports.JobSubtypeService = JobSubtypeService;

function JobSubtypeServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

JobSubtypeServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JobSubtypeService.Get, {
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

JobSubtypeServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JobSubtypeService.BatchGet, {
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

JobSubtypeServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(JobSubtypeService.List, {
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

exports.JobSubtypeServiceClient = JobSubtypeServiceClient;

