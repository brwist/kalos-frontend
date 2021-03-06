// source: devlog.proto
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

var user_pb = require('./user_pb.js');
goog.object.extend(proto, user_pb);
goog.exportSymbol('proto.Devlog', null, global);
goog.exportSymbol('proto.DevlogList', null, global);
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
proto.Devlog = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.Devlog.repeatedFields_, null);
};
goog.inherits(proto.Devlog, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.Devlog.displayName = 'proto.Devlog';
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
proto.DevlogList = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.DevlogList.repeatedFields_, null);
};
goog.inherits(proto.DevlogList, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.DevlogList.displayName = 'proto.DevlogList';
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.Devlog.repeatedFields_ = [8,12,16];



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
proto.Devlog.prototype.toObject = function(opt_includeInstance) {
  return proto.Devlog.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Devlog} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Devlog.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, 0),
    description: jspb.Message.getFieldWithDefault(msg, 2, ""),
    jobId: jspb.Message.getFieldWithDefault(msg, 3, 0),
    userId: jspb.Message.getFieldWithDefault(msg, 4, 0),
    isError: jspb.Message.getFieldWithDefault(msg, 5, 0),
    timestamp: jspb.Message.getFieldWithDefault(msg, 6, ""),
    errorSeverity: jspb.Message.getFieldWithDefault(msg, 7, 0),
    fieldMaskList: (f = jspb.Message.getRepeatedField(msg, 8)) == null ? undefined : f,
    pageNumber: jspb.Message.getFieldWithDefault(msg, 9, 0),
    orderBy: jspb.Message.getFieldWithDefault(msg, 10, ""),
    orderDir: jspb.Message.getFieldWithDefault(msg, 11, ""),
    dateRangeList: (f = jspb.Message.getRepeatedField(msg, 12)) == null ? undefined : f,
    withUser: jspb.Message.getBooleanFieldWithDefault(msg, 13, false),
    user: (f = msg.getUser()) && user_pb.User.toObject(includeInstance, f),
    dateTarget: jspb.Message.getFieldWithDefault(msg, 15, ""),
    notEqualsList: (f = jspb.Message.getRepeatedField(msg, 16)) == null ? undefined : f,
    transactionId: jspb.Message.getFieldWithDefault(msg, 17, 0),
    eventId: jspb.Message.getFieldWithDefault(msg, 18, 0),
    propertyId: jspb.Message.getFieldWithDefault(msg, 19, 0),
    tripId: jspb.Message.getFieldWithDefault(msg, 20, 0),
    perdiemId: jspb.Message.getFieldWithDefault(msg, 21, 0)
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
 * @return {!proto.Devlog}
 */
proto.Devlog.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Devlog;
  return proto.Devlog.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Devlog} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Devlog}
 */
proto.Devlog.deserializeBinaryFromReader = function(msg, reader) {
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
      msg.setDescription(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setJobId(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setUserId(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setIsError(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setTimestamp(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setErrorSeverity(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.addFieldMask(value);
      break;
    case 9:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setPageNumber(value);
      break;
    case 10:
      var value = /** @type {string} */ (reader.readString());
      msg.setOrderBy(value);
      break;
    case 11:
      var value = /** @type {string} */ (reader.readString());
      msg.setOrderDir(value);
      break;
    case 12:
      var value = /** @type {string} */ (reader.readString());
      msg.addDateRange(value);
      break;
    case 13:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setWithUser(value);
      break;
    case 14:
      var value = new user_pb.User;
      reader.readMessage(value,user_pb.User.deserializeBinaryFromReader);
      msg.setUser(value);
      break;
    case 15:
      var value = /** @type {string} */ (reader.readString());
      msg.setDateTarget(value);
      break;
    case 16:
      var value = /** @type {string} */ (reader.readString());
      msg.addNotEquals(value);
      break;
    case 17:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setTransactionId(value);
      break;
    case 18:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setEventId(value);
      break;
    case 19:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setPropertyId(value);
      break;
    case 20:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setTripId(value);
      break;
    case 21:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setPerdiemId(value);
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
proto.Devlog.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Devlog.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Devlog} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Devlog.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getDescription();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getJobId();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
  f = message.getUserId();
  if (f !== 0) {
    writer.writeInt32(
      4,
      f
    );
  }
  f = message.getIsError();
  if (f !== 0) {
    writer.writeInt32(
      5,
      f
    );
  }
  f = message.getTimestamp();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getErrorSeverity();
  if (f !== 0) {
    writer.writeInt32(
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
  f = message.getOrderBy();
  if (f.length > 0) {
    writer.writeString(
      10,
      f
    );
  }
  f = message.getOrderDir();
  if (f.length > 0) {
    writer.writeString(
      11,
      f
    );
  }
  f = message.getDateRangeList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      12,
      f
    );
  }
  f = message.getWithUser();
  if (f) {
    writer.writeBool(
      13,
      f
    );
  }
  f = message.getUser();
  if (f != null) {
    writer.writeMessage(
      14,
      f,
      user_pb.User.serializeBinaryToWriter
    );
  }
  f = message.getDateTarget();
  if (f.length > 0) {
    writer.writeString(
      15,
      f
    );
  }
  f = message.getNotEqualsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      16,
      f
    );
  }
  f = message.getTransactionId();
  if (f !== 0) {
    writer.writeInt32(
      17,
      f
    );
  }
  f = message.getEventId();
  if (f !== 0) {
    writer.writeInt32(
      18,
      f
    );
  }
  f = message.getPropertyId();
  if (f !== 0) {
    writer.writeInt32(
      19,
      f
    );
  }
  f = message.getTripId();
  if (f !== 0) {
    writer.writeInt32(
      20,
      f
    );
  }
  f = message.getPerdiemId();
  if (f !== 0) {
    writer.writeInt32(
      21,
      f
    );
  }
};


/**
 * optional int32 id = 1;
 * @return {number}
 */
proto.Devlog.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string description = 2;
 * @return {string}
 */
proto.Devlog.prototype.getDescription = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.setDescription = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional int32 job_id = 3;
 * @return {number}
 */
proto.Devlog.prototype.getJobId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.setJobId = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional int32 user_id = 4;
 * @return {number}
 */
proto.Devlog.prototype.getUserId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.setUserId = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional int32 is_error = 5;
 * @return {number}
 */
proto.Devlog.prototype.getIsError = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {number} value
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.setIsError = function(value) {
  return jspb.Message.setProto3IntField(this, 5, value);
};


/**
 * optional string timestamp = 6;
 * @return {string}
 */
proto.Devlog.prototype.getTimestamp = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.setTimestamp = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional int32 error_severity = 7;
 * @return {number}
 */
proto.Devlog.prototype.getErrorSeverity = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
};


/**
 * @param {number} value
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.setErrorSeverity = function(value) {
  return jspb.Message.setProto3IntField(this, 7, value);
};


/**
 * repeated string field_mask = 8;
 * @return {!Array<string>}
 */
proto.Devlog.prototype.getFieldMaskList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 8));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.setFieldMaskList = function(value) {
  return jspb.Message.setField(this, 8, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.addFieldMask = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 8, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.clearFieldMaskList = function() {
  return this.setFieldMaskList([]);
};


/**
 * optional int32 page_number = 9;
 * @return {number}
 */
proto.Devlog.prototype.getPageNumber = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 9, 0));
};


/**
 * @param {number} value
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.setPageNumber = function(value) {
  return jspb.Message.setProto3IntField(this, 9, value);
};


/**
 * optional string order_by = 10;
 * @return {string}
 */
proto.Devlog.prototype.getOrderBy = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/**
 * @param {string} value
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.setOrderBy = function(value) {
  return jspb.Message.setProto3StringField(this, 10, value);
};


/**
 * optional string order_dir = 11;
 * @return {string}
 */
proto.Devlog.prototype.getOrderDir = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 11, ""));
};


/**
 * @param {string} value
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.setOrderDir = function(value) {
  return jspb.Message.setProto3StringField(this, 11, value);
};


/**
 * repeated string date_range = 12;
 * @return {!Array<string>}
 */
proto.Devlog.prototype.getDateRangeList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 12));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.setDateRangeList = function(value) {
  return jspb.Message.setField(this, 12, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.addDateRange = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 12, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.clearDateRangeList = function() {
  return this.setDateRangeList([]);
};


/**
 * optional bool with_user = 13;
 * @return {boolean}
 */
proto.Devlog.prototype.getWithUser = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 13, false));
};


/**
 * @param {boolean} value
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.setWithUser = function(value) {
  return jspb.Message.setProto3BooleanField(this, 13, value);
};


/**
 * optional User user = 14;
 * @return {?proto.User}
 */
proto.Devlog.prototype.getUser = function() {
  return /** @type{?proto.User} */ (
    jspb.Message.getWrapperField(this, user_pb.User, 14));
};


/**
 * @param {?proto.User|undefined} value
 * @return {!proto.Devlog} returns this
*/
proto.Devlog.prototype.setUser = function(value) {
  return jspb.Message.setWrapperField(this, 14, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.clearUser = function() {
  return this.setUser(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.Devlog.prototype.hasUser = function() {
  return jspb.Message.getField(this, 14) != null;
};


/**
 * optional string date_target = 15;
 * @return {string}
 */
proto.Devlog.prototype.getDateTarget = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 15, ""));
};


/**
 * @param {string} value
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.setDateTarget = function(value) {
  return jspb.Message.setProto3StringField(this, 15, value);
};


/**
 * repeated string not_equals = 16;
 * @return {!Array<string>}
 */
proto.Devlog.prototype.getNotEqualsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 16));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.setNotEqualsList = function(value) {
  return jspb.Message.setField(this, 16, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.addNotEquals = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 16, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.clearNotEqualsList = function() {
  return this.setNotEqualsList([]);
};


/**
 * optional int32 transaction_id = 17;
 * @return {number}
 */
proto.Devlog.prototype.getTransactionId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 17, 0));
};


/**
 * @param {number} value
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.setTransactionId = function(value) {
  return jspb.Message.setProto3IntField(this, 17, value);
};


/**
 * optional int32 event_id = 18;
 * @return {number}
 */
proto.Devlog.prototype.getEventId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 18, 0));
};


/**
 * @param {number} value
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.setEventId = function(value) {
  return jspb.Message.setProto3IntField(this, 18, value);
};


/**
 * optional int32 property_id = 19;
 * @return {number}
 */
proto.Devlog.prototype.getPropertyId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 19, 0));
};


/**
 * @param {number} value
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.setPropertyId = function(value) {
  return jspb.Message.setProto3IntField(this, 19, value);
};


/**
 * optional int32 trip_id = 20;
 * @return {number}
 */
proto.Devlog.prototype.getTripId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 20, 0));
};


/**
 * @param {number} value
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.setTripId = function(value) {
  return jspb.Message.setProto3IntField(this, 20, value);
};


/**
 * optional int32 perdiem_id = 21;
 * @return {number}
 */
proto.Devlog.prototype.getPerdiemId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 21, 0));
};


/**
 * @param {number} value
 * @return {!proto.Devlog} returns this
 */
proto.Devlog.prototype.setPerdiemId = function(value) {
  return jspb.Message.setProto3IntField(this, 21, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.DevlogList.repeatedFields_ = [1];



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
proto.DevlogList.prototype.toObject = function(opt_includeInstance) {
  return proto.DevlogList.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.DevlogList} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.DevlogList.toObject = function(includeInstance, msg) {
  var f, obj = {
    resultsList: jspb.Message.toObjectList(msg.getResultsList(),
    proto.Devlog.toObject, includeInstance),
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
 * @return {!proto.DevlogList}
 */
proto.DevlogList.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.DevlogList;
  return proto.DevlogList.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.DevlogList} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.DevlogList}
 */
proto.DevlogList.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.Devlog;
      reader.readMessage(value,proto.Devlog.deserializeBinaryFromReader);
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
proto.DevlogList.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.DevlogList.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.DevlogList} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.DevlogList.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getResultsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.Devlog.serializeBinaryToWriter
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
 * repeated Devlog results = 1;
 * @return {!Array<!proto.Devlog>}
 */
proto.DevlogList.prototype.getResultsList = function() {
  return /** @type{!Array<!proto.Devlog>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.Devlog, 1));
};


/**
 * @param {!Array<!proto.Devlog>} value
 * @return {!proto.DevlogList} returns this
*/
proto.DevlogList.prototype.setResultsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.Devlog=} opt_value
 * @param {number=} opt_index
 * @return {!proto.Devlog}
 */
proto.DevlogList.prototype.addResults = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.Devlog, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.DevlogList} returns this
 */
proto.DevlogList.prototype.clearResultsList = function() {
  return this.setResultsList([]);
};


/**
 * optional int32 total_count = 2;
 * @return {number}
 */
proto.DevlogList.prototype.getTotalCount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.DevlogList} returns this
 */
proto.DevlogList.prototype.setTotalCount = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


goog.object.extend(exports, proto);
