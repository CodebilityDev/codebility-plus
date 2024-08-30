export interface TimeLog {
   worked_hours: number,
   excess_hours: number,
   task: {
    title: string,
    duration: number,
    project: {
      name: string
    }
   }
}