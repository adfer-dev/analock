/**
 * Formats the given template string with the given arguments
 *
 * @param template the string to be formatted
 * @param args the arguments
 *@returns the formatted string
 */
export function formatString(template: string, ...args): string {
  return template.replace(/{(\d+)}/g, function (match, index): string {
    return typeof args[index] !== "undefined" ? args[index] : match;
  });
}
