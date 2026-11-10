import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/medscan/PageHeader";
import { ExamUploadPanel } from "@/components/medscan/ExamUploadPanel";
import { XrayAnatomy } from "@/components/medscan/XrayAnatomy";
import { SampleReport } from "@/components/medscan/SampleReport";
import { SectionHeading } from "@/components/medscan/SectionHeading";

export const Route = createFileRoute("/xray")({
  head: () => ({
    meta: [
      { title: "X-Ray Analysis Demo — MedScan" },
      { name: "description", content: "Upload a chest X-ray image for a local preview, explore chest anatomy and see how a radiology report is structured." },
      { property: "og:title", content: "X-Ray Analysis Demo — MedScan" },
      { property: "og:description", content: "Explore chest X-ray anatomy and a sample radiology report template in an educational demonstration." },
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
        eyebrow="Module 02 · Chest radiograph"
        title="X-Ray Analysis"
        description="Upload a chest X-ray image to create a private, local preview, then start a simulated demonstration about how radiographs are reviewed."
      />
      <section className="relative z-10 mx-auto -mt-2 max-w-7xl px-4 sm:px-6 lg:px-8">
        <ExamUploadPanel type="xray" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Interactive anatomy"
          title="Chest X-ray anatomy, step by step"
          description="Select a numbered marker to learn what each structure is and how it typically appears on a frontal chest radiograph."
        />
        <div className="mt-10">
          <XrayAnatomy />
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Sample radiology report"
            title="How a radiology report is organised"
            description="Radiologists communicate results using a consistent structure. This template shows each section and what it is for — it contains no findings."
          />
          <div className="mt-10">
            <SampleReport />
          </div>
        </div>
      </section>
    </>
  );
}
