export function getSplit(
    string: string,
    splitWith: string,
    { getLast, index = 0 }: { getLast: boolean, index?: number }
) {
    const splittedString = string.split(splitWith);
    return splittedString[getLast ? (splittedString.length - 1): index];
}