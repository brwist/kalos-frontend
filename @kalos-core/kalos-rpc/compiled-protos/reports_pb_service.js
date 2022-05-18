// package: 
// file: reports.proto

var reports_pb = require("./reports_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var ReportService = (function () {
  function ReportService() {}
  ReportService.serviceName = "ReportService";
  return ReportService;
}());

ReportService.GetSpiffReportData = {
  methodName: "GetSpiffReportData",
  service: ReportService,
  requestStream: false,
  responseStream: false,
  requestType: reports_pb.SpiffReportLine,
  responseType: reports_pb.SpiffReport
};

ReportService.GetPromptPaymentData = {
  methodName: "GetPromptPaymentData",
  service: ReportService,
  requestStream: false,
  responseStream: false,
  requestType: reports_pb.PromptPaymentReportLine,
  responseType: reports_pb.PromptPaymentReport
};

ReportService.GetTransactionDumpData = {
  methodName: "GetTransactionDumpData",
  service: ReportService,
  requestStream: false,
  responseStream: false,
  requestType: reports_pb.TransactionReportLine,
  responseType: reports_pb.TransactionDumpReport
};

ReportService.GetTimeoffReportData = {
  methodName: "GetTimeoffReportData",
  service: ReportService,
  requestStream: false,
  responseStream: false,
  requestType: reports_pb.TimeoffReportRequest,
  responseType: reports_pb.TimeoffReport
};

ReportService.GetReceiptJournalReport = {
  methodName: "GetReceiptJournalReport",
  service: ReportService,
  requestStream: false,
  responseStream: false,
  requestType: reports_pb.ReceiptJournalReportLine,
  responseType: reports_pb.ReceiptJournalReport
};

ReportService.GetSalesJournalReport = {
  methodName: "GetSalesJournalReport",
  service: ReportService,
  requestStream: false,
  responseStream: false,
  requestType: reports_pb.SalesJournalReportLine,
  responseType: reports_pb.SalesJournalReport
};

exports.ReportService = ReportService;

function ReportServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

ReportServiceClient.prototype.getSpiffReportData = function getSpiffReportData(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ReportService.GetSpiffReportData, {
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

ReportServiceClient.prototype.getPromptPaymentData = function getPromptPaymentData(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ReportService.GetPromptPaymentData, {
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

ReportServiceClient.prototype.getTransactionDumpData = function getTransactionDumpData(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ReportService.GetTransactionDumpData, {
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

ReportServiceClient.prototype.getTimeoffReportData = function getTimeoffReportData(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ReportService.GetTimeoffReportData, {
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

ReportServiceClient.prototype.getReceiptJournalReport = function getReceiptJournalReport(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ReportService.GetReceiptJournalReport, {
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

ReportServiceClient.prototype.getSalesJournalReport = function getSalesJournalReport(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ReportService.GetSalesJournalReport, {
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

exports.ReportServiceClient = ReportServiceClient;

