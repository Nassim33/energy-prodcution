export const WEEK_WINDOW_DAYS = 7;

export function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const offsetMinutes = -date.getTimezoneOffset();
  const offsetSign = offsetMinutes >= 0 ? "+" : "-";
  const offsetHours = String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(2, "0");
  const offsetMins = String(Math.abs(offsetMinutes) % 60).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMins}`;
}

export function getWeeklyWindow(now = new Date()): { startDate: string; endDate: string } {
  const end = now;
  const start = new Date(end);
  start.setDate(start.getDate() - WEEK_WINDOW_DAYS);
  return { startDate: formatIsoDate(start), endDate: formatIsoDate(end) };
}

export function parseRteDate(value: string): Date {
  return new Date(value);
}
