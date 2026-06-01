import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import heroBg from "@/assets/hero-bg.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroBanner } from "@/components/HeroBanner";
import { ComplaintForm } from "@/components/ComplaintForm";
import { TrackComplaint } from "@/components/TrackComplaint";
import { useLang, tr } from "@/lib/i18n";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TVK Coimbatore North — மக்கள் குறைதீர் மையம் | Grievance Portal" },
      { name: "description", content: "Submit grievances and complaints directly to TVK Coimbatore North. Bilingual citizen grievance portal — water, road, drainage, electricity and public issues." },
      { property: "og:title", content: "TVK Coimbatore North — Grievance Portal" },
      { property: "og:description", content: "மக்களின் குரல், எங்கள் பொறுப்பு. Submit your grievances online." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  const { lang } = useLang();
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-20 blur-md"
        style={{ backgroundImage: `url(${heroBg})` }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/90 to-background" aria-hidden />

      <div className="mx-auto w-full max-w-3xl px-4 pb-16">
        <div className="flex items-center justify-end pt-4">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur transition hover:text-primary"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className={lang === "ta" ? "tamil" : ""}>{tr("adminLogin", lang)}</span>
          </Link>
        </div>
        <SiteHeader />
        <HeroBanner />
        <div className="mt-8">
          <ComplaintForm />
        </div>
        <TrackComplaint />
        <footer className={`mt-10 text-center text-xs text-muted-foreground ${lang === "ta" ? "tamil" : ""}`}>
          {tr("footer", lang)}
        </footer>
      </div>
    </div>
  );
}
