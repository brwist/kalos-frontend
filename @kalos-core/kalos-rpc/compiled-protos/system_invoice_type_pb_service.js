// package: 
// file: system_invoice_type.proto

var system_invoice_type_pb = require("./system_invoice_type_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var SystemInvoiceTypeService = (function () {
  function SystemInvoiceTypeService() {}
  SystemInvoiceTypeService.serviceName = "SystemInvoiceTypeService";
  return SystemInvoiceTypeService;
}());

SystemInvoiceTypeService.Create = {
  methodName: "Create",
  service: SystemInvoiceTypeService,
  requestStream: false,
  responseStream: false,
  requestType: system_invoice_type_pb.SystemInvoiceType,
  responseType: system_invoice_type_pb.SystemInvoiceType
};

SystemInvoiceTypeService.Get = {
  methodName: "Get",
  service: SystemInvoiceTypeService,
  requestStream: false,
  responseStream: false,
  requestType: system_invoice_type_pb.SystemInvoiceType,
  responseType: system_invoice_type_pb.SystemInvoiceType
};

SystemInvoiceTypeService.BatchGet = {
  methodName: "BatchGet",
  service: SystemInvoiceTypeService,
  requestStream: false,
  responseStream: false,
  requestType: system_invoice_type_pb.SystemInvoiceType,
  responseType: system_invoice_type_pb.SystemInvoiceTypeList
};

SystemInvoiceTypeService.List = {
  methodName: "List",
  service: SystemInvoiceTypeService,
  requestStream: false,
  responseStream: true,
  requestType: system_invoice_type_pb.SystemInvoiceType,
  responseType: system_invoice_type_pb.SystemInvoiceType
};

SystemInvoiceTypeService.Update = {
  methodName: "Update",
  service: SystemInvoiceTypeService,
  requestStream: false,
  responseStream: false,
  requestType: system_invoice_type_pb.SystemInvoiceType,
  responseType: system_invoice_type_pb.SystemInvoiceType
};

SystemInvoiceTypeService.Delete = {
  methodName: "Delete",
  service: SystemInvoiceTypeService,
  requestStream: false,
  responseStream: false,
  requestType: system_invoice_type_pb.SystemInvoiceType,
  responseType: system_invoice_type_pb.SystemInvoiceType
};

exports.SystemInvoiceTypeService = SystemInvoiceTypeService;

function SystemInvoiceTypeServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

SystemInvoiceTypeServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SystemInvoiceTypeService.Create, {
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

SystemInvoiceTypeServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SystemInvoiceTypeService.Get, {
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

SystemInvoiceTypeServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SystemInvoiceTypeService.BatchGet, {
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

SystemInvoiceTypeServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(SystemInvoiceTypeService.List, {
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

SystemInvoiceTypeServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SystemInvoiceTypeService.Update, {
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

SystemInvoiceTypeServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SystemInvoiceTypeService.Delete, {
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

exports.SystemInvoiceTypeServiceClient = SystemInvoiceTypeServiceClient;

