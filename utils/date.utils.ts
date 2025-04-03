import { DateData } from "react-native-calendars";

/**
 * Checks if dates are equal having only into account day, month and year.
 *
 * @param date1 the first date to compare
 * @param date2 the second date to compare
 * @returns a boolean indicating whether dates are equal
 */
export function areDatesEqual(date1: Date, date2: Date): boolean {
  return (
    date1.getDay() === date2.getDay() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

/**
 * Gets the week of the year of a date.
 *
 * @param date the date to get the week of the year from
 * @returns a number indicating the week of the year of the date
 */
export function getWeekOfYear(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Converts a Date object in a DateData object
 *
 *  @param date the date to be converted
 *  @returns the DateData object
 */
export function dateToDateData(date: Date): DateData {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDay(),
    dateString: date.toDateString(),
    timestamp: date.valueOf(),
  };
}

/**
 * Converts a DateData object in a Date object
 *
 * @param dateData the DateData object to be converted
 * @returns the Date object
 */
export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp);
}

/**
 * Gets the marked date string format from a date
 * @param date the date
 * @returns the marked date string format
 */
export function getMarkedDateFormatFromDate(date: Date): string {
  const formattedMonth = (date.getMonth() + 1).toString().padStart(2, "0");
  const formattedDate = date.getDate().toString().padStart(2, "0");
  return `${date.getFullYear()}-${formattedMonth}-${formattedDate}`;
}

/**
 * Sets the time of a date to cero
 * @param date the date
 */
export function emptyDateTime(date: Date): void {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
}
