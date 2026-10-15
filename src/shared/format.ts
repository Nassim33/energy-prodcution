const numberFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
});

const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const compactDateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatMegawatts(value: number): string {
  return `${formatNumber(value)} MW`;
}

export function formatDate(value: Date): string {
  return dateFormatter.format(value);
}

export function formatTime(value: Date): string {
  return timeFormatter.format(value);
}

export function formatDateTime(value: Date): string {
  return dateTimeFormatter.format(value);
}

export function formatCompactDateTime(value: Date): string {
  return compactDateTimeFormatter.format(value);
}
