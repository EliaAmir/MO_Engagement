/** Join class names, skipping falsy values. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Linear interpolation. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Map a value from one range to another, clamped to the output range. */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  const t = (value - inMin) / (inMax - inMin);
  return clamp(outMin + (outMax - outMin) * t, Math.min(outMin, outMax), Math.max(outMin, outMax));
}

/** Zero-pad a number to a fixed width (used by the countdown). */
export function pad(value: number, width = 2): string {
  return String(Math.max(0, Math.floor(value))).padStart(width, "0");
}

/** Build a Google Maps place search URL. */
export function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Build a Google Maps directions URL. */
export function directionsUrl(query: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

/** Convert a Date to a UTC "YYYYMMDDTHHMMSSZ" stamp for .ics / calendars. */
export function toIcsStamp(date: Date): string {
  const pad2 = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getUTCFullYear()}${pad2(date.getUTCMonth() + 1)}${pad2(date.getUTCDate())}` +
    `T${pad2(date.getUTCHours())}${pad2(date.getUTCMinutes())}${pad2(date.getUTCSeconds())}Z`
  );
}

/** RFC 5545 line folding at 75 octets. */
export function foldIcs(text: string): string {
  if (text.length <= 75) return text;
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push((i === 0 ? "" : " ") + text.slice(i, i + 73));
    i += 73;
  }
  return chunks.join("\r\n");
}

/** Escape text for use inside an iCalendar property. */
export function escapeIcs(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}
