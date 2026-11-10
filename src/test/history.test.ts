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
