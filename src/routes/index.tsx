import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EconODS - ODS 8" },
      { name: "description", content: "EconODS: plataforma sobre o ODS 8 — trabalho decente e crescimento econômico." },
      { property: "og:title", content: "EconODS - ODS 8" },
      { property: "og:description", content: "Plataforma sobre o ODS 8 — trabalho decente e crescimento econômico." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <iframe
      src="/econods.html"
      title="EconODS"
      className="fixed inset-0 h-screen w-screen border-0"
    />
  );
}
