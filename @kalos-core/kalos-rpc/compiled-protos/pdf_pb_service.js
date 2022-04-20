// package: 
// file: pdf.proto

var pdf_pb = require("./pdf_pb");
var s3_pb = require("./s3_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var PDFService = (function () {
  function PDFService() {}
  PDFService.serviceName = "PDFService";
  return PDFService;
}());

PDFService.Create = {
  methodName: "Create",
  service: PDFService,
  requestStream: false,
  responseStream: false,
  requestType: pdf_pb.HTML,
  responseType: s3_pb.URLObject
};

exports.PDFService = PDFService;

function PDFServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

PDFServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PDFService.Create, {
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

exports.PDFServiceClient = PDFServiceClient;

