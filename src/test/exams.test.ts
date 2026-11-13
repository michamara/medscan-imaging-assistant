import { describe, expect, it } from "vitest";
import { DEMO_ANALYSIS_MS, DEMO_RESULT, SAFETY_NOTICE, XRAY_CATEGORIES } from "@/lib/exams";
import { LAB_CASES } from "@/lib/learning-lab";

describe("demo rules", () => {
  it("offers exactly the five x-ray categories", () => {
    expect(XRAY_CATEGORIES.map((c) => c.label)).toEqual(["Chest", "Arm & Hand", "Leg & Foot", "Spine", "Dental"]);
  });

  it("simulated analysis lasts about two seconds", () => {
    expect(DEMO_ANALYSIS_MS).toBe(2000);
  });

  it("uses the required result title, status and disclaimer", () => {
    expect(DEMO_RESULT.title).toBe("Image Analysis — Prototype Preview");
    expect(DEMO_RESULT.status).toBe("PROTOTYPE DEMONSTRATION");
    expect(DEMO_RESULT.disclaimer).toBe(
      "This is an educational prototype, not a medical device. No medical analysis or diagnosis has been performed. Do not use this application to make medical decisions.",
    );
    expect(DEMO_RESULT.paragraphs[1]).toContain("automatic image analysis is not yet available");
  });

  it("uses the required safety notice", () => {
    expect(SAFETY_NOTICE).toBe(
      "Educational demonstration only. This application does not provide medical diagnoses. Do not use its results to make medical decisions. Consult a qualified healthcare professional.",
    );
  });

  it("has the five learning lab cases", () => {
    expect(LAB_CASES.map((c) => c.title)).toEqual([
      "Wrist fracture",
      "Ankle fracture",
      "Healthy wrist",
      "Chest X-ray anatomy",
      "Normal ECG waveform",
    ]);
  });

  it("keeps every highlight inside its image", () => {
    for (const c of LAB_CASES) {
      for (const h of c.highlights) {
        expect(h.cx - h.w / 2).toBeGreaterThanOrEqual(0);
        expect(h.cx + h.w / 2).toBeLessThanOrEqual(100);
        expect(h.cy - h.h / 2).toBeGreaterThanOrEqual(0);
        expect(h.cy + h.h / 2).toBeLessThanOrEqual(100);
      }
    }
  });
});
