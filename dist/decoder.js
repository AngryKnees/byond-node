"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** The magic number identifying byond packets */
const MagicNumber = 131;
/** Known datatype identifier bytes */
var Identifier;
(function (Identifier) {
    Identifier[Identifier["Float"] = 42] = "Float";
    Identifier[Identifier["String"] = 6] = "String";
})(Identifier || (Identifier = {}));
/** byte offsets for byond packets */
var Offset;
(function (Offset) {
    Offset[Offset["MagicNumber"] = 0] = "MagicNumber";
    Offset[Offset["ExpectedDataLength"] = 2] = "ExpectedDataLength";
    Offset[Offset["DataTypeIdentifier"] = 4] = "DataTypeIdentifier";
    Offset[Offset["Data"] = 5] = "Data";
})(Offset || (Offset = {}));
/** Decodes a response buffer and returns it's data */
function decodeBuffer(dbuff) {
    if (dbuff.readInt16BE(Offset.MagicNumber) === MagicNumber) { // Confirm the return packet is in the BYOND format.
        const size = dbuff.readUInt16BE(Offset.ExpectedDataLength) - 1; // Byte size of the string/floating-point (minus the identifier byte).
        const data = dbuff.slice(Offset.Data, Offset.Data + size); // Take the data section
        if (dbuff[Offset.DataTypeIdentifier] === Identifier.String) { // ASCII String.
            return String.fromCharCode(...data); // Return the data section as a string
        }
        else {
            return data;
        }
    }
}
exports.decodeBuffer = decodeBuffer;
