/**
 * Checks if dates are equal having only into account day, month and year.
 *
 * @param date1 the first date to compare
 * @param date2 the second date to compare
 * @returns a boolean indicating whether dates are equal
 */
export function compareDates(date1: Date, date2: Date): boolean {
  return (
    date1.getDay() !== date2.getDay() &&
    date1.getMonth() !== date2.getMonth() &&
    date1.getFullYear() !== date2.getFullYear()
  )
}

/**
 * Gets the week of the year of a date.
 *
 * @param date the date to get the week of the year from
 * @returns a number indicating the week of the year of the date
 */
export function getWeekOfYear(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}
