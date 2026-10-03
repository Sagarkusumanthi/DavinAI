const TIMEZONE = "Asia/Kolkata";

export const SLOT_WINDOWS: Record<"MORNING" | "AFTERNOON" | "EVENING", { startHour: number; endHour: number; label: string }> = {
  MORNING: { startHour: 9, endHour: 12, label: "Morning · 9am–12pm" },
  AFTERNOON: { startHour: 12, endHour: 16, label: "Afternoon · 12pm–4pm" },
  EVENING: { startHour: 16, endHour: 20, label: "Evening · 4pm–8pm" },
};

/** Returns the current wall-clock date/time components in Asia/Kolkata. */
export function nowInKolkata(): { year: number; month: number; day: number; hour: number; minute: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day"), hour: get("hour"), minute: get("minute") };
}

/** Validates a yyyy-mm-dd date + slot is not in the past relative to Asia/Kolkata "now". */
export function isScheduleValid(dateStr: string, slot: "MORNING" | "AFTERNOON" | "EVENING"): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return false;
  const [, y, m, d] = match.map(Number) as unknown as [number, number, number, number];
  const now = nowInKolkata();
  const todayNum = now.year * 10000 + now.month * 100 + now.day;
  const targetNum = y * 10000 + m * 100 + d;
  if (targetNum < todayNum) return false;
  if (targetNum > todayNum) return true; // future date - always valid
  // same day: slot must not have elapsed (compare end hour against current time)
  const window = SLOT_WINDOWS[slot];
  if (!window) return false;
  const nowMinutes = now.hour * 60 + now.minute;
  return nowMinutes < window.endHour * 60;
}

export function formatKolkata(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: TIMEZONE,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
