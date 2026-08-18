import { useEffect, useState } from "react";

import { CLOSES_MINUTES, OPENS_MINUTES } from "@/lib/clinic";

export type ClinicStatus = {
  /** 0 = Sunday, matching Date#getDay and the HOURS table. */
  day: number;
  open: boolean;
  label: string;
};

const DAYS: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function readLagosClock() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const lookup: Record<string, string> = {};
  for (const part of parts) lookup[part.type] = part.value;

  return {
    day: DAYS[lookup.weekday] ?? 0,
    minutes: Number(lookup.hour) * 60 + Number(lookup.minute),
  };
}

function describe(day: number, minutes: number): ClinicStatus {
  const isWorkingDay = day >= 1;
  const open = isWorkingDay && minutes >= OPENS_MINUTES && minutes < CLOSES_MINUTES;

  if (open) return { day, open, label: "Open now — closes 6:00pm" };

  // Sunday, or Saturday once we've shut for the day: next opening is Monday.
  const nextIsMonday = day === 0 || (day === 6 && minutes >= CLOSES_MINUTES);
  if (nextIsMonday) {
    return { day, open, label: "Closed — opens Monday 8:00am" };
  }

  return {
    day,
    open,
    label: minutes < OPENS_MINUTES ? "Closed — opens 8:00am" : "Closed — opens 8:00am tomorrow",
  };
}

/**
 * Clock-dependent, so it stays null through SSR and the first paint to keep
 * server and client markup identical. Callers show a neutral placeholder.
 */
export function useClinicStatus(): ClinicStatus | null {
  const [status, setStatus] = useState<ClinicStatus | null>(null);

  useEffect(() => {
    const sync = () => {
      const { day, minutes } = readLagosClock();
      setStatus(describe(day, minutes));
    };

    sync();
    const timer = window.setInterval(sync, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return status;
}
