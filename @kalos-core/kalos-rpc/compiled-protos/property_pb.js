// source: property.proto
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
goog.exportSymbol('proto.Property', null, global);
goog.exportSymbol('proto.PropertyCoordinates', null, global);
goog.exportSymbol('proto.PropertyList', null, global);
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
proto.PropertyCoordinates = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.PropertyCoordinates.repeatedFields_, null);
};
goog.inherits(proto.PropertyCoordinates, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.PropertyCoordinates.displayName = 'proto.PropertyCoordinates';
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
proto.Property = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.Property.repeatedFields_, null);
};
goog.inherits(proto.Property, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.Property.displayName = 'proto.Property';
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
proto.PropertyList = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.PropertyList.repeatedFields_, null);
};
goog.inherits(proto.PropertyList, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.PropertyList.displayName = 'proto.PropertyList';
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.PropertyCoordinates.repeatedFields_ = [1];



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
proto.PropertyCoordinates.prototype.toObject = function(opt_includeInstance) {
  return proto.PropertyCoordinates.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.PropertyCoordinates} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.PropertyCoordinates.toObject = function(includeInstance, msg) {
  var f, obj = {
    coordsList: jspb.Message.toObjectList(msg.getCoordsList(),
    common_pb.LatLng.toObject, includeInstance)
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
 * @return {!proto.PropertyCoordinates}
 */
proto.PropertyCoordinates.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.PropertyCoordinates;
  return proto.PropertyCoordinates.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.PropertyCoordinates} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.PropertyCoordinates}
 */
proto.PropertyCoordinates.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new common_pb.LatLng;
      reader.readMessage(value,common_pb.LatLng.deserializeBinaryFromReader);
      msg.addCoords(value);
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
proto.PropertyCoordinates.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.PropertyCoordinates.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.PropertyCoordinates} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.PropertyCoordinates.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCoordsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      common_pb.LatLng.serializeBinaryToWriter
    );
  }
};


/**
 * repeated LatLng coords = 1;
 * @return {!Array<!proto.LatLng>}
 */
proto.PropertyCoordinates.prototype.getCoordsList = function() {
  return /** @type{!Array<!proto.LatLng>} */ (
    jspb.Message.getRepeatedWrapperField(this, common_pb.LatLng, 1));
};


/**
 * @param {!Array<!proto.LatLng>} value
 * @return {!proto.PropertyCoordinates} returns this
*/
proto.PropertyCoordinates.prototype.setCoordsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.LatLng=} opt_value
 * @param {number=} opt_index
 * @return {!proto.LatLng}
 */
proto.PropertyCoordinates.prototype.addCoords = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.LatLng, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.PropertyCoordinates} returns this
 */
proto.PropertyCoordinates.prototype.clearCoordsList = function() {
  return this.setCoordsList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.Property.repeatedFields_ = [24,26];



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
proto.Property.prototype.toObject = function(opt_includeInstance) {
  return proto.Property.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Property} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Property.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, 0),
    userId: jspb.Message.getFieldWithDefault(msg, 2, 0),
    contractId: jspb.Message.getFieldWithDefault(msg, 3, 0),
    address: jspb.Message.getFieldWithDefault(msg, 4, ""),
    additionalAddressLine: jspb.Message.getFieldWithDefault(msg, 5, ""),
    city: jspb.Message.getFieldWithDefault(msg, 6, ""),
    state: jspb.Message.getFieldWithDefault(msg, 7, ""),
    zip: jspb.Message.getFieldWithDefault(msg, 8, ""),
    subdivision: jspb.Message.getFieldWithDefault(msg, 9, ""),
    directions: jspb.Message.getFieldWithDefault(msg, 10, ""),
    notes: jspb.Message.getFieldWithDefault(msg, 11, ""),
    dateCreated: jspb.Message.getFieldWithDefault(msg, 12, ""),
    isActive: jspb.Message.getFieldWithDefault(msg, 13, 0),
    isResidential: jspb.Message.getFieldWithDefault(msg, 14, 0),
    notification: jspb.Message.getFieldWithDefault(msg, 15, ""),
    firstname: jspb.Message.getFieldWithDefault(msg, 16, ""),
    lastname: jspb.Message.getFieldWithDefault(msg, 17, ""),
    businessname: jspb.Message.getFieldWithDefault(msg, 18, ""),
    phone: jspb.Message.getFieldWithDefault(msg, 19, ""),
    altphone: jspb.Message.getFieldWithDefault(msg, 20, ""),
    email: jspb.Message.getFieldWithDefault(msg, 21, ""),
    geolocationLat: jspb.Message.getFloatingPointFieldWithDefault(msg, 22, 0.0),
    geolocationLng: jspb.Message.getFloatingPointFieldWithDefault(msg, 23, 0.0),
    fieldMaskList: (f = jspb.Message.getRepeatedField(msg, 24)) == null ? undefined : f,
    pageNumber: jspb.Message.getFieldWithDefault(msg, 25, 0),
    notEqualsList: (f = jspb.Message.getRepeatedField(msg, 26)) == null ? undefined : f,
    orderBy: jspb.Message.getFieldWithDefault(msg, 27, ""),
    orderDir: jspb.Message.getFieldWithDefault(msg, 28, ""),
    groupBy: jspb.Message.getFieldWithDefault(msg, 29, ""),
    withoutLimit: jspb.Message.getBooleanFieldWithDefault(msg, 30, false)
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
 * @return {!proto.Property}
 */
proto.Property.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Property;
  return proto.Property.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Property} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Property}
 */
proto.Property.deserializeBinaryFromReader = function(msg, reader) {
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
      msg.setUserId(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setContractId(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddress(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setAdditionalAddressLine(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setCity(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setState(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setZip(value);
      break;
    case 9:
      var value = /** @type {string} */ (reader.readString());
      msg.setSubdivision(value);
      break;
    case 10:
      var value = /** @type {string} */ (reader.readString());
      msg.setDirections(value);
      break;
    case 11:
      var value = /** @type {string} */ (reader.readString());
      msg.setNotes(value);
      break;
    case 12:
      var value = /** @type {string} */ (reader.readString());
      msg.setDateCreated(value);
      break;
    case 13:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setIsActive(value);
      break;
    case 14:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setIsResidential(value);
      break;
    case 15:
      var value = /** @type {string} */ (reader.readString());
      msg.setNotification(value);
      break;
    case 16:
      var value = /** @type {string} */ (reader.readString());
      msg.setFirstname(value);
      break;
    case 17:
      var value = /** @type {string} */ (reader.readString());
      msg.setLastname(value);
      break;
    case 18:
      var value = /** @type {string} */ (reader.readString());
      msg.setBusinessname(value);
      break;
    case 19:
      var value = /** @type {string} */ (reader.readString());
      msg.setPhone(value);
      break;
    case 20:
      var value = /** @type {string} */ (reader.readString());
      msg.setAltphone(value);
      break;
    case 21:
      var value = /** @type {string} */ (reader.readString());
      msg.setEmail(value);
      break;
    case 22:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setGeolocationLat(value);
      break;
    case 23:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setGeolocationLng(value);
      break;
    case 24:
      var value = /** @type {string} */ (reader.readString());
      msg.addFieldMask(value);
      break;
    case 25:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setPageNumber(value);
      break;
    case 26:
      var value = /** @type {string} */ (reader.readString());
      msg.addNotEquals(value);
      break;
    case 27:
      var value = /** @type {string} */ (reader.readString());
      msg.setOrderBy(value);
      break;
    case 28:
      var value = /** @type {string} */ (reader.readString());
      msg.setOrderDir(value);
      break;
    case 29:
      var value = /** @type {string} */ (reader.readString());
      msg.setGroupBy(value);
      break;
    case 30:
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
proto.Property.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Property.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Property} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Property.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getUserId();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
  f = message.getContractId();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
  f = message.getAddress();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getAdditionalAddressLine();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getCity();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getState();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
  f = message.getZip();
  if (f.length > 0) {
    writer.writeString(
      8,
      f
    );
  }
  f = message.getSubdivision();
  if (f.length > 0) {
    writer.writeString(
      9,
      f
    );
  }
  f = message.getDirections();
  if (f.length > 0) {
    writer.writeString(
      10,
      f
    );
  }
  f = message.getNotes();
  if (f.length > 0) {
    writer.writeString(
      11,
      f
    );
  }
  f = message.getDateCreated();
  if (f.length > 0) {
    writer.writeString(
      12,
      f
    );
  }
  f = message.getIsActive();
  if (f !== 0) {
    writer.writeInt32(
      13,
      f
    );
  }
  f = message.getIsResidential();
  if (f !== 0) {
    writer.writeInt32(
      14,
      f
    );
  }
  f = message.getNotification();
  if (f.length > 0) {
    writer.writeString(
      15,
      f
    );
  }
  f = message.getFirstname();
  if (f.length > 0) {
    writer.writeString(
      16,
      f
    );
  }
  f = message.getLastname();
  if (f.length > 0) {
    writer.writeString(
      17,
      f
    );
  }
  f = message.getBusinessname();
  if (f.length > 0) {
    writer.writeString(
      18,
      f
    );
  }
  f = message.getPhone();
  if (f.length > 0) {
    writer.writeString(
      19,
      f
    );
  }
  f = message.getAltphone();
  if (f.length > 0) {
    writer.writeString(
      20,
      f
    );
  }
  f = message.getEmail();
  if (f.length > 0) {
    writer.writeString(
      21,
      f
    );
  }
  f = message.getGeolocationLat();
  if (f !== 0.0) {
    writer.writeDouble(
      22,
      f
    );
  }
  f = message.getGeolocationLng();
  if (f !== 0.0) {
    writer.writeDouble(
      23,
      f
    );
  }
  f = message.getFieldMaskList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      24,
      f
    );
  }
  f = message.getPageNumber();
  if (f !== 0) {
    writer.writeInt32(
      25,
      f
    );
  }
  f = message.getNotEqualsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      26,
      f
    );
  }
  f = message.getOrderBy();
  if (f.length > 0) {
    writer.writeString(
      27,
      f
    );
  }
  f = message.getOrderDir();
  if (f.length > 0) {
    writer.writeString(
      28,
      f
    );
  }
  f = message.getGroupBy();
  if (f.length > 0) {
    writer.writeString(
      29,
      f
    );
  }
  f = message.getWithoutLimit();
  if (f) {
    writer.writeBool(
      30,
      f
    );
  }
};


/**
 * optional int32 id = 1;
 * @return {number}
 */
proto.Property.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional int32 user_id = 2;
 * @return {number}
 */
proto.Property.prototype.getUserId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setUserId = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional int32 contract_id = 3;
 * @return {number}
 */
proto.Property.prototype.getContractId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setContractId = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional string address = 4;
 * @return {string}
 */
proto.Property.prototype.getAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string additional_address_line = 5;
 * @return {string}
 */
proto.Property.prototype.getAdditionalAddressLine = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setAdditionalAddressLine = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string city = 6;
 * @return {string}
 */
proto.Property.prototype.getCity = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setCity = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional string state = 7;
 * @return {string}
 */
proto.Property.prototype.getState = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * @param {string} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setState = function(value) {
  return jspb.Message.setProto3StringField(this, 7, value);
};


/**
 * optional string zip = 8;
 * @return {string}
 */
proto.Property.prototype.getZip = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/**
 * @param {string} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setZip = function(value) {
  return jspb.Message.setProto3StringField(this, 8, value);
};


/**
 * optional string subdivision = 9;
 * @return {string}
 */
proto.Property.prototype.getSubdivision = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 9, ""));
};


/**
 * @param {string} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setSubdivision = function(value) {
  return jspb.Message.setProto3StringField(this, 9, value);
};


/**
 * optional string directions = 10;
 * @return {string}
 */
proto.Property.prototype.getDirections = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/**
 * @param {string} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setDirections = function(value) {
  return jspb.Message.setProto3StringField(this, 10, value);
};


/**
 * optional string notes = 11;
 * @return {string}
 */
proto.Property.prototype.getNotes = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 11, ""));
};


/**
 * @param {string} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setNotes = function(value) {
  return jspb.Message.setProto3StringField(this, 11, value);
};


/**
 * optional string date_created = 12;
 * @return {string}
 */
proto.Property.prototype.getDateCreated = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 12, ""));
};


/**
 * @param {string} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setDateCreated = function(value) {
  return jspb.Message.setProto3StringField(this, 12, value);
};


/**
 * optional int32 is_active = 13;
 * @return {number}
 */
proto.Property.prototype.getIsActive = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 13, 0));
};


/**
 * @param {number} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setIsActive = function(value) {
  return jspb.Message.setProto3IntField(this, 13, value);
};


/**
 * optional int32 is_residential = 14;
 * @return {number}
 */
proto.Property.prototype.getIsResidential = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 14, 0));
};


/**
 * @param {number} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setIsResidential = function(value) {
  return jspb.Message.setProto3IntField(this, 14, value);
};


/**
 * optional string notification = 15;
 * @return {string}
 */
proto.Property.prototype.getNotification = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 15, ""));
};


/**
 * @param {string} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setNotification = function(value) {
  return jspb.Message.setProto3StringField(this, 15, value);
};


/**
 * optional string firstname = 16;
 * @return {string}
 */
proto.Property.prototype.getFirstname = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 16, ""));
};


/**
 * @param {string} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setFirstname = function(value) {
  return jspb.Message.setProto3StringField(this, 16, value);
};


/**
 * optional string lastname = 17;
 * @return {string}
 */
proto.Property.prototype.getLastname = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 17, ""));
};


/**
 * @param {string} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setLastname = function(value) {
  return jspb.Message.setProto3StringField(this, 17, value);
};


/**
 * optional string businessname = 18;
 * @return {string}
 */
proto.Property.prototype.getBusinessname = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 18, ""));
};


/**
 * @param {string} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setBusinessname = function(value) {
  return jspb.Message.setProto3StringField(this, 18, value);
};


/**
 * optional string phone = 19;
 * @return {string}
 */
proto.Property.prototype.getPhone = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 19, ""));
};


/**
 * @param {string} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setPhone = function(value) {
  return jspb.Message.setProto3StringField(this, 19, value);
};


/**
 * optional string altphone = 20;
 * @return {string}
 */
proto.Property.prototype.getAltphone = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 20, ""));
};


/**
 * @param {string} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setAltphone = function(value) {
  return jspb.Message.setProto3StringField(this, 20, value);
};


/**
 * optional string email = 21;
 * @return {string}
 */
proto.Property.prototype.getEmail = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 21, ""));
};


/**
 * @param {string} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setEmail = function(value) {
  return jspb.Message.setProto3StringField(this, 21, value);
};


/**
 * optional double geolocation_lat = 22;
 * @return {number}
 */
proto.Property.prototype.getGeolocationLat = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 22, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setGeolocationLat = function(value) {
  return jspb.Message.setProto3FloatField(this, 22, value);
};


/**
 * optional double geolocation_lng = 23;
 * @return {number}
 */
proto.Property.prototype.getGeolocationLng = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 23, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setGeolocationLng = function(value) {
  return jspb.Message.setProto3FloatField(this, 23, value);
};


/**
 * repeated string field_mask = 24;
 * @return {!Array<string>}
 */
proto.Property.prototype.getFieldMaskList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 24));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setFieldMaskList = function(value) {
  return jspb.Message.setField(this, 24, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.addFieldMask = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 24, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.clearFieldMaskList = function() {
  return this.setFieldMaskList([]);
};


/**
 * optional int32 page_number = 25;
 * @return {number}
 */
proto.Property.prototype.getPageNumber = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 25, 0));
};


/**
 * @param {number} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setPageNumber = function(value) {
  return jspb.Message.setProto3IntField(this, 25, value);
};


/**
 * repeated string not_equals = 26;
 * @return {!Array<string>}
 */
proto.Property.prototype.getNotEqualsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 26));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setNotEqualsList = function(value) {
  return jspb.Message.setField(this, 26, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.addNotEquals = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 26, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.clearNotEqualsList = function() {
  return this.setNotEqualsList([]);
};


/**
 * optional string order_by = 27;
 * @return {string}
 */
proto.Property.prototype.getOrderBy = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 27, ""));
};


/**
 * @param {string} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setOrderBy = function(value) {
  return jspb.Message.setProto3StringField(this, 27, value);
};


/**
 * optional string order_dir = 28;
 * @return {string}
 */
proto.Property.prototype.getOrderDir = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 28, ""));
};


/**
 * @param {string} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setOrderDir = function(value) {
  return jspb.Message.setProto3StringField(this, 28, value);
};


/**
 * optional string group_by = 29;
 * @return {string}
 */
proto.Property.prototype.getGroupBy = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 29, ""));
};


/**
 * @param {string} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setGroupBy = function(value) {
  return jspb.Message.setProto3StringField(this, 29, value);
};


/**
 * optional bool without_limit = 30;
 * @return {boolean}
 */
proto.Property.prototype.getWithoutLimit = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 30, false));
};


/**
 * @param {boolean} value
 * @return {!proto.Property} returns this
 */
proto.Property.prototype.setWithoutLimit = function(value) {
  return jspb.Message.setProto3BooleanField(this, 30, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.PropertyList.repeatedFields_ = [1];



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
proto.PropertyList.prototype.toObject = function(opt_includeInstance) {
  return proto.PropertyList.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.PropertyList} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.PropertyList.toObject = function(includeInstance, msg) {
  var f, obj = {
    resultsList: jspb.Message.toObjectList(msg.getResultsList(),
    proto.Property.toObject, includeInstance),
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
 * @return {!proto.PropertyList}
 */
proto.PropertyList.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.PropertyList;
  return proto.PropertyList.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.PropertyList} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.PropertyList}
 */
proto.PropertyList.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.Property;
      reader.readMessage(value,proto.Property.deserializeBinaryFromReader);
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
proto.PropertyList.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.PropertyList.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.PropertyList} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.PropertyList.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getResultsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.Property.serializeBinaryToWriter
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
 * repeated Property results = 1;
 * @return {!Array<!proto.Property>}
 */
proto.PropertyList.prototype.getResultsList = function() {
  return /** @type{!Array<!proto.Property>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.Property, 1));
};


/**
 * @param {!Array<!proto.Property>} value
 * @return {!proto.PropertyList} returns this
*/
proto.PropertyList.prototype.setResultsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.Property=} opt_value
 * @param {number=} opt_index
 * @return {!proto.Property}
 */
proto.PropertyList.prototype.addResults = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.Property, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.PropertyList} returns this
 */
proto.PropertyList.prototype.clearResultsList = function() {
  return this.setResultsList([]);
};


/**
 * optional int32 total_count = 2;
 * @return {number}
 */
proto.PropertyList.prototype.getTotalCount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.PropertyList} returns this
 */
proto.PropertyList.prototype.setTotalCount = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


goog.object.extend(exports, proto);