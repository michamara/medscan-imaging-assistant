/** Pure, browser-safe constants and helpers for the AI Experiment Lab. */
export const AI_MODEL_URL = "/ai-model/model.json";
export const AI_METADATA_URL = "/ai-model/metadata.json";

export const AI_EXPERIMENT_NOTICE =
  "Educational AI experiment only. This model classifies images as ECG diagrams or X-ray illustrations. It does not detect fractures, diagnose diseases, or provide medical advice.";

export const AI_SCORE_EXPLANATION =
  "Scores show how strongly the model's output leans toward each category. They always add up to about 100% and are not guaranteed probabilities that the prediction is correct. The model only knows these two categories, so any image — even an unrelated photo — will be placed into one of them.";

export const AI_EXPECTED_CLASSES = ["ECG Diagram", "X-ray Illustration"] as const;

/** Below this top score the result is shown as uncertain. */
export const LOW_CONFIDENCE_THRESHOLD = 0.7;

export interface ClassScore {
  className: string;
  probability: number;
}

/** Sorts scores from highest to lowest and clamps each one to the 0–1 range. */
export function rankScores(scores: ReadonlyArray<ClassScore>): ClassScore[] {
  return scores
    .map((s) => ({
      className: s.className,
      probability: Number.isFinite(s.probability) ? Math.min(1, Math.max(0, s.probability)) : 0,
    }))
    .sort((a, b) => b.probability - a.probability);
}

export function toPercent(probability: number): string {
  return `${(Math.min(1, Math.max(0, probability)) * 100).toFixed(1)}%`;
}

export function isLowConfidence(scores: ReadonlyArray<ClassScore>): boolean {
  const top = rankScores(scores)[0];
  return !top || top.probability < LOW_CONFIDENCE_THRESHOLD;
}
