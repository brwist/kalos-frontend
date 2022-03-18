// package: 
// file: internal_document.proto

var internal_document_pb = require("./internal_document_pb");
var common_pb = require("./common_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var InternalDocumentService = (function () {
  function InternalDocumentService() {}
  InternalDocumentService.serviceName = "InternalDocumentService";
  return InternalDocumentService;
}());

InternalDocumentService.Create = {
  methodName: "Create",
  service: InternalDocumentService,
  requestStream: false,
  responseStream: false,
  requestType: internal_document_pb.InternalDocument,
  responseType: internal_document_pb.InternalDocument
};

InternalDocumentService.Get = {
  methodName: "Get",
  service: InternalDocumentService,
  requestStream: false,
  responseStream: false,
  requestType: internal_document_pb.InternalDocument,
  responseType: internal_document_pb.InternalDocument
};

InternalDocumentService.BatchGet = {
  methodName: "BatchGet",
  service: InternalDocumentService,
  requestStream: false,
  responseStream: false,
  requestType: internal_document_pb.InternalDocument,
  responseType: internal_document_pb.InternalDocumentList
};

InternalDocumentService.List = {
  methodName: "List",
  service: InternalDocumentService,
  requestStream: false,
  responseStream: true,
  requestType: internal_document_pb.InternalDocument,
  responseType: internal_document_pb.InternalDocument
};

InternalDocumentService.Update = {
  methodName: "Update",
  service: InternalDocumentService,
  requestStream: false,
  responseStream: false,
  requestType: internal_document_pb.InternalDocument,
  responseType: internal_document_pb.InternalDocument
};

InternalDocumentService.Delete = {
  methodName: "Delete",
  service: InternalDocumentService,
  requestStream: false,
  responseStream: false,
  requestType: internal_document_pb.InternalDocument,
  responseType: internal_document_pb.InternalDocument
};

InternalDocumentService.GetDocumentKeys = {
  methodName: "GetDocumentKeys",
  service: InternalDocumentService,
  requestStream: false,
  responseStream: false,
  requestType: internal_document_pb.DocumentKey,
  responseType: internal_document_pb.DocumentKeyList
};

InternalDocumentService.WriteDocumentKey = {
  methodName: "WriteDocumentKey",
  service: InternalDocumentService,
  requestStream: false,
  responseStream: false,
  requestType: internal_document_pb.DocumentKey,
  responseType: internal_document_pb.DocumentKey
};

InternalDocumentService.DeleteDocumentKey = {
  methodName: "DeleteDocumentKey",
  service: InternalDocumentService,
  requestStream: false,
  responseStream: false,
  requestType: internal_document_pb.DocumentKey,
  responseType: common_pb.Empty
};

exports.InternalDocumentService = InternalDocumentService;

function InternalDocumentServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

InternalDocumentServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(InternalDocumentService.Create, {
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

InternalDocumentServiceClient.prototype.get = function get(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(InternalDocumentService.Get, {
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

InternalDocumentServiceClient.prototype.batchGet = function batchGet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(InternalDocumentService.BatchGet, {
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

InternalDocumentServiceClient.prototype.list = function list(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(InternalDocumentService.List, {
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

InternalDocumentServiceClient.prototype.update = function update(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(InternalDocumentService.Update, {
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

InternalDocumentServiceClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(InternalDocumentService.Delete, {
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

InternalDocumentServiceClient.prototype.getDocumentKeys = function getDocumentKeys(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(InternalDocumentService.GetDocumentKeys, {
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

InternalDocumentServiceClient.prototype.writeDocumentKey = function writeDocumentKey(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(InternalDocumentService.WriteDocumentKey, {
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

InternalDocumentServiceClient.prototype.deleteDocumentKey = function deleteDocumentKey(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(InternalDocumentService.DeleteDocumentKey, {
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

exports.InternalDocumentServiceClient = InternalDocumentServiceClient;

