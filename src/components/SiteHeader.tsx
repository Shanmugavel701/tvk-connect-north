import { Link } from "@tanstack/react-router";
import { useLang, tr } from "@/lib/i18n";

export function SiteHeader() {
  const { lang } = useLang();
  return (
    <header className="relative z-20 pt-8 pb-4 text-center">
      <Link to="/" className="inline-flex flex-col items-center gap-3">
        <div className="relative h-20 w-20 rounded-full bg-tvk-gradient ring-tvk grid place-items-center text-3xl font-extrabold text-primary-foreground shadow-political">
          த<span className="absolute -bottom-1 right-1 h-3 w-3 rounded-full bg-accent border-2 border-card" />
        </div>
        <div className="space-y-1">
          <h1 className="tamil text-3xl md:text-4xl font-extrabold text-tvk-gradient leading-tight">
            {tr("partyName", "ta")}
          </h1>
          <p className="tamil text-lg md:text-xl font-semibold text-foreground/80">
            {tr("constituency", lang)}
          </p>
          <p className={`text-sm text-muted-foreground ${lang === "ta" ? "tamil" : ""}`}>
            {tr("tagline", lang)}
          </p>
        </div>
      </Link>
    </header>
  );
}