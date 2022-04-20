// source: phone_call_log.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.PhoneCallLog', null, global);
goog.exportSymbol('proto.PhoneCallLogList', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.PhoneCallLog = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.PhoneCallLog.repeatedFields_, null);
};
goog.inherits(proto.PhoneCallLog, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.PhoneCallLog.displayName = 'proto.PhoneCallLog';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.PhoneCallLogList = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.PhoneCallLogList.repeatedFields_, null);
};
goog.inherits(proto.PhoneCallLogList, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.PhoneCallLogList.displayName = 'proto.PhoneCallLogList';
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.PhoneCallLog.repeatedFields_ = [8];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.PhoneCallLog.prototype.toObject = function(opt_includeInstance) {
  return proto.PhoneCallLog.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.PhoneCallLog} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.PhoneCallLog.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, 0),
    jiveCallId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    callTimestamp: jspb.Message.getFieldWithDefault(msg, 3, ""),
    dialedNumber: jspb.Message.getFieldWithDefault(msg, 4, ""),
    callerIdName: jspb.Message.getFieldWithDefault(msg, 5, ""),
    callerIdNumber: jspb.Message.getFieldWithDefault(msg, 6, ""),
    phoneCallRecordingLink: jspb.Message.getFieldWithDefault(msg, 7, ""),
    fieldMaskList: (f = jspb.Message.getRepeatedField(msg, 8)) == null ? undefined : f,
    pageNumber: jspb.Message.getFieldWithDefault(msg, 9, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.PhoneCallLog}
 */
proto.PhoneCallLog.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.PhoneCallLog;
  return proto.PhoneCallLog.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.PhoneCallLog} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.PhoneCallLog}
 */
proto.PhoneCallLog.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setJiveCallId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setCallTimestamp(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setDialedNumber(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setCallerIdName(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setCallerIdNumber(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setPhoneCallRecordingLink(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.addFieldMask(value);
      break;
    case 9:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setPageNumber(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.PhoneCallLog.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.PhoneCallLog.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.PhoneCallLog} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.PhoneCallLog.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getJiveCallId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getCallTimestamp();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getDialedNumber();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getCallerIdName();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getCallerIdNumber();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getPhoneCallRecordingLink();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
  f = message.getFieldMaskList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      8,
      f
    );
  }
  f = message.getPageNumber();
  if (f !== 0) {
    writer.writeInt32(
      9,
      f
    );
  }
};


/**
 * optional int32 id = 1;
 * @return {number}
 */
proto.PhoneCallLog.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.PhoneCallLog} returns this
 */
proto.PhoneCallLog.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string jive_call_id = 2;
 * @return {string}
 */
proto.PhoneCallLog.prototype.getJiveCallId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.PhoneCallLog} returns this
 */
proto.PhoneCallLog.prototype.setJiveCallId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string call_timestamp = 3;
 * @return {string}
 */
proto.PhoneCallLog.prototype.getCallTimestamp = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.PhoneCallLog} returns this
 */
proto.PhoneCallLog.prototype.setCallTimestamp = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string dialed_number = 4;
 * @return {string}
 */
proto.PhoneCallLog.prototype.getDialedNumber = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.PhoneCallLog} returns this
 */
proto.PhoneCallLog.prototype.setDialedNumber = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string caller_id_name = 5;
 * @return {string}
 */
proto.PhoneCallLog.prototype.getCallerIdName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.PhoneCallLog} returns this
 */
proto.PhoneCallLog.prototype.setCallerIdName = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string caller_id_number = 6;
 * @return {string}
 */
proto.PhoneCallLog.prototype.getCallerIdNumber = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.PhoneCallLog} returns this
 */
proto.PhoneCallLog.prototype.setCallerIdNumber = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional string phone_call_recording_link = 7;
 * @return {string}
 */
proto.PhoneCallLog.prototype.getPhoneCallRecordingLink = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * @param {string} value
 * @return {!proto.PhoneCallLog} returns this
 */
proto.PhoneCallLog.prototype.setPhoneCallRecordingLink = function(value) {
  return jspb.Message.setProto3StringField(this, 7, value);
};


/**
 * repeated string field_mask = 8;
 * @return {!Array<string>}
 */
proto.PhoneCallLog.prototype.getFieldMaskList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 8));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.PhoneCallLog} returns this
 */
proto.PhoneCallLog.prototype.setFieldMaskList = function(value) {
  return jspb.Message.setField(this, 8, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.PhoneCallLog} returns this
 */
proto.PhoneCallLog.prototype.addFieldMask = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 8, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.PhoneCallLog} returns this
 */
proto.PhoneCallLog.prototype.clearFieldMaskList = function() {
  return this.setFieldMaskList([]);
};


/**
 * optional int32 page_number = 9;
 * @return {number}
 */
proto.PhoneCallLog.prototype.getPageNumber = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 9, 0));
};


/**
 * @param {number} value
 * @return {!proto.PhoneCallLog} returns this
 */
proto.PhoneCallLog.prototype.setPageNumber = function(value) {
  return jspb.Message.setProto3IntField(this, 9, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.PhoneCallLogList.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.PhoneCallLogList.prototype.toObject = function(opt_includeInstance) {
  return proto.PhoneCallLogList.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.PhoneCallLogList} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.PhoneCallLogList.toObject = function(includeInstance, msg) {
  var f, obj = {
    resultsList: jspb.Message.toObjectList(msg.getResultsList(),
    proto.PhoneCallLog.toObject, includeInstance),
    totalCount: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.PhoneCallLogList}
 */
proto.PhoneCallLogList.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.PhoneCallLogList;
  return proto.PhoneCallLogList.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.PhoneCallLogList} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.PhoneCallLogList}
 */
proto.PhoneCallLogList.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.PhoneCallLog;
      reader.readMessage(value,proto.PhoneCallLog.deserializeBinaryFromReader);
      msg.addResults(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setTotalCount(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.PhoneCallLogList.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.PhoneCallLogList.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.PhoneCallLogList} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.PhoneCallLogList.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getResultsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.PhoneCallLog.serializeBinaryToWriter
    );
  }
  f = message.getTotalCount();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
};


/**
 * repeated PhoneCallLog results = 1;
 * @return {!Array<!proto.PhoneCallLog>}
 */
proto.PhoneCallLogList.prototype.getResultsList = function() {
  return /** @type{!Array<!proto.PhoneCallLog>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.PhoneCallLog, 1));
};


/**
 * @param {!Array<!proto.PhoneCallLog>} value
 * @return {!proto.PhoneCallLogList} returns this
*/
proto.PhoneCallLogList.prototype.setResultsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.PhoneCallLog=} opt_value
 * @param {number=} opt_index
 * @return {!proto.PhoneCallLog}
 */
proto.PhoneCallLogList.prototype.addResults = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.PhoneCallLog, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.PhoneCallLogList} returns this
 */
proto.PhoneCallLogList.prototype.clearResultsList = function() {
  return this.setResultsList([]);
};


/**
 * optional int32 total_count = 2;
 * @return {number}
 */
proto.PhoneCallLogList.prototype.getTotalCount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.PhoneCallLogList} returns this
 */
proto.PhoneCallLogList.prototype.setTotalCount = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


goog.object.extend(exports, proto);
