/* ============================================================================
   rsvp.ts — RSVPStore: localStorage read / write / export. Client-only.
   Key: "mo_rsvp_v1"
============================================================================ */

export const RSVP_KEY = "mo_rsvp_v1";
export const ADMIN_PASSWORD = "marina2026";

export type RsvpEntry = {
  id: string;
  name: string;
  totalGuests: number;
  timestamp: number;
};

/** The guest-facing payload (name + extra guests 0–3). */
export type RsvpInput = {
  name: string;
  extraGuests: number;
};

const EXTRA_MIN = 0;
const EXTRA_MAX = 3;

export function clampExtraGuests(value: number): number {
  if (Number.isNaN(value)) return EXTRA_MIN;
  return Math.min(EXTRA_MAX, Math.max(EXTRA_MIN, Math.floor(value)));
}

export function totalGuests(extraGuests: number): number {
  // the respondent themselves + extra companions
  return 1 + clampExtraGuests(extraGuests);
}

function safeStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `rsvp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export const RSVPStore = {
  /** Read every entry, newest first. */
  all(): RsvpEntry[] {
    const storage = safeStorage();
    if (!storage) return [];
    try {
      const raw = storage.getItem(RSVP_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((e): e is RsvpEntry => {
          if (!e || typeof e !== "object") return false;
          const entry = e as Record<string, unknown>;
          return (
            typeof entry.id === "string" &&
            typeof entry.name === "string" &&
            typeof entry.totalGuests === "number" &&
            typeof entry.timestamp === "number"
          );
        })
        .sort((a, b) => b.timestamp - a.timestamp);
    } catch {
      return [];
    }
  },

  stats(): { count: number; guests: number } {
    const entries = this.all();
    return {
      count: entries.length,
      guests: entries.reduce((sum, e) => sum + e.totalGuests, 0),
    };
  },

  /** Create a new entry from guest input and persist it. */
  add(input: RsvpInput): RsvpEntry {
    const name = input.name.trim();
    const entry: RsvpEntry = {
      id: generateId(),
      name,
      totalGuests: totalGuests(input.extraGuests),
      timestamp: Date.now(),
    };
    const storage = safeStorage();
    if (storage) {
      const entries = this.all();
      const next = [entry, ...entries];
      storage.setItem(RSVP_KEY, JSON.stringify(next));
    }
    return entry;
  },

  remove(id: string): void {
    const storage = safeStorage();
    if (!storage) return;
    const next = this.all().filter((e) => e.id !== id);
    storage.setItem(RSVP_KEY, JSON.stringify(next));
  },

  clear(): void {
    const storage = safeStorage();
    if (!storage) return;
    storage.removeItem(RSVP_KEY);
  },

  /** Export the current dataset as RFC-4180 CSV text. */
  toCsv(): string {
    const header = ["id", "name", "total_guests", "timestamp_iso"];
    const rows = this.all().map((e) => [
      e.id,
      escapeCsv(e.name),
      String(e.totalGuests),
      new Date(e.timestamp).toISOString(),
    ]);
    return [header, ...rows].map((r) => r.join(",")).join("\r\n");
  },
};

function escapeCsv(value: string): string {
  const needs = /[",\r\n]/.test(value);
  const safe = value.replace(/"/g, '""');
  return needs ? `"${safe}"` : safe;
}
