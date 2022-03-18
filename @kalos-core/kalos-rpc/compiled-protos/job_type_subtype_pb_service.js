// package: 
// file: job_type_subtype.proto

var job_type_subtype_pb = require("./job_type_subtype_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var JobTypeSubtypeService = (function () {
  function JobTypeSubtypeService() {}
  JobTypeSubtypeService.serviceName = "JobTypeSubtypeService";
  return JobTypeSubtypeService;
}());

JobTypeSubtypeService.Create = {
  methodName: "Create",
  service: JobTypeSubtypeService,
  requestStream: false,
  responseStream: false,
  requestType: job_type_subtype_pb.JobTypeSubtype,
  responseType: job_type_subtype_pb.JobTypeSubtype
};

JobTypeSubtypeService.Get = {
  methodName: "Get",
  service: JobTypeSubtypeService,
  requestStream: false,
  responseStream: false,
  requestType: job_type_subtype_pb.JobTypeSubtype,
  responseType: job_type_subtype_pb.JobTypeSubtype
};

JobTypeSubtypeService.BatchGet = {
  methodName: "BatchGet",
  service: JobTypeSubtypeService,
  requestStream: false,
  responseStream: false,
  requestType: job_type_subtype_pb.JobTypeSubtype,
  responseType: job_type_subtype_pb.JobTypeSubtypeList
};

JobTypeSubtypeService.List = {
  methodName: "List",
  service: JobTypeSubtypeService,
  requestStream: false,
  responseStream: true,
  requestType: job_type_subtype_pb.JobTypeSubtype,
  responseType: job_type_subtype_pb.JobTypeSubtype
};

JobTypeSubtypeService.Update = {
  methodName: "Update",
  service: JobTypeSubtypeService,
  requestStream: false,
  responseStream: false,
  requestType: job_type_subtype_pb.JobTypeSubtype,
  responseType: job_type_subtype_pb.JobTypeSubtype
};

JobTypeSubtypeService.Delete = {
  methodName: "Delete",
  service: JobTypeSubtypeService,
  requestStream: false,
  responseStream: false,
  requestType: job_type_subtype_pb.JobTypeSubtype,
  responseType: job_type_subtype_pb.JobTypeSubtype
};

exports.JobTypeSubtypeService = JobTypeSubtypeService;

function JobTypeSubtypeServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

JobTypeSubtypeServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JobTypeSubtypeService.Create, {
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

JobTypeSubtypeServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JobTypeSubtypeService.Get, {
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

JobTypeSubtypeServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JobTypeSubtypeService.BatchGet, {
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

JobTypeSubtypeServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(JobTypeSubtypeService.List, {
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

JobTypeSubtypeServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JobTypeSubtypeService.Update, {
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

JobTypeSubtypeServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JobTypeSubtypeService.Delete, {
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

exports.JobTypeSubtypeServiceClient = JobTypeSubtypeServiceClient;

