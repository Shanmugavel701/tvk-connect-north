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
            தமிழக வெற்றிக் கழகம்
          </h1>
          <p className="tamil text-sm md:text-base font-bold text-tvk-red">
            பிறப்பொக்கும் எல்லா உயிர்க்கும் !
          </p>
          <p className="tamil text-lg md:text-xl font-bold text-foreground/90">
            கோயம்புத்தூர் வடக்கு தொகுதி
          </p>
        </div>
      </Link>

      <div className="mt-6 max-w-2xl mx-auto px-4 space-y-3">
        <p className="tamil text-sm md:text-base text-muted-foreground leading-relaxed">
          நமது பகுதியில் உள்ள பிரச்சனைகள் குறித்து உங்கள் கருத்துகளை எங்களுடன் பகிர்ந்து கொள்ளுங்கள், நாங்கள் சட்டப்படி உடனடி நடவடிக்கைகள் எடுத்து, உகந்த தீர்வு கிடைக்கும் வரை நாங்கள் உங்கள் உடன் நிற்போம்.
        </p>
        <p className="tamil text-sm md:text-base font-semibold text-primary bg-primary/10 inline-block px-4 py-1.5 rounded-full">
          மக்களின் குறைகளை தீர்க்கும் புதிய முயற்சி
        </p>
      </div>
    </header>
  );
}