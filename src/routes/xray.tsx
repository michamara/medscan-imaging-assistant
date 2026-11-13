import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/medscan/PageHeader";
import { ExamUploadPanel } from "@/components/medscan/ExamUploadPanel";

export const Route = createFileRoute("/xray")({
  head: () => ({
    meta: [
      { title: "X-Ray Image Analysis — MedScan" },
      { name: "description", content: "Choose a body area, upload an X-ray image for a private, in-browser preview and see how MedScan will present results in a future version." },
      { property: "og:title", content: "X-Ray Image Analysis — MedScan" },
      { property: "og:description", content: "Private, in-browser X-ray image preview with a prototype result screen. Not a medical device." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: XrayPage,
});

function XrayPage() {
  return (
    <>
      <PageHeader
        eyebrow="Module 02 · X-ray"
        title="X-Ray Analysis"
        description="Choose a body area and upload an X-ray image to create a private, local preview. Then click Analyze Image to see how results will be presented in a future version of MedScan."
      />
      <section className="relative z-10 mx-auto -mt-2 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <ExamUploadPanel type="xray" />
      </section>
    </>
  );
}
