// package: 
// file: metrics.proto

var metrics_pb = require("./metrics_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var MetricsService = (function () {
  function MetricsService() {}
  MetricsService.serviceName = "MetricsService";
  return MetricsService;
}());

MetricsService.GetBillable = {
  methodName: "GetBillable",
  service: MetricsService,
  requestStream: false,
  responseStream: false,
  requestType: metrics_pb.Billable,
  responseType: metrics_pb.Billable
};

MetricsService.ListBillable = {
  methodName: "ListBillable",
  service: MetricsService,
  requestStream: false,
  responseStream: true,
  requestType: metrics_pb.Billable,
  responseType: metrics_pb.Billable
};

MetricsService.GetAvgTicket = {
  methodName: "GetAvgTicket",
  service: MetricsService,
  requestStream: false,
  responseStream: false,
  requestType: metrics_pb.AvgTicket,
  responseType: metrics_pb.AvgTicket
};

MetricsService.ListAvgTicket = {
  methodName: "ListAvgTicket",
  service: MetricsService,
  requestStream: false,
  responseStream: true,
  requestType: metrics_pb.AvgTicket,
  responseType: metrics_pb.AvgTicket
};

MetricsService.GetCallbacks = {
  methodName: "GetCallbacks",
  service: MetricsService,
  requestStream: false,
  responseStream: false,
  requestType: metrics_pb.Callbacks,
  responseType: metrics_pb.Callbacks
};

MetricsService.ListCallbacks = {
  methodName: "ListCallbacks",
  service: MetricsService,
  requestStream: false,
  responseStream: true,
  requestType: metrics_pb.Callbacks,
  responseType: metrics_pb.Callbacks
};

MetricsService.GetRevenue = {
  methodName: "GetRevenue",
  service: MetricsService,
  requestStream: false,
  responseStream: false,
  requestType: metrics_pb.Revenue,
  responseType: metrics_pb.Revenue
};

MetricsService.ListRevenue = {
  methodName: "ListRevenue",
  service: MetricsService,
  requestStream: false,
  responseStream: true,
  requestType: metrics_pb.Revenue,
  responseType: metrics_pb.Revenue
};

MetricsService.BatchGetMetricReportData = {
  methodName: "BatchGetMetricReportData",
  service: MetricsService,
  requestStream: false,
  responseStream: false,
  requestType: metrics_pb.MertricReportDataRequest,
  responseType: metrics_pb.MetricReportDataList
};

exports.MetricsService = MetricsService;

function MetricsServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

MetricsServiceClient.prototype.getBillable = function getBillable(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MetricsService.GetBillable, {
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

MetricsServiceClient.prototype.listBillable = function listBillable(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(MetricsService.ListBillable, {
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

MetricsServiceClient.prototype.getAvgTicket = function getAvgTicket(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MetricsService.GetAvgTicket, {
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

MetricsServiceClient.prototype.listAvgTicket = function listAvgTicket(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(MetricsService.ListAvgTicket, {
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

MetricsServiceClient.prototype.getCallbacks = function getCallbacks(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MetricsService.GetCallbacks, {
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

MetricsServiceClient.prototype.listCallbacks = function listCallbacks(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(MetricsService.ListCallbacks, {
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

MetricsServiceClient.prototype.getRevenue = function getRevenue(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MetricsService.GetRevenue, {
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

MetricsServiceClient.prototype.listRevenue = function listRevenue(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(MetricsService.ListRevenue, {
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

MetricsServiceClient.prototype.batchGetMetricReportData = function batchGetMetricReportData(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MetricsService.BatchGetMetricReportData, {
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

exports.MetricsServiceClient = MetricsServiceClient;

