/**
 * Split the string and get the substring (part of a string) we wanted from the string.
 * 
 * @param string - the string to split
 * @param splitWith - what to split the string with
 * @param { getLast, index } - the target index. either get the last or specify an index 
 * @returns {string} the target substring we wanted to get from the split.
 */

export function getSplit(
    string: string,
    splitWith: string,
    { getLast, index = 0 }: { getLast: boolean, index?: number }
) {
    const splittedString = string.split(splitWith);
    return splittedString[getLast ? (splittedString.length - 1): index];
}