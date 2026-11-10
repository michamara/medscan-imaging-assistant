import { describe, expect, it } from "vitest";
import { validateImageFile, MAX_FILE_SIZE_BYTES } from "@/lib/file-validation";

const f = (name: string, type: string, size = 50_000) => ({ name, type, size });

describe("validateImageFile", () => {
  it("accepts JPG, JPEG and PNG", () => {
    expect(validateImageFile(f("a.jpg", "image/jpeg")).ok).toBe(true);
    expect(validateImageFile(f("a.JPEG", "image/jpeg")).ok).toBe(true);
    expect(validateImageFile(f("a.png", "image/png")).ok).toBe(true);
  });
  it("rejects other formats", () => {
    expect(validateImageFile(f("a.gif", "image/gif")).ok).toBe(false);
    expect(validateImageFile(f("scan.pdf", "application/pdf")).ok).toBe(false);
  });
  it("rejects files over 10 MB", () => {
    expect(MAX_FILE_SIZE_BYTES).toBe(10 * 1024 * 1024);
    expect(validateImageFile(f("a.png", "image/png", MAX_FILE_SIZE_BYTES + 1)).ok).toBe(false);
    expect(validateImageFile(f("a.png", "image/png", MAX_FILE_SIZE_BYTES)).ok).toBe(true);
  });
});
