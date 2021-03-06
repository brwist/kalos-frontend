// source: transaction_account.proto
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

goog.exportSymbol('proto.TransactionAccount', null, global);
goog.exportSymbol('proto.TransactionAccountList', null, global);
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
proto.TransactionAccount = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.TransactionAccount.repeatedFields_, null);
};
goog.inherits(proto.TransactionAccount, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.TransactionAccount.displayName = 'proto.TransactionAccount';
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
proto.TransactionAccountList = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.TransactionAccountList.repeatedFields_, null);
};
goog.inherits(proto.TransactionAccountList, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.TransactionAccountList.displayName = 'proto.TransactionAccountList';
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.TransactionAccount.repeatedFields_ = [8];



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
proto.TransactionAccount.prototype.toObject = function(opt_includeInstance) {
  return proto.TransactionAccount.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.TransactionAccount} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TransactionAccount.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, 0),
    accountCategory: jspb.Message.getFieldWithDefault(msg, 2, 0),
    thresholdAmount: jspb.Message.getFloatingPointFieldWithDefault(msg, 3, 0.0),
    description: jspb.Message.getFieldWithDefault(msg, 4, ""),
    needsPo: jspb.Message.getFieldWithDefault(msg, 5, 0),
    isActive: jspb.Message.getFieldWithDefault(msg, 6, 0),
    popularity: jspb.Message.getFieldWithDefault(msg, 7, 0),
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
 * @return {!proto.TransactionAccount}
 */
proto.TransactionAccount.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.TransactionAccount;
  return proto.TransactionAccount.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.TransactionAccount} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.TransactionAccount}
 */
proto.TransactionAccount.deserializeBinaryFromReader = function(msg, reader) {
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
      msg.setAccountCategory(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setThresholdAmount(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setDescription(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setNeedsPo(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setIsActive(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setPopularity(value);
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
proto.TransactionAccount.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.TransactionAccount.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.TransactionAccount} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TransactionAccount.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getAccountCategory();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
  f = message.getThresholdAmount();
  if (f !== 0.0) {
    writer.writeDouble(
      3,
      f
    );
  }
  f = message.getDescription();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getNeedsPo();
  if (f !== 0) {
    writer.writeInt32(
      5,
      f
    );
  }
  f = message.getIsActive();
  if (f !== 0) {
    writer.writeInt32(
      6,
      f
    );
  }
  f = message.getPopularity();
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
proto.TransactionAccount.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.TransactionAccount} returns this
 */
proto.TransactionAccount.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional int32 account_category = 2;
 * @return {number}
 */
proto.TransactionAccount.prototype.getAccountCategory = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.TransactionAccount} returns this
 */
proto.TransactionAccount.prototype.setAccountCategory = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional double threshold_amount = 3;
 * @return {number}
 */
proto.TransactionAccount.prototype.getThresholdAmount = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 3, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.TransactionAccount} returns this
 */
proto.TransactionAccount.prototype.setThresholdAmount = function(value) {
  return jspb.Message.setProto3FloatField(this, 3, value);
};


/**
 * optional string description = 4;
 * @return {string}
 */
proto.TransactionAccount.prototype.getDescription = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.TransactionAccount} returns this
 */
proto.TransactionAccount.prototype.setDescription = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional int32 needs_po = 5;
 * @return {number}
 */
proto.TransactionAccount.prototype.getNeedsPo = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {number} value
 * @return {!proto.TransactionAccount} returns this
 */
proto.TransactionAccount.prototype.setNeedsPo = function(value) {
  return jspb.Message.setProto3IntField(this, 5, value);
};


/**
 * optional int32 is_active = 6;
 * @return {number}
 */
proto.TransactionAccount.prototype.getIsActive = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/**
 * @param {number} value
 * @return {!proto.TransactionAccount} returns this
 */
proto.TransactionAccount.prototype.setIsActive = function(value) {
  return jspb.Message.setProto3IntField(this, 6, value);
};


/**
 * optional int32 popularity = 7;
 * @return {number}
 */
proto.TransactionAccount.prototype.getPopularity = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
};


/**
 * @param {number} value
 * @return {!proto.TransactionAccount} returns this
 */
proto.TransactionAccount.prototype.setPopularity = function(value) {
  return jspb.Message.setProto3IntField(this, 7, value);
};


/**
 * repeated string field_mask = 8;
 * @return {!Array<string>}
 */
proto.TransactionAccount.prototype.getFieldMaskList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 8));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.TransactionAccount} returns this
 */
proto.TransactionAccount.prototype.setFieldMaskList = function(value) {
  return jspb.Message.setField(this, 8, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.TransactionAccount} returns this
 */
proto.TransactionAccount.prototype.addFieldMask = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 8, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.TransactionAccount} returns this
 */
proto.TransactionAccount.prototype.clearFieldMaskList = function() {
  return this.setFieldMaskList([]);
};


/**
 * optional int32 page_number = 9;
 * @return {number}
 */
proto.TransactionAccount.prototype.getPageNumber = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 9, 0));
};


/**
 * @param {number} value
 * @return {!proto.TransactionAccount} returns this
 */
proto.TransactionAccount.prototype.setPageNumber = function(value) {
  return jspb.Message.setProto3IntField(this, 9, value);
};


/**
 * optional string order_by = 10;
 * @return {string}
 */
proto.TransactionAccount.prototype.getOrderBy = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/**
 * @param {string} value
 * @return {!proto.TransactionAccount} returns this
 */
proto.TransactionAccount.prototype.setOrderBy = function(value) {
  return jspb.Message.setProto3StringField(this, 10, value);
};


/**
 * optional string order_dir = 11;
 * @return {string}
 */
proto.TransactionAccount.prototype.getOrderDir = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 11, ""));
};


/**
 * @param {string} value
 * @return {!proto.TransactionAccount} returns this
 */
proto.TransactionAccount.prototype.setOrderDir = function(value) {
  return jspb.Message.setProto3StringField(this, 11, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.TransactionAccountList.repeatedFields_ = [1];



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
proto.TransactionAccountList.prototype.toObject = function(opt_includeInstance) {
  return proto.TransactionAccountList.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.TransactionAccountList} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TransactionAccountList.toObject = function(includeInstance, msg) {
  var f, obj = {
    resultsList: jspb.Message.toObjectList(msg.getResultsList(),
    proto.TransactionAccount.toObject, includeInstance),
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
 * @return {!proto.TransactionAccountList}
 */
proto.TransactionAccountList.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.TransactionAccountList;
  return proto.TransactionAccountList.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.TransactionAccountList} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.TransactionAccountList}
 */
proto.TransactionAccountList.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.TransactionAccount;
      reader.readMessage(value,proto.TransactionAccount.deserializeBinaryFromReader);
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
proto.TransactionAccountList.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.TransactionAccountList.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.TransactionAccountList} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TransactionAccountList.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getResultsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.TransactionAccount.serializeBinaryToWriter
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
 * repeated TransactionAccount results = 1;
 * @return {!Array<!proto.TransactionAccount>}
 */
proto.TransactionAccountList.prototype.getResultsList = function() {
  return /** @type{!Array<!proto.TransactionAccount>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.TransactionAccount, 1));
};


/**
 * @param {!Array<!proto.TransactionAccount>} value
 * @return {!proto.TransactionAccountList} returns this
*/
proto.TransactionAccountList.prototype.setResultsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.TransactionAccount=} opt_value
 * @param {number=} opt_index
 * @return {!proto.TransactionAccount}
 */
proto.TransactionAccountList.prototype.addResults = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.TransactionAccount, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.TransactionAccountList} returns this
 */
proto.TransactionAccountList.prototype.clearResultsList = function() {
  return this.setResultsList([]);
};


/**
 * optional int32 total_count = 2;
 * @return {number}
 */
proto.TransactionAccountList.prototype.getTotalCount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.TransactionAccountList} returns this
 */
proto.TransactionAccountList.prototype.setTotalCount = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


goog.object.extend(exports, proto);
