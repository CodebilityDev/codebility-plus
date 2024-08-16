type TimelogData = {
  task: string
  points: number
  renderedHours: string
  durationHours: string
  project: string
}
export const logData: TimelogData[] = [
  {
    task: "BE-Add New Property",
    points: 5,
    renderedHours: "1.5",
    durationHours: "1.0",
    project: "Tap Up",
  },
  {
    task: "BE-Add New Property",
    points: 6,
    renderedHours: "1.0",
    durationHours: "1.0",
    project: "Tap Up",
  },
  {
    task: "BE-Add New Property",
    points: 3,
    renderedHours: "2.0",
    durationHours: "1.0",
    project: "Tap Up",
  },
  {
    task: "BE-Add New Property",
    points: 3,
    renderedHours: "2.0",
    durationHours: "1.0",
    project: "Tap Up",
  },
  {
    task: "BE-Add New Property",
    points: 3,
    renderedHours: "2.0",
    durationHours: "1.0",
    project: "Tap Up",
  },
  {
    task: "BE-Add New Property",
    points: 3,
    renderedHours: "2.0",
    durationHours: "1.0",
    project: "Tap Up",
  },
  {
    task: "BE-Add New Property",
    points: 3,
    renderedHours: "2.0",
    durationHours: "1.0",
    project: "Tap Up",
  },
  {
    task: "BE-Add New Property",
    points: 3,
    renderedHours: "2.0",
    durationHours: "1.0",
    project: "Tap Up",
  },
  {
    task: "BE-Add New Property",
    points: 3,
    renderedHours: "2.0",
    durationHours: "2.0",
    project: "Tap Up",
  },
  {
    task: "BE-Add New Property",
    points: 3,
    renderedHours: "2.0",
    durationHours: "5.0",
    project: "Tap Up",
  },
  {
    task: "BE-Add New Property",
    points: 3,
    renderedHours: "12.0",
    durationHours: "5.0",
    project: "Tap Up",
  },
  {
    task: "BE-Add New Property",
    points: 3,
    renderedHours: "2.0",
    durationHours: "5.0",
    project: "Tap Up",
  },
]
const calculateTotalRenderedHours = (data: TimelogData[]) => {
  return data.reduce((total, entry) => total + parseFloat(entry.renderedHours), 0)
}
export const totalRenderedHours = calculateTotalRenderedHours(logData)

const calculateExcessHours = (data: TimelogData[]) => {
  return data.reduce((totalExcess, entry) => {
    const excess = parseFloat(entry.renderedHours) - parseFloat(entry.durationHours)
    return totalExcess + Math.max(excess, 0)
  }, 0)
}
export const excessHours = calculateExcessHours(logData)
