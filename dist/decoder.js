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
        if (dbuff[Offset.DataTypeIdentifier] === Identifier.Float) { // 4-byte big-endian floating point data.
            return dbuff.readFloatBE(Offset.Data); // return the data section, assumed to be 4 bytes, as a Big Endian 32 bit float
        }
        else if (dbuff[Offset.DataTypeIdentifier] === Identifier.String) { // ASCII String.
            const data = dbuff.slice(Offset.Data, Offset.Data + size); // Take the data section
            return String.fromCharCode(...data); // Return the data section as a string
        }
        else {
            throw new Error("No data returned."); // Something went wrong, the packet contains no apparent data. Error as "no data returned".
        }
    }
}
exports.decodeBuffer = decodeBuffer;
