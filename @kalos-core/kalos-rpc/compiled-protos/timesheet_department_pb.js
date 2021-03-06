// source: timesheet_department.proto
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

var common_pb = require('./common_pb.js');
goog.object.extend(proto, common_pb);
goog.exportSymbol('proto.TimesheetDepartment', null, global);
goog.exportSymbol('proto.TimesheetDepartmentList', null, global);
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
proto.TimesheetDepartment = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.TimesheetDepartment.repeatedFields_, null);
};
goog.inherits(proto.TimesheetDepartment, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.TimesheetDepartment.displayName = 'proto.TimesheetDepartment';
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
proto.TimesheetDepartmentList = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.TimesheetDepartmentList.repeatedFields_, null);
};
goog.inherits(proto.TimesheetDepartmentList, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.TimesheetDepartmentList.displayName = 'proto.TimesheetDepartmentList';
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.TimesheetDepartment.repeatedFields_ = [7];



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
proto.TimesheetDepartment.prototype.toObject = function(opt_includeInstance) {
  return proto.TimesheetDepartment.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.TimesheetDepartment} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TimesheetDepartment.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, 0),
    value: jspb.Message.getFieldWithDefault(msg, 2, ""),
    description: jspb.Message.getFieldWithDefault(msg, 3, ""),
    managerId: jspb.Message.getFieldWithDefault(msg, 4, 0),
    isActive: jspb.Message.getFieldWithDefault(msg, 5, 0),
    sectorGroup: jspb.Message.getFieldWithDefault(msg, 6, 0),
    fieldMaskList: (f = jspb.Message.getRepeatedField(msg, 7)) == null ? undefined : f,
    pageNumber: jspb.Message.getFieldWithDefault(msg, 8, 0)
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
 * @return {!proto.TimesheetDepartment}
 */
proto.TimesheetDepartment.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.TimesheetDepartment;
  return proto.TimesheetDepartment.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.TimesheetDepartment} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.TimesheetDepartment}
 */
proto.TimesheetDepartment.deserializeBinaryFromReader = function(msg, reader) {
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
      msg.setValue(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setDescription(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setManagerId(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setIsActive(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setSectorGroup(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.addFieldMask(value);
      break;
    case 8:
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
proto.TimesheetDepartment.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.TimesheetDepartment.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.TimesheetDepartment} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TimesheetDepartment.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getValue();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getDescription();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getManagerId();
  if (f !== 0) {
    writer.writeInt32(
      4,
      f
    );
  }
  f = message.getIsActive();
  if (f !== 0) {
    writer.writeInt32(
      5,
      f
    );
  }
  f = message.getSectorGroup();
  if (f !== 0) {
    writer.writeInt32(
      6,
      f
    );
  }
  f = message.getFieldMaskList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      7,
      f
    );
  }
  f = message.getPageNumber();
  if (f !== 0) {
    writer.writeInt32(
      8,
      f
    );
  }
};


/**
 * optional int32 id = 1;
 * @return {number}
 */
proto.TimesheetDepartment.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.TimesheetDepartment} returns this
 */
proto.TimesheetDepartment.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string value = 2;
 * @return {string}
 */
proto.TimesheetDepartment.prototype.getValue = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.TimesheetDepartment} returns this
 */
proto.TimesheetDepartment.prototype.setValue = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string description = 3;
 * @return {string}
 */
proto.TimesheetDepartment.prototype.getDescription = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.TimesheetDepartment} returns this
 */
proto.TimesheetDepartment.prototype.setDescription = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional int32 manager_id = 4;
 * @return {number}
 */
proto.TimesheetDepartment.prototype.getManagerId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.TimesheetDepartment} returns this
 */
proto.TimesheetDepartment.prototype.setManagerId = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional int32 is_active = 5;
 * @return {number}
 */
proto.TimesheetDepartment.prototype.getIsActive = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {number} value
 * @return {!proto.TimesheetDepartment} returns this
 */
proto.TimesheetDepartment.prototype.setIsActive = function(value) {
  return jspb.Message.setProto3IntField(this, 5, value);
};


/**
 * optional int32 sector_group = 6;
 * @return {number}
 */
proto.TimesheetDepartment.prototype.getSectorGroup = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/**
 * @param {number} value
 * @return {!proto.TimesheetDepartment} returns this
 */
proto.TimesheetDepartment.prototype.setSectorGroup = function(value) {
  return jspb.Message.setProto3IntField(this, 6, value);
};


/**
 * repeated string field_mask = 7;
 * @return {!Array<string>}
 */
proto.TimesheetDepartment.prototype.getFieldMaskList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 7));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.TimesheetDepartment} returns this
 */
proto.TimesheetDepartment.prototype.setFieldMaskList = function(value) {
  return jspb.Message.setField(this, 7, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.TimesheetDepartment} returns this
 */
proto.TimesheetDepartment.prototype.addFieldMask = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 7, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.TimesheetDepartment} returns this
 */
proto.TimesheetDepartment.prototype.clearFieldMaskList = function() {
  return this.setFieldMaskList([]);
};


/**
 * optional int32 page_number = 8;
 * @return {number}
 */
proto.TimesheetDepartment.prototype.getPageNumber = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 8, 0));
};


/**
 * @param {number} value
 * @return {!proto.TimesheetDepartment} returns this
 */
proto.TimesheetDepartment.prototype.setPageNumber = function(value) {
  return jspb.Message.setProto3IntField(this, 8, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.TimesheetDepartmentList.repeatedFields_ = [1];



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
proto.TimesheetDepartmentList.prototype.toObject = function(opt_includeInstance) {
  return proto.TimesheetDepartmentList.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.TimesheetDepartmentList} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TimesheetDepartmentList.toObject = function(includeInstance, msg) {
  var f, obj = {
    resultsList: jspb.Message.toObjectList(msg.getResultsList(),
    proto.TimesheetDepartment.toObject, includeInstance),
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
 * @return {!proto.TimesheetDepartmentList}
 */
proto.TimesheetDepartmentList.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.TimesheetDepartmentList;
  return proto.TimesheetDepartmentList.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.TimesheetDepartmentList} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.TimesheetDepartmentList}
 */
proto.TimesheetDepartmentList.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.TimesheetDepartment;
      reader.readMessage(value,proto.TimesheetDepartment.deserializeBinaryFromReader);
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
proto.TimesheetDepartmentList.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.TimesheetDepartmentList.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.TimesheetDepartmentList} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TimesheetDepartmentList.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getResultsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.TimesheetDepartment.serializeBinaryToWriter
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
 * repeated TimesheetDepartment results = 1;
 * @return {!Array<!proto.TimesheetDepartment>}
 */
proto.TimesheetDepartmentList.prototype.getResultsList = function() {
  return /** @type{!Array<!proto.TimesheetDepartment>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.TimesheetDepartment, 1));
};


/**
 * @param {!Array<!proto.TimesheetDepartment>} value
 * @return {!proto.TimesheetDepartmentList} returns this
*/
proto.TimesheetDepartmentList.prototype.setResultsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.TimesheetDepartment=} opt_value
 * @param {number=} opt_index
 * @return {!proto.TimesheetDepartment}
 */
proto.TimesheetDepartmentList.prototype.addResults = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.TimesheetDepartment, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.TimesheetDepartmentList} returns this
 */
proto.TimesheetDepartmentList.prototype.clearResultsList = function() {
  return this.setResultsList([]);
};


/**
 * optional int32 total_count = 2;
 * @return {number}
 */
proto.TimesheetDepartmentList.prototype.getTotalCount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.TimesheetDepartmentList} returns this
 */
proto.TimesheetDepartmentList.prototype.setTotalCount = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


goog.object.extend(exports, proto);
