/** Helper function, converts a string into a list representing each of it's characters by charCode */
export function stringToCharCodes(str: string): number[] {
    return str
        .split("")
        .map(char => char.charCodeAt(0));
}