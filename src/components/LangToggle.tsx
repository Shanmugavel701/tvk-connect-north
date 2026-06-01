import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div className={cn("inline-flex rounded-full border border-border bg-card p-1 shadow-sm", className)}>
      <button
        type="button"
        onClick={() => setLang("ta")}
        className={cn(
          "px-4 py-1.5 text-sm font-semibold rounded-full transition-all tamil",
          lang === "ta" ? "bg-tvk-gradient text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground",
        )}
      >
        தமிழ்
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={cn(
          "px-4 py-1.5 text-sm font-semibold rounded-full transition-all",
          lang === "en" ? "bg-tvk-gradient text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground",
        )}
      >
        English
      </button>
    </div>
  );
}