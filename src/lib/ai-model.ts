/**
 * Browser-only loader for the trained Teachable Machine model in /public/ai-model.
 * The libraries are imported dynamically so they never run during SSR.
 * Inference happens entirely in the browser — images are never sent anywhere.
 */
import type { CustomMobileNet } from "@teachablemachine/image";
import { AI_METADATA_URL, AI_MODEL_URL, rankScores, type ClassScore } from "./ai-experiment";

export class ModelLoadError extends Error {}
export class InferenceError extends Error {}

export interface LoadedModel {
  model: CustomMobileNet;
  labels: string[];
  imageSize: number;
  backend: string;
}

let modelPromise: Promise<LoadedModel> | null = null;

async function assertReachable(url: string) {
  let res: Response;
  try {
    res = await fetch(url, { method: "GET", cache: "force-cache" });
  } catch {
    throw new ModelLoadError("The model files could not be reached. Please check your internet connection and try again.");
  }
  if (!res.ok) throw new ModelLoadError(`A model file is missing (${url} returned ${res.status}).`);
}

export function loadClassifier(): Promise<LoadedModel> {
  if (!modelPromise) {
    modelPromise = (async () => {
      await Promise.all([assertReachable(AI_MODEL_URL), assertReachable(AI_METADATA_URL)]);
      try {
        const [tf, tmImage] = await Promise.all([import("@tensorflow/tfjs"), import("@teachablemachine/image")]);
        await tf.ready();
        const model = await tmImage.load(AI_MODEL_URL, AI_METADATA_URL);
        const labels = model.getClassLabels();
        if (!labels.length) throw new Error("no labels");
        return { model, labels, imageSize: tmImage.IMAGE_SIZE, backend: tf.getBackend() };
      } catch (err) {
        if (err instanceof ModelLoadError) throw err;
        throw new ModelLoadError("The AI model could not be loaded in this browser. Please refresh the page and try again.");
      }
    })().catch((err) => {
      modelPromise = null; // allow a retry
      throw err;
    });
  }
  return modelPromise;
}

function decodeImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new InferenceError("The image could not be read. Please choose another JPG or PNG file."));
    img.src = url;
  });
}

export async function classifyImage(model: LoadedModel, objectUrl: string): Promise<{ scores: ClassScore[]; ms: number }> {
  const img = await decodeImage(objectUrl);
  const started = performance.now();
  try {
    const raw = await model.model.predict(img);
    return { scores: rankScores(raw), ms: Math.round(performance.now() - started) };
  } catch {
    throw new InferenceError("The model could not process this image. Please try a different JPG or PNG file.");
  }
}
