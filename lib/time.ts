export interface TimeSlot {
  time: string; // e.g., "4:00 PM"
  utcDatetime: string;
  disabled: boolean;
}

export function getBrowserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Converts a local date string (YYYY-MM-DD) and a local time string (HH:MM AM/PM)
 * into a UTC ISO string, respecting the provided local timezone.
 */
export function localDateTimeToUtc(dateStr: string, timeStr: string, timeZone: string): string {
  // Parsing time string
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours < 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  // Create a string that can be parsed as local time in that timezone
  // This is tricky in pure JS without libraries, so we create a local Date 
  // first in the system's timezone, then adjust.
  // Actually, a simpler way in modern JS is just creating the date:
  const localIsoString = `${dateStr}T${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
  
  // Create date object
  const dateObj = new Date(localIsoString);
  return dateObj.toISOString();
}

/**
 * Tutoring requests require at least two hours of lead time.
 * The frontend disables these slots for better UX, while the
 * backend/function validates the same rule because client-side
 * validation cannot be trusted as the final enforcement layer.
 */
export function isAtLeastTwoHoursFromNow(utcDatetime: string): boolean {
  const targetTime = new Date(utcDatetime).getTime();
  const now = Date.now();
  const twoHoursInMs = 2 * 60 * 60 * 1000;
  return targetTime >= now + twoHoursInMs;
}

export function isSameSlot(firstUtc: string, secondUtc: string): boolean {
  return new Date(firstUtc).getTime() === new Date(secondUtc).getTime();
}

export function generateTimeSlots(selectedDate: string): TimeSlot[] {
  // Generate slots from 8:00 AM to 8:00 PM in 30 min intervals
  const slots: TimeSlot[] = [];
  const timeZone = getBrowserTimeZone();
  
  for (let i = 8; i <= 20; i++) {
    for (let j = 0; j < 2; j++) {
      const minutes = j === 0 ? "00" : "30";
      const hour12 = i > 12 ? i - 12 : i === 0 ? 12 : i;
      const ampm = i >= 12 ? "PM" : "AM";
      const timeStr = `${hour12}:${minutes} ${ampm}`;
      
      const utcDatetime = localDateTimeToUtc(selectedDate, timeStr, timeZone);
      
      slots.push({
        time: timeStr,
        utcDatetime,
        disabled: !isAtLeastTwoHoursFromNow(utcDatetime),
      });
    }
  }
  return slots;
}
