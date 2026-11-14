import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { AI_EXPECTED_CLASSES, isLowConfidence, rankScores, toPercent } from "@/lib/ai-experiment";

const modelDir = resolve(__dirname, "../../public/ai-model");

describe("AI Experiment Lab", () => {
  it("ships the trained model with exactly the two classes ECG Diagram and X-ray Illustration", () => {
    const metadata = JSON.parse(readFileSync(resolve(modelDir, "metadata.json"), "utf8"));
    expect(metadata.labels).toEqual([...AI_EXPECTED_CLASSES]);
  });

  it("model.json references weights.bin, which exists", () => {
    const model = JSON.parse(readFileSync(resolve(modelDir, "model.json"), "utf8"));
    expect(model.weightsManifest[0].paths).toEqual(["weights.bin"]);
    expect(statSync(resolve(modelDir, "weights.bin")).size).toBeGreaterThan(0);
  });

  it("ranks the highest score first", () => {
    const ranked = rankScores([
      { className: "ECG Diagram", probability: 0.12 },
      { className: "X-ray Illustration", probability: 0.88 },
    ]);
    expect(ranked[0]!.className).toBe("X-ray Illustration");
  });

  it("formats scores as percentages with one decimal", () => {
    expect(toPercent(0.8749)).toBe("87.5%");
  });

  it("flags a top score below 70% as uncertain", () => {
    expect(isLowConfidence([{ className: "ECG Diagram", probability: 0.65 }, { className: "X-ray Illustration", probability: 0.35 }])).toBe(true);
    expect(isLowConfidence([{ className: "ECG Diagram", probability: 0.95 }, { className: "X-ray Illustration", probability: 0.05 }])).toBe(false);
  });

});
