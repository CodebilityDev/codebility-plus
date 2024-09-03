
/**
 * As its name implies remove duplicates from array 
 * example: ["a","b","a","c"] -> ["a","b","c"]
 * 
 * @param array - the array that we will check for duplicates. 
 * @returns {array[]} - the original array, but without duplicate.
 */
export const removeArrayDuplicate = (array: any[]) => {
   return array.filter((value, index, array) => {
     if (!value) return false;
     const valueIndex = array.findIndex((val) => value === val)
     return index === valueIndex
   });
}