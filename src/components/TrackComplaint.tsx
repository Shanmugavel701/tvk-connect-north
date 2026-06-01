import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLang, tr } from "@/lib/i18n";

type Row = { complaint_id: string; name: string; category: string; status: string; created_at: string };

const statusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export function TrackComplaint() {
  const { lang } = useLang();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[] | null>(null);

  async function search() {
    if (!q.trim()) return;
    setLoading(true);
    const { data } = await supabase
      .from("complaints")
      .select("complaint_id,name,category,status,created_at")
      .or(`complaint_id.eq.${q.trim()},mobile.eq.${q.trim()}`)
      .order("created_at", { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  }

  return (
    <section className="mx-auto mt-8 max-w-2xl rounded-3xl border border-border/60 bg-card/80 p-6 backdrop-blur shadow-sm">
      <h3 className={`mb-3 text-center text-lg font-bold text-tvk-gradient ${lang === "ta" ? "tamil" : ""}`}>
        {tr("track", lang)}
      </h3>
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={tr("trackPlaceholder", lang)}
          className="flex-1 rounded-xl border border-input bg-card px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="button"
          onClick={search}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-tvk-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-95 disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {tr("search", lang)}
        </button>
      </div>
      {rows && (
        <div className="mt-4 space-y-2">
          {rows.length === 0 && (
            <p className={`text-center text-sm text-muted-foreground ${lang === "ta" ? "tamil" : ""}`}>
              {tr("noResults", lang)}
            </p>
          )}
          {rows.map((r) => (
            <div key={r.complaint_id} className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm">
              <div>
                <p className="font-mono font-bold text-primary">{r.complaint_id}</p>
                <p className="text-xs text-muted-foreground">{r.name} · {r.category}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${statusColor[r.status] ?? "bg-muted text-muted-foreground"}`}>
                {r.status.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}