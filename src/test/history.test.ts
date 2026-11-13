import { beforeEach, describe, expect, it } from "vitest";
import { addSession, clearHistory, deleteSession, getHistory, HISTORY_STORAGE_KEY } from "@/lib/history";

describe("demo history", () => {
  beforeEach(() => localStorage.clear());

  it("stores only non-sensitive metadata", () => {
    addSession({ type: "ecg", format: "PNG", sizeKb: 120.4 });
    const stored = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY)!)[0];
    expect(Object.keys(stored).sort()).toEqual(["createdAt", "format", "id", "sizeKb", "type"]);
  });

  it("deletes one session and clears all", () => {
    const a = addSession({ type: "ecg", format: "JPG", sizeKb: 10 });
    addSession({ type: "xray", format: "PNG", sizeKb: 20 });
    deleteSession(a.id);
    expect(getHistory().map((s) => s.type)).toEqual(["xray"]);
    clearHistory();
    expect(getHistory()).toEqual([]);
  });
});

describe("x-ray category metadata", () => {
  beforeEach(() => localStorage.clear());

  it("keeps the chosen category for x-ray sessions", () => {
    addSession({ type: "xray", format: "JPG", sizeKb: 50, category: "dental" });
    expect(getHistory()[0]?.category).toBe("dental");
  });

  it("never stores a category on ECG sessions", () => {
    addSession({ type: "ecg", format: "JPG", sizeKb: 50, category: "spine" });
    expect(getHistory()[0]?.category).toBeUndefined();
  });

  it("drops stored entries with an unknown category", () => {
    localStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify([{ id: "a", type: "xray", createdAt: new Date().toISOString(), format: "PNG", sizeKb: 1, category: "brain" }]),
    );
    expect(getHistory()).toEqual([]);
  });
});
