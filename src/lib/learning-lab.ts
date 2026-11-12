import wristFracture from "@/assets/lab/lab-wrist-fracture.jpg.asset.json";
import ankleFracture from "@/assets/lab/lab-ankle-fracture.jpg.asset.json";
import healthyWrist from "@/assets/lab/lab-healthy-wrist.jpg.asset.json";
import chestPa from "@/assets/lab/lab-chest-pa.jpg.asset.json";

/**
 * Prepared educational examples. Images are openly licensed, anonymised
 * radiographs from Wikimedia Commons. Every highlight marks a region named in
 * the original author's description (or standard anatomy) and was placed by
 * checking the image itself — never invented.
 * Coordinates are percentages of the image width / height (centre + size).
 */
export interface LabHighlight {
  cx: number;
  cy: number;
  w: number;
  h: number;
  label: string;
  labelAt?: "top" | "bottom";
}

export interface LabCredit {
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
}

export type LabMedia =
  | { kind: "image"; url: string; width: number; height: number; alt: string; credit: LabCredit; note?: string }
  | { kind: "ecg"; alt: string };

export interface LabCase {
  id: string;
  title: string;
  category: string;
  tone: "fracture" | "normal";
  finding: string;
  summary: string;
  explanation: string[];
  lookFor: string[];
  highlightCaption: string;
  highlights: LabHighlight[];
  media: LabMedia;
}

export const LAB_CASES: LabCase[] = [
  {
    id: "wrist-fracture",
    title: "Wrist fracture",
    category: "Arm & Hand",
    tone: "fracture",
    finding: "Distal radius fracture (Colles' type), with a small break of the ulnar styloid — as described by the image author.",
    summary: "A break of the radius just above the wrist, one of the most common broken bones in adults.",
    explanation: [
      "The forearm has two bones: the radius on the thumb side and the ulna on the little-finger side. The end of the radius closest to the hand is called the distal radius.",
      "A Colles' fracture is a break of the distal radius, often after falling onto an outstretched hand. The broken end typically shifts towards the back of the hand.",
      "On the front view (left) the break shows up as an irregular dark line crossing the radius a short distance above the wrist joint. The side view (right) shows the same fracture from a different angle — doctors usually look at two views because one view alone can hide a break.",
    ],
    lookFor: [
      "An irregular dark line crossing the bright bone",
      "A step or bend in the normally smooth bone outline",
      "Compare with the Healthy wrist example",
    ],
    highlightCaption: "Highlights mark the fracture site indicated by the blue arrows in the original image.",
    highlights: [
      { cx: 31.5, cy: 51, w: 24, h: 9, label: "Fracture line · front view", labelAt: "top" },
      { cx: 76, cy: 47.5, w: 13, h: 10, label: "Same fracture · side view", labelAt: "top" },
    ],
    media: {
      kind: "image",
      url: wristFracture.url,
      width: 1086,
      height: 1200,
      alt: "Two X-ray views of a left wrist, front and side, with blue arrows pointing at a fracture of the distal radius.",
      note: "The blue arrows are part of the original published image.",
      credit: {
        title: "Collesfracture.jpg",
        author: "Lucien Monfils",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Collesfracture.jpg",
      },
    },
  },
  {
    id: "ankle-fracture",
    title: "Ankle fracture",
    category: "Leg & Foot",
    tone: "fracture",
    finding: "Bimalleolar ankle fracture — both the lower fibula and the medial malleolus of the tibia are broken.",
    summary: "Breaks on both sides of the ankle joint, seen on a frontal X-ray.",
    explanation: [
      "The ankle joint is formed by the tibia (shin bone), the fibula (the thin outer bone) and the talus, a foot bone that sits between them. The bony bumps you can feel on each side of your ankle are called the malleoli.",
      "In this frontal view, a break runs through the lower fibula on the outer side. On the inner side, the tip of the tibia — the medial malleolus — has separated as its own piece of bone.",
      "When both sides of the ankle are broken it is called a bimalleolar fracture. Because the joint is supported from both sides, doctors always check the inner and the outer malleolus.",
    ],
    lookFor: [
      "Dark break lines through the lower fibula",
      "A bone fragment separated from the tibia",
      "Whether the joint space around the talus looks even",
    ],
    highlightCaption: "Highlights mark the two fracture sites named in the source publication.",
    highlights: [
      { cx: 71, cy: 40, w: 24, h: 22, label: "Fibula (outer side) fracture", labelAt: "top" },
      { cx: 26, cy: 72, w: 28, h: 18, label: "Medial malleolus fragment", labelAt: "bottom" },
    ],
    media: {
      kind: "image",
      url: ankleFracture.url,
      width: 325,
      height: 405,
      alt: "Frontal X-ray of an ankle showing fractures of the lower fibula and the medial malleolus.",
      credit: {
        title: "X-ray of bimalleolar fracture.jpg",
        author: "Nazzar Tellisi, I S Abdulkareem, P G Giannoudis",
        license: "CC BY 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:X-ray_of_bimalleolar_fracture.jpg",
      },
    },
  },
  {
    id: "healthy-wrist",
    title: "Healthy wrist",
    category: "Arm & Hand",
    tone: "normal",
    finding: "Normal wrist — normal anatomy and no injuries, as described by the image author.",
    summary: "A reference image that shows what an uninjured wrist looks like.",
    explanation: [
      "This front view shows the radius (the larger forearm bone, on the thumb side), the ulna (little-finger side) and the eight small carpal bones of the wrist.",
      "In a healthy X-ray each bone has a smooth, unbroken outer edge called the cortex, and the gaps between the bones (the joint spaces) are similar in width.",
      "Knowing what 'normal' looks like is the first step in learning to read X-rays. The highlighted area is the same part of the radius that is broken in the Wrist fracture example.",
    ],
    lookFor: [
      "Smooth, continuous bone outlines",
      "Even joint spaces between the carpal bones",
      "The distal radius for comparison with the fracture example",
    ],
    highlightCaption: "The highlight is a comparison area only — there is no abnormality here.",
    highlights: [{ cx: 66, cy: 60, w: 42, h: 14, label: "Distal radius · smooth outline", labelAt: "bottom" }],
    media: {
      kind: "image",
      url: healthyWrist.url,
      width: 690,
      height: 980,
      alt: "Front-view X-ray of a normal adult left wrist showing the radius, ulna and carpal bones.",
      credit: {
        title: "X-ray of normal wrist by dorsoplantar projection (crop).jpg",
        author: "Mikael Häggström, M.D.",
        license: "CC0 1.0",
        licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:X-ray_of_normal_wrist_by_dorsoplantar_projection_(crop).jpg",
      },
    },
  },
  {
    id: "chest-anatomy",
    title: "Chest X-ray anatomy",
    category: "Chest",
    tone: "normal",
    finding: "Normal frontal (PA) chest X-ray of a young adult, used to learn basic chest anatomy.",
    summary: "The standard chest X-ray: lungs, heart, ribs and diaphragm on one image.",
    explanation: [
      "Air lets X-rays pass through, so the lungs appear dark. Denser tissue absorbs more X-rays, so the heart, bones and diaphragm appear bright.",
      "The highlighted area is the cardiac silhouette — the outline of the heart and large blood vessels in the middle of the chest. On a standard PA view the heart usually takes up less than about half of the chest's width.",
      "The letters 'Dx' and 'Sin' are side markers (Latin for right and left), so viewers always know which side of the body they are looking at.",
    ],
    lookFor: [
      "Dark, air-filled lungs on both sides",
      "The bright outline of the heart in the centre",
      "Ribs, collarbones and the dome-shaped diaphragm",
    ],
    highlightCaption: "The highlight marks the cardiac silhouette (normal anatomy).",
    highlights: [{ cx: 54.7, cy: 68, w: 40, h: 28, label: "Cardiac silhouette", labelAt: "top" }],
    media: {
      kind: "image",
      url: chestPa.url,
      width: 1049,
      height: 1200,
      alt: "Normal frontal chest X-ray showing both lungs, the heart, ribs and diaphragm, with Dx and Sin side markers.",
      credit: {
        title: "Normal posteroanterior (PA) chest radiograph (X-ray).jpg",
        author: "Mikael Häggström",
        license: "CC0 1.0",
        licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Normal_posteroanterior_(PA)_chest_radiograph_(X-ray).jpg",
      },
    },
  },
  {
    id: "normal-ecg",
    title: "Normal ECG waveform",
    category: "ECG",
    tone: "normal",
    finding: "Normal ECG waveform — a P wave, a narrow QRS complex and a T wave in the usual order.",
    summary: "A labelled illustration of a single, normal heartbeat on an ECG.",
    explanation: [
      "Each heartbeat creates the same family of waves. The small P wave shows the upper chambers (atria) being activated.",
      "The tall, narrow QRS complex shows the main pumping chambers (ventricles) being activated. In a typical adult it lasts less than about 0.12 seconds — three small squares at the standard paper speed.",
      "The rounded T wave shows the ventricles electrically recovering before the next beat.",
    ],
    lookFor: ["A P wave before every QRS complex", "A narrow, sharp QRS complex", "A T wave after every QRS complex"],
    highlightCaption: "The highlight marks the QRS complex.",
    highlights: [],
    media: { kind: "ecg", alt: "Labelled illustration of one normal heartbeat with P wave, QRS complex and T wave." },
  },
];
