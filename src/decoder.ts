
/** The magic number identifying byond packets */
const MagicNumber = 0x00_83; 

/** Known datatype identifier bytes */
enum Identifier {
    Float = 0x2a,
    String = 0x06
}

/** byte offsets for byond packets */
enum Offset {
    MagicNumber = 0,
    ExpectedDataLength = 2,
    DataTypeIdentifier = 4,
    Data = 5
}

/** Decodes a response buffer and returns it's data */
export function decodeBuffer(dbuff: Buffer): string | Buffer | undefined {
	if (dbuff.readInt16BE(Offset.MagicNumber) === MagicNumber) { // Confirm the return packet is in the BYOND format.
        const size = dbuff.readUInt16BE(Offset.ExpectedDataLength) - 1 // Byte size of the string/floating-point (minus the identifier byte).
        const data = dbuff.slice(Offset.Data, Offset.Data + size); // Take the data section

        if (dbuff[Offset.DataTypeIdentifier] === Identifier.String) { // ASCII String.
			return String.fromCharCode(...data); // Return the data section as a string
		} else {
            return data;
        }
	}
}