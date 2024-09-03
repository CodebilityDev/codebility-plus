export function formatToUnix(time: string): number {
    var currentDateTime = new Date()
  
    var [hours, minutes] = time.split(":").map(function (item) {
      return parseInt(item, 10)
    })
  
    if (time.includes("PM")) {
      if (hours !== 12) {
        hours! += 12
      }
    } else if (hours === 12) {
      hours = 0
    }
  
    currentDateTime.setHours(hours!, minutes, 0, 0)
  
    return currentDateTime.getTime()
}

export function formatToLocaleTime(unix: number): string {
  const date = new Date(unix);
  return date.toLocaleString();
}