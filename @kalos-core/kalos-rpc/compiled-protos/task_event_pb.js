// source: task_event.proto
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

goog.exportSymbol('proto.TaskEvent', null, global);
goog.exportSymbol('proto.TaskEventList', null, global);
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
proto.TaskEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.TaskEvent.repeatedFields_, null);
};
goog.inherits(proto.TaskEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.TaskEvent.displayName = 'proto.TaskEvent';
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
proto.TaskEventList = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.TaskEventList.repeatedFields_, null);
};
goog.inherits(proto.TaskEventList, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.TaskEventList.displayName = 'proto.TaskEventList';
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.TaskEvent.repeatedFields_ = [10];



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
proto.TaskEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.TaskEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.TaskEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TaskEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, 0),
    taskId: jspb.Message.getFieldWithDefault(msg, 2, 0),
    statusId: jspb.Message.getFieldWithDefault(msg, 3, 0),
    actionTaken: jspb.Message.getFieldWithDefault(msg, 4, ""),
    actionNeeded: jspb.Message.getFieldWithDefault(msg, 5, ""),
    timeStarted: jspb.Message.getFieldWithDefault(msg, 6, ""),
    timeFinished: jspb.Message.getFieldWithDefault(msg, 7, ""),
    technicianUserId: jspb.Message.getFieldWithDefault(msg, 8, 0),
    isActive: jspb.Message.getBooleanFieldWithDefault(msg, 9, false),
    fieldMaskList: (f = jspb.Message.getRepeatedField(msg, 10)) == null ? undefined : f,
    pageNumber: jspb.Message.getFieldWithDefault(msg, 11, 0),
    orderBy: jspb.Message.getFieldWithDefault(msg, 12, ""),
    orderDir: jspb.Message.getFieldWithDefault(msg, 13, ""),
    latitude: jspb.Message.getFloatingPointFieldWithDefault(msg, 14, 0.0),
    longitude: jspb.Message.getFloatingPointFieldWithDefault(msg, 15, 0.0),
    technicianUserName: jspb.Message.getFieldWithDefault(msg, 16, "")
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
 * @return {!proto.TaskEvent}
 */
proto.TaskEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.TaskEvent;
  return proto.TaskEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.TaskEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.TaskEvent}
 */
proto.TaskEvent.deserializeBinaryFromReader = function(msg, reader) {
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
      var value = /** @type {number} */ (reader.readInt32());
      msg.setTaskId(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setStatusId(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setActionTaken(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setActionNeeded(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setTimeStarted(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setTimeFinished(value);
      break;
    case 8:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setTechnicianUserId(value);
      break;
    case 9:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsActive(value);
      break;
    case 10:
      var value = /** @type {string} */ (reader.readString());
      msg.addFieldMask(value);
      break;
    case 11:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setPageNumber(value);
      break;
    case 12:
      var value = /** @type {string} */ (reader.readString());
      msg.setOrderBy(value);
      break;
    case 13:
      var value = /** @type {string} */ (reader.readString());
      msg.setOrderDir(value);
      break;
    case 14:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setLatitude(value);
      break;
    case 15:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setLongitude(value);
      break;
    case 16:
      var value = /** @type {string} */ (reader.readString());
      msg.setTechnicianUserName(value);
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
proto.TaskEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.TaskEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.TaskEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TaskEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getTaskId();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
  f = message.getStatusId();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
  f = message.getActionTaken();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getActionNeeded();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getTimeStarted();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getTimeFinished();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
  f = message.getTechnicianUserId();
  if (f !== 0) {
    writer.writeInt32(
      8,
      f
    );
  }
  f = message.getIsActive();
  if (f) {
    writer.writeBool(
      9,
      f
    );
  }
  f = message.getFieldMaskList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      10,
      f
    );
  }
  f = message.getPageNumber();
  if (f !== 0) {
    writer.writeInt32(
      11,
      f
    );
  }
  f = message.getOrderBy();
  if (f.length > 0) {
    writer.writeString(
      12,
      f
    );
  }
  f = message.getOrderDir();
  if (f.length > 0) {
    writer.writeString(
      13,
      f
    );
  }
  f = message.getLatitude();
  if (f !== 0.0) {
    writer.writeDouble(
      14,
      f
    );
  }
  f = message.getLongitude();
  if (f !== 0.0) {
    writer.writeDouble(
      15,
      f
    );
  }
  f = message.getTechnicianUserName();
  if (f.length > 0) {
    writer.writeString(
      16,
      f
    );
  }
};


/**
 * optional int32 id = 1;
 * @return {number}
 */
proto.TaskEvent.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.TaskEvent} returns this
 */
proto.TaskEvent.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional int32 task_id = 2;
 * @return {number}
 */
proto.TaskEvent.prototype.getTaskId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.TaskEvent} returns this
 */
proto.TaskEvent.prototype.setTaskId = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional int32 status_id = 3;
 * @return {number}
 */
proto.TaskEvent.prototype.getStatusId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.TaskEvent} returns this
 */
proto.TaskEvent.prototype.setStatusId = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional string action_taken = 4;
 * @return {string}
 */
proto.TaskEvent.prototype.getActionTaken = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.TaskEvent} returns this
 */
proto.TaskEvent.prototype.setActionTaken = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string action_needed = 5;
 * @return {string}
 */
proto.TaskEvent.prototype.getActionNeeded = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.TaskEvent} returns this
 */
proto.TaskEvent.prototype.setActionNeeded = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string time_started = 6;
 * @return {string}
 */
proto.TaskEvent.prototype.getTimeStarted = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.TaskEvent} returns this
 */
proto.TaskEvent.prototype.setTimeStarted = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional string time_finished = 7;
 * @return {string}
 */
proto.TaskEvent.prototype.getTimeFinished = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * @param {string} value
 * @return {!proto.TaskEvent} returns this
 */
proto.TaskEvent.prototype.setTimeFinished = function(value) {
  return jspb.Message.setProto3StringField(this, 7, value);
};


/**
 * optional int32 technician_user_id = 8;
 * @return {number}
 */
proto.TaskEvent.prototype.getTechnicianUserId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 8, 0));
};


/**
 * @param {number} value
 * @return {!proto.TaskEvent} returns this
 */
proto.TaskEvent.prototype.setTechnicianUserId = function(value) {
  return jspb.Message.setProto3IntField(this, 8, value);
};


/**
 * optional bool is_active = 9;
 * @return {boolean}
 */
proto.TaskEvent.prototype.getIsActive = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 9, false));
};


/**
 * @param {boolean} value
 * @return {!proto.TaskEvent} returns this
 */
proto.TaskEvent.prototype.setIsActive = function(value) {
  return jspb.Message.setProto3BooleanField(this, 9, value);
};


/**
 * repeated string field_mask = 10;
 * @return {!Array<string>}
 */
proto.TaskEvent.prototype.getFieldMaskList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 10));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.TaskEvent} returns this
 */
proto.TaskEvent.prototype.setFieldMaskList = function(value) {
  return jspb.Message.setField(this, 10, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.TaskEvent} returns this
 */
proto.TaskEvent.prototype.addFieldMask = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 10, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.TaskEvent} returns this
 */
proto.TaskEvent.prototype.clearFieldMaskList = function() {
  return this.setFieldMaskList([]);
};


/**
 * optional int32 page_number = 11;
 * @return {number}
 */
proto.TaskEvent.prototype.getPageNumber = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 11, 0));
};


/**
 * @param {number} value
 * @return {!proto.TaskEvent} returns this
 */
proto.TaskEvent.prototype.setPageNumber = function(value) {
  return jspb.Message.setProto3IntField(this, 11, value);
};


/**
 * optional string order_by = 12;
 * @return {string}
 */
proto.TaskEvent.prototype.getOrderBy = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 12, ""));
};


/**
 * @param {string} value
 * @return {!proto.TaskEvent} returns this
 */
proto.TaskEvent.prototype.setOrderBy = function(value) {
  return jspb.Message.setProto3StringField(this, 12, value);
};


/**
 * optional string order_dir = 13;
 * @return {string}
 */
proto.TaskEvent.prototype.getOrderDir = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 13, ""));
};


/**
 * @param {string} value
 * @return {!proto.TaskEvent} returns this
 */
proto.TaskEvent.prototype.setOrderDir = function(value) {
  return jspb.Message.setProto3StringField(this, 13, value);
};


/**
 * optional double latitude = 14;
 * @return {number}
 */
proto.TaskEvent.prototype.getLatitude = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 14, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.TaskEvent} returns this
 */
proto.TaskEvent.prototype.setLatitude = function(value) {
  return jspb.Message.setProto3FloatField(this, 14, value);
};


/**
 * optional double longitude = 15;
 * @return {number}
 */
proto.TaskEvent.prototype.getLongitude = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 15, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.TaskEvent} returns this
 */
proto.TaskEvent.prototype.setLongitude = function(value) {
  return jspb.Message.setProto3FloatField(this, 15, value);
};


/**
 * optional string technician_user_name = 16;
 * @return {string}
 */
proto.TaskEvent.prototype.getTechnicianUserName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 16, ""));
};


/**
 * @param {string} value
 * @return {!proto.TaskEvent} returns this
 */
proto.TaskEvent.prototype.setTechnicianUserName = function(value) {
  return jspb.Message.setProto3StringField(this, 16, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.TaskEventList.repeatedFields_ = [1];



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
proto.TaskEventList.prototype.toObject = function(opt_includeInstance) {
  return proto.TaskEventList.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.TaskEventList} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TaskEventList.toObject = function(includeInstance, msg) {
  var f, obj = {
    resultsList: jspb.Message.toObjectList(msg.getResultsList(),
    proto.TaskEvent.toObject, includeInstance),
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
 * @return {!proto.TaskEventList}
 */
proto.TaskEventList.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.TaskEventList;
  return proto.TaskEventList.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.TaskEventList} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.TaskEventList}
 */
proto.TaskEventList.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.TaskEvent;
      reader.readMessage(value,proto.TaskEvent.deserializeBinaryFromReader);
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
proto.TaskEventList.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.TaskEventList.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.TaskEventList} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TaskEventList.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getResultsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.TaskEvent.serializeBinaryToWriter
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
 * repeated TaskEvent results = 1;
 * @return {!Array<!proto.TaskEvent>}
 */
proto.TaskEventList.prototype.getResultsList = function() {
  return /** @type{!Array<!proto.TaskEvent>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.TaskEvent, 1));
};


/**
 * @param {!Array<!proto.TaskEvent>} value
 * @return {!proto.TaskEventList} returns this
*/
proto.TaskEventList.prototype.setResultsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.TaskEvent=} opt_value
 * @param {number=} opt_index
 * @return {!proto.TaskEvent}
 */
proto.TaskEventList.prototype.addResults = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.TaskEvent, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.TaskEventList} returns this
 */
proto.TaskEventList.prototype.clearResultsList = function() {
  return this.setResultsList([]);
};


/**
 * optional int32 total_count = 2;
 * @return {number}
 */
proto.TaskEventList.prototype.getTotalCount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.TaskEventList} returns this
 */
proto.TaskEventList.prototype.setTotalCount = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


goog.object.extend(exports, proto);
