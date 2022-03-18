// package: 
// file: job_type.proto

var job_type_pb = require("./job_type_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var JobTypeService = (function () {
  function JobTypeService() {}
  JobTypeService.serviceName = "JobTypeService";
  return JobTypeService;
}());

JobTypeService.Get = {
  methodName: "Get",
  service: JobTypeService,
  requestStream: false,
  responseStream: false,
  requestType: job_type_pb.JobType,
  responseType: job_type_pb.JobType
};

JobTypeService.BatchGet = {
  methodName: "BatchGet",
  service: JobTypeService,
  requestStream: false,
  responseStream: false,
  requestType: job_type_pb.JobType,
  responseType: job_type_pb.JobTypeList
};

JobTypeService.List = {
  methodName: "List",
  service: JobTypeService,
  requestStream: false,
  responseStream: true,
  requestType: job_type_pb.JobType,
  responseType: job_type_pb.JobType
};

exports.JobTypeService = JobTypeService;

function JobTypeServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

JobTypeServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JobTypeService.Get, {
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

JobTypeServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JobTypeService.BatchGet, {
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

JobTypeServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(JobTypeService.List, {
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

exports.JobTypeServiceClient = JobTypeServiceClient;

