import { motion } from "framer-motion";
import leader from "@/assets/leader.jpg";
import coordinator from "@/assets/coordinator.jpg";
import { useLang, tr } from "@/lib/i18n";

export function HeroBanner() {
  const { lang } = useLang();
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative mx-auto mt-6 max-w-3xl"
    >
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-political">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-tvk-gradient" />
        <div className="grid grid-cols-3 items-center gap-2 p-4 md:p-6">
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={leader}
                alt="TVK Leader"
                width={512}
                height={640}
                className="h-20 w-20 md:h-28 md:w-28 rounded-full object-cover ring-4 ring-primary/30"
              />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                Leader
              </span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-accent-foreground">
              TVK
            </p>
            <h2 className="mt-1 text-base md:text-2xl font-extrabold leading-tight text-tvk-gradient">
              COIMBATORE
              <br />
              NORTH
            </h2>
            <p className={`mt-1 text-[10px] md:text-xs text-muted-foreground ${lang === "ta" ? "tamil" : ""}`}>
              {tr("hero", lang)}
            </p>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={coordinator}
                alt="District Coordinator"
                width={512}
                height={640}
                className="h-20 w-20 md:h-28 md:w-28 rounded-full object-cover ring-4 ring-accent/40"
              />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                Coordinator
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}