// package: 
// file: email.proto

var email_pb = require("./email_pb");
var common_pb = require("./common_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var EmailService = (function () {
  function EmailService() {}
  EmailService.serviceName = "EmailService";
  return EmailService;
}());

EmailService.Create = {
  methodName: "Create",
  service: EmailService,
  requestStream: false,
  responseStream: false,
  requestType: email_pb.Email,
  responseType: email_pb.Email
};

EmailService.SendSQS = {
  methodName: "SendSQS",
  service: EmailService,
  requestStream: false,
  responseStream: false,
  requestType: email_pb.SQSEmail,
  responseType: common_pb.Bool
};

EmailService.SendSQSInvoiceEmail = {
  methodName: "SendSQSInvoiceEmail",
  service: EmailService,
  requestStream: false,
  responseStream: false,
  requestType: email_pb.SQSEmailAndDocument,
  responseType: common_pb.Bool
};

EmailService.GetInvoiceBody = {
  methodName: "GetInvoiceBody",
  service: EmailService,
  requestStream: false,
  responseStream: false,
  requestType: email_pb.InvoiceBodyRequest,
  responseType: common_pb.String
};

exports.EmailService = EmailService;

function EmailServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

EmailServiceClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EmailService.Create, {
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

EmailServiceClient.prototype.sendSQS = function sendSQS(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EmailService.SendSQS, {
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

EmailServiceClient.prototype.sendSQSInvoiceEmail = function sendSQSInvoiceEmail(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EmailService.SendSQSInvoiceEmail, {
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

EmailServiceClient.prototype.getInvoiceBody = function getInvoiceBody(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EmailService.GetInvoiceBody, {
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

exports.EmailServiceClient = EmailServiceClient;

