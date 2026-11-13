import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/medscan/PageHeader";
import { ExamUploadPanel } from "@/components/medscan/ExamUploadPanel";

export const Route = createFileRoute("/ecg")({
  head: () => ({
    meta: [
      { title: "ECG Image Analysis — MedScan" },
      { name: "description", content: "Upload an ECG image for a private, in-browser preview and see how MedScan will present analysis results in a future version." },
      { property: "og:title", content: "ECG Image Analysis — MedScan" },
      { property: "og:description", content: "Private, in-browser ECG image preview with a prototype result screen. Not a medical device." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EcgPage,
});

function EcgPage() {
  return (
    <>
      <PageHeader
        eyebrow="Module 01 · Electrocardiogram"
        title="ECG Analysis"
        description="Upload an ECG image to create a private, local preview. Then click Analyze Image to see how results will be presented in a future version of MedScan."
      />
      <section className="relative z-10 mx-auto -mt-2 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <ExamUploadPanel type="ecg" />
      </section>
    </>
  );
}
