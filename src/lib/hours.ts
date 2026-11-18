import type { OpeningHours, OpeningPeriod, Weekday } from "@/types/content";

export const weekdayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"] as const;

const weekdayIndex: Record<string, Weekday> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export function zonedNow(timezone: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";

  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    weekday: weekdayIndex[get("weekday")] ?? 0,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

const toMinutes = (time: string) => {
  const [h = 0, m = 0] = time.split(":").map(Number);
  return h * 60 + m;
};

export function periodsFor(hours: OpeningHours, date: string, weekday: Weekday) {
  const exception = hours.exceptions.find((e) => e.date === date);
  return { periods: exception ? exception.periods : hours.week[weekday], exception };
}

export type OpenState =
  | { open: true; closesAt: string; exception?: string }
  | { open: false; next?: { time: string; dayOffset: number; weekday: Weekday }; exception?: string };

function addDays(date: string, days: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function getOpenState(hours: OpeningHours, now = new Date()): OpenState {
  const { date, weekday, minutes } = zonedNow(hours.timezone, now);
  const { periods, exception } = periodsFor(hours, date, weekday);
  const label = exception?.label;

  const current = periods.find((p) => minutes >= toMinutes(p.opens) && minutes < toMinutes(p.closes));
  if (current) return { open: true, closesAt: current.closes, exception: label };

  const laterToday = periods.find((p) => toMinutes(p.opens) > minutes);
  if (laterToday) return { open: false, next: { time: laterToday.opens, dayOffset: 0, weekday }, exception: label };

  for (let offset = 1; offset <= 7; offset++) {
    const day = ((weekday + offset) % 7) as Weekday;
    const first = periodsFor(hours, addDays(date, offset), day).periods[0];
    if (first) return { open: false, next: { time: first.opens, dayOffset: offset, weekday: day }, exception: label };
  }
  return { open: false, exception: label };
}

export function describeNext(next: { time: string; dayOffset: number; weekday: Weekday }) {
  const day =
    next.dayOffset === 0 ? "hoje" : next.dayOffset === 1 ? "amanhã" : weekdayNames[next.weekday].toLowerCase();
  return `abre ${day} às ${formatTime(next.time)}`;
}

export function formatTime(time: string) {
  const [h = "0", m = "00"] = time.split(":");
  return `${Number(h)}h${m === "00" ? "" : m}`;
}

export function formatPeriods(periods: OpeningPeriod[]) {
  if (periods.length === 0) return "Fechado";
  return periods.map((p) => `${formatTime(p.opens)} às ${formatTime(p.closes)}`).join(" e ");
}

export function isCompleteHours(hours: OpeningHours | undefined): hours is OpeningHours {
  return Boolean(hours && hours.status === "verified");
}
