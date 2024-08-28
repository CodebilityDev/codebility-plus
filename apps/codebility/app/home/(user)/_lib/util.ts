/**
 * Transform a second to a string format of hh:mm (e.g 12:30)
 * 
 * @param seconds - number of seconds to convert.
 * @returns {string} - formatted second in (hh:mm)
 */
export const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}