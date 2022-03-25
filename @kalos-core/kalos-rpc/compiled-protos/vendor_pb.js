// source: vendor.proto
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
goog.exportSymbol('proto.Vendor', null, global);
goog.exportSymbol('proto.VendorList', null, global);
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
proto.Vendor = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.Vendor.repeatedFields_, null);
};
goog.inherits(proto.Vendor, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.Vendor.displayName = 'proto.Vendor';
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
proto.VendorList = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.VendorList.repeatedFields_, null);
};
goog.inherits(proto.VendorList, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.VendorList.displayName = 'proto.VendorList';
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.Vendor.repeatedFields_ = [8];



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
proto.Vendor.prototype.toObject = function(opt_includeInstance) {
  return proto.Vendor.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Vendor} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Vendor.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, 0),
    vendorName: jspb.Message.getFieldWithDefault(msg, 2, ""),
    vendorCity: jspb.Message.getFieldWithDefault(msg, 3, ""),
    vendorState: jspb.Message.getFieldWithDefault(msg, 4, ""),
    vendorZip: jspb.Message.getFieldWithDefault(msg, 5, ""),
    vendorAddress: jspb.Message.getFieldWithDefault(msg, 6, ""),
    isActive: jspb.Message.getFieldWithDefault(msg, 7, 0),
    fieldMaskList: (f = jspb.Message.getRepeatedField(msg, 8)) == null ? undefined : f,
    pageNumber: jspb.Message.getFieldWithDefault(msg, 9, 0),
    orderBy: jspb.Message.getFieldWithDefault(msg, 10, ""),
    orderDir: jspb.Message.getFieldWithDefault(msg, 11, "")
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
 * @return {!proto.Vendor}
 */
proto.Vendor.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Vendor;
  return proto.Vendor.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Vendor} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Vendor}
 */
proto.Vendor.deserializeBinaryFromReader = function(msg, reader) {
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
      msg.setVendorName(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setVendorCity(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setVendorState(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setVendorZip(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setVendorAddress(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setIsActive(value);
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
proto.Vendor.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Vendor.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Vendor} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Vendor.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getVendorName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getVendorCity();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getVendorState();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getVendorZip();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getVendorAddress();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getIsActive();
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
};


/**
 * optional int32 id = 1;
 * @return {number}
 */
proto.Vendor.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.Vendor} returns this
 */
proto.Vendor.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string vendor_name = 2;
 * @return {string}
 */
proto.Vendor.prototype.getVendorName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.Vendor} returns this
 */
proto.Vendor.prototype.setVendorName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string vendor_city = 3;
 * @return {string}
 */
proto.Vendor.prototype.getVendorCity = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.Vendor} returns this
 */
proto.Vendor.prototype.setVendorCity = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string vendor_state = 4;
 * @return {string}
 */
proto.Vendor.prototype.getVendorState = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.Vendor} returns this
 */
proto.Vendor.prototype.setVendorState = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string vendor_zip = 5;
 * @return {string}
 */
proto.Vendor.prototype.getVendorZip = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.Vendor} returns this
 */
proto.Vendor.prototype.setVendorZip = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string vendor_address = 6;
 * @return {string}
 */
proto.Vendor.prototype.getVendorAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.Vendor} returns this
 */
proto.Vendor.prototype.setVendorAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional int32 is_active = 7;
 * @return {number}
 */
proto.Vendor.prototype.getIsActive = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
};


/**
 * @param {number} value
 * @return {!proto.Vendor} returns this
 */
proto.Vendor.prototype.setIsActive = function(value) {
  return jspb.Message.setProto3IntField(this, 7, value);
};


/**
 * repeated string field_mask = 8;
 * @return {!Array<string>}
 */
proto.Vendor.prototype.getFieldMaskList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 8));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.Vendor} returns this
 */
proto.Vendor.prototype.setFieldMaskList = function(value) {
  return jspb.Message.setField(this, 8, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.Vendor} returns this
 */
proto.Vendor.prototype.addFieldMask = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 8, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.Vendor} returns this
 */
proto.Vendor.prototype.clearFieldMaskList = function() {
  return this.setFieldMaskList([]);
};


/**
 * optional int32 page_number = 9;
 * @return {number}
 */
proto.Vendor.prototype.getPageNumber = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 9, 0));
};


/**
 * @param {number} value
 * @return {!proto.Vendor} returns this
 */
proto.Vendor.prototype.setPageNumber = function(value) {
  return jspb.Message.setProto3IntField(this, 9, value);
};


/**
 * optional string order_by = 10;
 * @return {string}
 */
proto.Vendor.prototype.getOrderBy = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/**
 * @param {string} value
 * @return {!proto.Vendor} returns this
 */
proto.Vendor.prototype.setOrderBy = function(value) {
  return jspb.Message.setProto3StringField(this, 10, value);
};


/**
 * optional string order_dir = 11;
 * @return {string}
 */
proto.Vendor.prototype.getOrderDir = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 11, ""));
};


/**
 * @param {string} value
 * @return {!proto.Vendor} returns this
 */
proto.Vendor.prototype.setOrderDir = function(value) {
  return jspb.Message.setProto3StringField(this, 11, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.VendorList.repeatedFields_ = [1];



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
proto.VendorList.prototype.toObject = function(opt_includeInstance) {
  return proto.VendorList.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.VendorList} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.VendorList.toObject = function(includeInstance, msg) {
  var f, obj = {
    resultsList: jspb.Message.toObjectList(msg.getResultsList(),
    proto.Vendor.toObject, includeInstance),
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
 * @return {!proto.VendorList}
 */
proto.VendorList.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.VendorList;
  return proto.VendorList.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.VendorList} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.VendorList}
 */
proto.VendorList.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.Vendor;
      reader.readMessage(value,proto.Vendor.deserializeBinaryFromReader);
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
proto.VendorList.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.VendorList.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.VendorList} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.VendorList.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getResultsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.Vendor.serializeBinaryToWriter
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
 * repeated Vendor results = 1;
 * @return {!Array<!proto.Vendor>}
 */
proto.VendorList.prototype.getResultsList = function() {
  return /** @type{!Array<!proto.Vendor>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.Vendor, 1));
};


/**
 * @param {!Array<!proto.Vendor>} value
 * @return {!proto.VendorList} returns this
*/
proto.VendorList.prototype.setResultsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.Vendor=} opt_value
 * @param {number=} opt_index
 * @return {!proto.Vendor}
 */
proto.VendorList.prototype.addResults = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.Vendor, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.VendorList} returns this
 */
proto.VendorList.prototype.clearResultsList = function() {
  return this.setResultsList([]);
};


/**
 * optional int32 total_count = 2;
 * @return {number}
 */
proto.VendorList.prototype.getTotalCount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.VendorList} returns this
 */
proto.VendorList.prototype.setTotalCount = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


goog.object.extend(exports, proto);
