"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies.
const net_1 = require("net");
const util_1 = require("./util");
const decoder_1 = require("./decoder");
/** Class that handles byond connections */
class ByondClient {
    constructor(opts) {
        this.timeout = opts.timeout || 2000;
        this.port = typeof opts.port === "number"
            ? opts.port
            : parseInt(opts.port);
        this.address = opts.address || "localhost";
    }
    /** Async communication with BYOND gameservers. */
    call(req) {
        return new Promise((resolve, reject) => {
            // All queries must begin with a question mark (ie "?players")
            if (!req.startsWith("?")) {
                req = "?" + req;
            }
            // Use an unsigned short for the "expected data length" portion of the packet.
            const expectedLengthBytes = new Uint8Array(Uint16Array.of(req.length + 6).buffer);
            // Custom packet creation- BYOND expects special packets, this is based off /tg/'s PHP scripts containing a reverse engineered packet format.
            const query = [
                0x00, 0x83,
                ...expectedLengthBytes,
                0x00, 0x00, 0x00, 0x00, 0x00,
                ...util_1.stringToCharCodes(req),
                0x00
            ];
            // Convert our new hex string into an actual buffer.
            const querybuff = Buffer.from(query);
            /* Networking section */
            /* Now that we have our data in a binary buffer, start sending and recieving data. */
            // Uses a normal net.Socket to send the custom packets.
            const socket = new net_1.Socket({
                readable: true,
                writable: true
            });
            // Timeout handler. Removed upon successful connection.
            const tHandler = () => {
                reject(new Error("Connection failed."));
                socket.destroy();
            };
            // Timeout after self.timeout (default 2) seconds of inactivity, the game server is either extremely laggy or isn't up.
            socket.setTimeout(this.timeout);
            // Add the event handler.
            socket.on("timeout", tHandler);
            // Error handler. If an error happens in the socket API, it'll be given back to us here.
            const eHandler = (err) => {
                reject(err);
                socket.destroy();
            };
            // Add the error handler.
            socket.on("error", eHandler);
            // Establish the connection to the server.
            socket.connect({
                port: this.port,
                host: this.address,
                family: 4 // Use IPv4.
            });
            socket.on("connect", () => {
                // The timeout handler will interfere later, as the game server never sends an END packet.
                // So, we just wait for it to time out to ensure we have all the data.
                socket.removeListener("timeout", tHandler);
                // Send the custom buffer data over the socket.
                socket.write(querybuff);
                // Recieve data in the form of a buffer.
                let assembledBuffer = Buffer.from([]);
                socket.on("data", rbuff => {
                    assembledBuffer = Buffer.concat([assembledBuffer, rbuff]);
                });
                // Since BYOND doesn't send END packets, wait for timeout before trying to parse the returned data.
                socket.on("timeout", () => {
                    // Decode the assembled data.
                    const recieved_data = decoder_1.decodeBuffer(assembledBuffer);
                    // The catch will deal with any errors from decode_buffer, but it could fail without erroring, so, make sure there's any data first.
                    if (recieved_data) {
                        resolve(recieved_data);
                    }
                    else {
                        reject(`Unable to parse response to ${req}`);
                    }
                    // Assume the socket is done sending data, and close the connection.
                    socket.end();
                });
            });
        });
    }
}
exports.default = ByondClient;
;
