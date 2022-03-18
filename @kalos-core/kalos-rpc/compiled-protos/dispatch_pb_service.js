// package: 
// file: dispatch.proto

var dispatch_pb = require("./dispatch_pb");
var common_pb = require("./common_pb");
var timeoff_request_pb = require("./timeoff_request_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var DispatchService = (function () {
  function DispatchService() {}
  DispatchService.serviceName = "DispatchService";
  return DispatchService;
}());

DispatchService.GetDispatchableTechnicians = {
  methodName: "GetDispatchableTechnicians",
  service: DispatchService,
  requestStream: false,
  responseStream: false,
  requestType: dispatch_pb.DispatchableTech,
  responseType: dispatch_pb.DispatchableTechList
};

DispatchService.GetDispatchCalls = {
  methodName: "GetDispatchCalls",
  service: DispatchService,
  requestStream: false,
  responseStream: false,
  requestType: dispatch_pb.DispatchCall,
  responseType: dispatch_pb.DispatchCallList
};

DispatchService.GetTimeoffData = {
  methodName: "GetTimeoffData",
  service: DispatchService,
  requestStream: false,
  responseStream: false,
  requestType: timeoff_request_pb.TimeoffRequest,
  responseType: timeoff_request_pb.TimeoffRequestList
};

DispatchService.GetDispatchCallBacks = {
  methodName: "GetDispatchCallBacks",
  service: DispatchService,
  requestStream: false,
  responseStream: false,
  requestType: common_pb.DateRange,
  responseType: dispatch_pb.DispatchCallBacksList
};

DispatchService.GetDispatchCallTimes = {
  methodName: "GetDispatchCallTimes",
  service: DispatchService,
  requestStream: false,
  responseStream: false,
  requestType: common_pb.DateRange,
  responseType: dispatch_pb.DispatchCallTimeList
};

DispatchService.GetDispatchCallCount = {
  methodName: "GetDispatchCallCount",
  service: DispatchService,
  requestStream: false,
  responseStream: false,
  requestType: common_pb.DateRange,
  responseType: dispatch_pb.DispatchCallCountList
};

DispatchService.GetDispatchFirstCall = {
  methodName: "GetDispatchFirstCall",
  service: DispatchService,
  requestStream: false,
  responseStream: false,
  requestType: common_pb.Empty,
  responseType: dispatch_pb.DispatchFirstCallList
};

exports.DispatchService = DispatchService;

function DispatchServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

DispatchServiceClient.prototype.getDispatchableTechnicians = function getDispatchableTechnicians(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(DispatchService.GetDispatchableTechnicians, {
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

DispatchServiceClient.prototype.getDispatchCalls = function getDispatchCalls(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(DispatchService.GetDispatchCalls, {
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

DispatchServiceClient.prototype.getTimeoffData = function getTimeoffData(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(DispatchService.GetTimeoffData, {
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

DispatchServiceClient.prototype.getDispatchCallBacks = function getDispatchCallBacks(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(DispatchService.GetDispatchCallBacks, {
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

DispatchServiceClient.prototype.getDispatchCallTimes = function getDispatchCallTimes(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(DispatchService.GetDispatchCallTimes, {
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

DispatchServiceClient.prototype.getDispatchCallCount = function getDispatchCallCount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(DispatchService.GetDispatchCallCount, {
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

DispatchServiceClient.prototype.getDispatchFirstCall = function getDispatchFirstCall(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(DispatchService.GetDispatchFirstCall, {
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

exports.DispatchServiceClient = DispatchServiceClient;

