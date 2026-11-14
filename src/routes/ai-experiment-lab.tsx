import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/medscan/PageHeader";
import { AiClassifierPanel, AiExperimentNotice } from "@/components/medscan/AiClassifierPanel";

export const Route = createFileRoute("/ai-experiment-lab")({
  head: () => ({
    meta: [
      { title: "AI Experiment Lab — MedScan" },
      {
        name: "description",
        content: "Try a real image classifier trained with Teachable Machine. It sorts images into ECG diagrams or X-ray illustrations, entirely in your browser.",
      },
      { property: "og:title", content: "AI Experiment Lab — MedScan" },
      { property: "og:description", content: "An in-browser TensorFlow.js experiment that classifies images as ECG diagrams or X-ray illustrations. Not a medical tool." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AiExperimentLabPage,
});

function AiExperimentLabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Experimental · In-browser AI"
        title="AI Experiment Lab"
        description="Upload an image and run our trained Teachable Machine model directly in your browser. It tells you whether the picture looks more like an ECG diagram or an X-ray illustration."
      >
        <AiExperimentNotice className="max-w-3xl" />
      </PageHeader>
      <section className="relative z-10 mx-auto -mt-2 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <AiClassifierPanel />
      </section>
    </>
  );
}
