// source: job_type_subtype.proto
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

goog.exportSymbol('proto.JobTypeSubtype', null, global);
goog.exportSymbol('proto.JobTypeSubtypeList', null, global);
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
proto.JobTypeSubtype = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.JobTypeSubtype.repeatedFields_, null);
};
goog.inherits(proto.JobTypeSubtype, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.JobTypeSubtype.displayName = 'proto.JobTypeSubtype';
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
proto.JobTypeSubtypeList = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.JobTypeSubtypeList.repeatedFields_, null);
};
goog.inherits(proto.JobTypeSubtypeList, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.JobTypeSubtypeList.displayName = 'proto.JobTypeSubtypeList';
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.JobTypeSubtype.repeatedFields_ = [4];



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
proto.JobTypeSubtype.prototype.toObject = function(opt_includeInstance) {
  return proto.JobTypeSubtype.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.JobTypeSubtype} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.JobTypeSubtype.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, 0),
    jobTypeId: jspb.Message.getFieldWithDefault(msg, 2, 0),
    jobSubtypeId: jspb.Message.getFieldWithDefault(msg, 3, 0),
    fieldMaskList: (f = jspb.Message.getRepeatedField(msg, 4)) == null ? undefined : f,
    pageNumber: jspb.Message.getFieldWithDefault(msg, 5, 0),
    withoutLimit: jspb.Message.getBooleanFieldWithDefault(msg, 6, false)
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
 * @return {!proto.JobTypeSubtype}
 */
proto.JobTypeSubtype.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.JobTypeSubtype;
  return proto.JobTypeSubtype.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.JobTypeSubtype} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.JobTypeSubtype}
 */
proto.JobTypeSubtype.deserializeBinaryFromReader = function(msg, reader) {
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
      msg.setJobTypeId(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setJobSubtypeId(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.addFieldMask(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setPageNumber(value);
      break;
    case 6:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setWithoutLimit(value);
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
proto.JobTypeSubtype.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.JobTypeSubtype.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.JobTypeSubtype} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.JobTypeSubtype.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getJobTypeId();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
  f = message.getJobSubtypeId();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
  f = message.getFieldMaskList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      4,
      f
    );
  }
  f = message.getPageNumber();
  if (f !== 0) {
    writer.writeInt32(
      5,
      f
    );
  }
  f = message.getWithoutLimit();
  if (f) {
    writer.writeBool(
      6,
      f
    );
  }
};


/**
 * optional int32 id = 1;
 * @return {number}
 */
proto.JobTypeSubtype.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.JobTypeSubtype} returns this
 */
proto.JobTypeSubtype.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional int32 job_type_id = 2;
 * @return {number}
 */
proto.JobTypeSubtype.prototype.getJobTypeId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.JobTypeSubtype} returns this
 */
proto.JobTypeSubtype.prototype.setJobTypeId = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional int32 job_subtype_id = 3;
 * @return {number}
 */
proto.JobTypeSubtype.prototype.getJobSubtypeId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.JobTypeSubtype} returns this
 */
proto.JobTypeSubtype.prototype.setJobSubtypeId = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * repeated string field_mask = 4;
 * @return {!Array<string>}
 */
proto.JobTypeSubtype.prototype.getFieldMaskList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 4));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.JobTypeSubtype} returns this
 */
proto.JobTypeSubtype.prototype.setFieldMaskList = function(value) {
  return jspb.Message.setField(this, 4, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.JobTypeSubtype} returns this
 */
proto.JobTypeSubtype.prototype.addFieldMask = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 4, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.JobTypeSubtype} returns this
 */
proto.JobTypeSubtype.prototype.clearFieldMaskList = function() {
  return this.setFieldMaskList([]);
};


/**
 * optional int32 page_number = 5;
 * @return {number}
 */
proto.JobTypeSubtype.prototype.getPageNumber = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {number} value
 * @return {!proto.JobTypeSubtype} returns this
 */
proto.JobTypeSubtype.prototype.setPageNumber = function(value) {
  return jspb.Message.setProto3IntField(this, 5, value);
};


/**
 * optional bool without_limit = 6;
 * @return {boolean}
 */
proto.JobTypeSubtype.prototype.getWithoutLimit = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 6, false));
};


/**
 * @param {boolean} value
 * @return {!proto.JobTypeSubtype} returns this
 */
proto.JobTypeSubtype.prototype.setWithoutLimit = function(value) {
  return jspb.Message.setProto3BooleanField(this, 6, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.JobTypeSubtypeList.repeatedFields_ = [1];



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
proto.JobTypeSubtypeList.prototype.toObject = function(opt_includeInstance) {
  return proto.JobTypeSubtypeList.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.JobTypeSubtypeList} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.JobTypeSubtypeList.toObject = function(includeInstance, msg) {
  var f, obj = {
    resultsList: jspb.Message.toObjectList(msg.getResultsList(),
    proto.JobTypeSubtype.toObject, includeInstance),
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
 * @return {!proto.JobTypeSubtypeList}
 */
proto.JobTypeSubtypeList.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.JobTypeSubtypeList;
  return proto.JobTypeSubtypeList.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.JobTypeSubtypeList} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.JobTypeSubtypeList}
 */
proto.JobTypeSubtypeList.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.JobTypeSubtype;
      reader.readMessage(value,proto.JobTypeSubtype.deserializeBinaryFromReader);
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
proto.JobTypeSubtypeList.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.JobTypeSubtypeList.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.JobTypeSubtypeList} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.JobTypeSubtypeList.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getResultsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.JobTypeSubtype.serializeBinaryToWriter
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
 * repeated JobTypeSubtype results = 1;
 * @return {!Array<!proto.JobTypeSubtype>}
 */
proto.JobTypeSubtypeList.prototype.getResultsList = function() {
  return /** @type{!Array<!proto.JobTypeSubtype>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.JobTypeSubtype, 1));
};


/**
 * @param {!Array<!proto.JobTypeSubtype>} value
 * @return {!proto.JobTypeSubtypeList} returns this
*/
proto.JobTypeSubtypeList.prototype.setResultsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.JobTypeSubtype=} opt_value
 * @param {number=} opt_index
 * @return {!proto.JobTypeSubtype}
 */
proto.JobTypeSubtypeList.prototype.addResults = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.JobTypeSubtype, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.JobTypeSubtypeList} returns this
 */
proto.JobTypeSubtypeList.prototype.clearResultsList = function() {
  return this.setResultsList([]);
};


/**
 * optional int32 total_count = 2;
 * @return {number}
 */
proto.JobTypeSubtypeList.prototype.getTotalCount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.JobTypeSubtypeList} returns this
 */
proto.JobTypeSubtypeList.prototype.setTotalCount = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


goog.object.extend(exports, proto);
