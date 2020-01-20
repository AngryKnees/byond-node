"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Helper function, converts a string into a list representing each of it's characters by charCode */
function stringToCharCodes(str) {
    return str
        .split("")
        .map(char => char.charCodeAt(0));
}
exports.stringToCharCodes = stringToCharCodes;
