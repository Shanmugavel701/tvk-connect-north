import { Link } from "@tanstack/react-router";
import { useLang, tr } from "@/lib/i18n";
import HeaderImg from "@/assets/Header.png";

export function SiteHeader() {
  const { lang } = useLang();
  return (
    <header className="relative z-20 pt-8 pb-4 text-center">
      <Link to="/" className="inline-flex flex-col items-center gap-3">
        <img 
          src={HeaderImg} 
          alt="Site Header" 
          className="h-24 md:h-32 w-auto object-contain mb-2 shadow-political rounded-xl ring-tvk" 
        />
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