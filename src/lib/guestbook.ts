/* ============================================================================
   guestbook.ts — GuestbookStore: localStorage read / write. Client-only.
   Key: "mo_guestbook_v1"
============================================================================ */

export const GUESTBOOK_KEY = "mo_guestbook_v1";

export type WishEntry = {
  id: string;
  name: string;
  message: string;
  timestamp: number;
};

export type WishInput = {
  name: string;
  message: string;
};

export const WISH_MAX = 220;

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
  return `wish_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function normalize(input: WishInput): WishEntry {
  return {
    id: generateId(),
    name: input.name.trim().slice(0, 60),
    message: input.message.trim().slice(0, WISH_MAX),
    timestamp: Date.now(),
  };
}

export const GuestbookStore = {
  all(): WishEntry[] {
    const storage = safeStorage();
    if (!storage) return [];
    try {
      const raw = storage.getItem(GUESTBOOK_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((e): e is WishEntry => {
          if (!e || typeof e !== "object") return false;
          const entry = e as Record<string, unknown>;
          return (
            typeof entry.id === "string" &&
            typeof entry.name === "string" &&
            typeof entry.message === "string" &&
            typeof entry.timestamp === "number"
          );
        })
        .sort((a, b) => b.timestamp - a.timestamp);
    } catch {
      return [];
    }
  },

  add(input: WishInput): WishEntry {
    const entry = normalize(input);
    if (!entry.name || !entry.message) return entry;
    const storage = safeStorage();
    if (storage) {
      const next = [entry, ...this.all()];
      storage.setItem(GUESTBOOK_KEY, JSON.stringify(next));
    }
    return entry;
  },

  remove(id: string): void {
    const storage = safeStorage();
    if (!storage) return;
    const next = this.all().filter((e) => e.id !== id);
    storage.setItem(GUESTBOOK_KEY, JSON.stringify(next));
  },

  clear(): void {
    const storage = safeStorage();
    if (!storage) return;
    storage.removeItem(GUESTBOOK_KEY);
  },
};
