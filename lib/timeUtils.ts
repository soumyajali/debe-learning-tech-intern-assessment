const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;

function toLocalInputValue(date: Date): string {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return offsetDate.toISOString().slice(0, 16);
}

/** Returns true when a local datetime selection is earlier than the two-hour policy boundary. */
export function isSlotWithinTwoHours(localDatetimeString: string): boolean {
  const selectedTime = new Date(localDatetimeString).getTime();
  if (Number.isNaN(selectedTime)) {
    return true;
  }

  return selectedTime < Date.now() + TWO_HOURS_IN_MS;
}

/** Returns the browser-local value expected by a datetime-local input's min attribute. */
export function getMinLocalDatetime(): string {
  const boundary = new Date(Date.now() + TWO_HOURS_IN_MS);
  // datetime-local has minute precision, so round up rather than offering a slot
  // that falls a few seconds inside the policy boundary.
  boundary.setMinutes(boundary.getMinutes() + 1, 0, 0);
  return toLocalInputValue(boundary);
}

/**
 * Values are selected and displayed in the parent's local timezone for intuitive UX,
 * but are transmitted and stored as UTC ISO strings to prevent cross-timezone scheduling bugs.
 */
export function localToUtcIso(localDatetimeString: string): string {
  const date = new Date(localDatetimeString);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Please select a valid date and time.");
  }

  return date.toISOString();
}

/**
 * The parent selects the requested slot in their browser's local time.
 * We convert that local value to UTC before sending it to the function.
 * This gives the backend one unambiguous representation regardless
 * of the parent's timezone or daylight-saving rules.
 */
export function localDateTimeToUtcIso(date: string, time: string): string {
  return localToUtcIso(`${date}T${time}`);
}

/** Converts a stored UTC timestamp to a friendly browser-local date and time. */
export function formatLocalDisplay(utcIsoString: string): string {
  const date = new Date(utcIsoString);
  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
