// package: 
// file: maintenance_question.proto

var maintenance_question_pb = require("./maintenance_question_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var MaintenanceQuestionService = (function () {
  function MaintenanceQuestionService() {}
  MaintenanceQuestionService.serviceName = "MaintenanceQuestionService";
  return MaintenanceQuestionService;
}());

MaintenanceQuestionService.Create = {
  methodName: "Create",
  service: MaintenanceQuestionService,
  requestStream: false,
  responseStream: false,
  requestType: maintenance_question_pb.MaintenanceQuestion,
  responseType: maintenance_question_pb.MaintenanceQuestion
};

MaintenanceQuestionService.Get = {
  methodName: "Get",
  service: MaintenanceQuestionService,
  requestStream: false,
  responseStream: false,
  requestType: maintenance_question_pb.MaintenanceQuestion,
  responseType: maintenance_question_pb.MaintenanceQuestion
};

MaintenanceQuestionService.BatchGet = {
  methodName: "BatchGet",
  service: MaintenanceQuestionService,
  requestStream: false,
  responseStream: false,
  requestType: maintenance_question_pb.MaintenanceQuestion,
  responseType: maintenance_question_pb.MaintenanceQuestionList
};

MaintenanceQuestionService.List = {
  methodName: "List",
  service: MaintenanceQuestionService,
  requestStream: false,
  responseStream: true,
  requestType: maintenance_question_pb.MaintenanceQuestion,
  responseType: maintenance_question_pb.MaintenanceQuestion
};

MaintenanceQuestionService.Update = {
  methodName: "Update",
  service: MaintenanceQuestionService,
  requestStream: false,
  responseStream: false,
  requestType: maintenance_question_pb.MaintenanceQuestion,
  responseType: maintenance_question_pb.MaintenanceQuestion
};

MaintenanceQuestionService.Delete = {
  methodName: "Delete",
  service: MaintenanceQuestionService,
  requestStream: false,
  responseStream: false,
  requestType: maintenance_question_pb.MaintenanceQuestion,
  responseType: maintenance_question_pb.MaintenanceQuestion
};

exports.MaintenanceQuestionService = MaintenanceQuestionService;

function MaintenanceQuestionServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

MaintenanceQuestionServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MaintenanceQuestionService.Create, {
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

MaintenanceQuestionServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MaintenanceQuestionService.Get, {
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

MaintenanceQuestionServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MaintenanceQuestionService.BatchGet, {
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

MaintenanceQuestionServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(MaintenanceQuestionService.List, {
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

MaintenanceQuestionServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MaintenanceQuestionService.Update, {
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

MaintenanceQuestionServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MaintenanceQuestionService.Delete, {
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

exports.MaintenanceQuestionServiceClient = MaintenanceQuestionServiceClient;

