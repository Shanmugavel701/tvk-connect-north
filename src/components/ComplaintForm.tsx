import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { Loader2, Upload, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLang, tr, categories, areas } from "@/lib/i18n";
import { LangToggle } from "./LangToggle";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Invalid mobile"),
  address: z.string().trim().min(5).max(500),
  category: z.string().min(1),
  area: z.string().min(1),
  description: z.string().trim().min(10).max(2000),
});

export function ComplaintForm() {
  const { lang } = useLang();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const labelCls = `block text-sm font-semibold text-foreground mb-1.5 ${lang === "ta" ? "tamil" : ""}`;
  const inputCls =
    "w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") ?? ""),
      mobile: String(fd.get("mobile") ?? ""),
      address: String(fd.get("address") ?? ""),
      category: String(fd.get("category") ?? ""),
      area: String(fd.get("area") ?? ""),
      description: String(fd.get("description") ?? ""),
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setLoading(true);
    try {
      let image_url: string | null = null;
      if (file) {
        if (file.size > 5 * 1024 * 1024) throw new Error("File must be < 5MB");
        const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const { error: upErr } = await supabase.storage.from("complaint-uploads").upload(path, file);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("complaint-uploads").getPublicUrl(path);
        image_url = data.publicUrl;
      }
      const { data, error } = await supabase
        .from("complaints")
        .insert({ ...parsed.data, image_url })
        .select("complaint_id")
        .single();
      if (error) throw error;
      setSuccess(data.complaint_id);
      (e.target as HTMLFormElement).reset();
      setFile(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-border/60 bg-card p-8 text-center shadow-political"
      >
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-tvk-gradient">
          <CheckCircle2 className="h-9 w-9 text-primary-foreground" />
        </div>
        <h3 className={`text-xl font-bold ${lang === "ta" ? "tamil" : ""}`}>{tr("success", lang)}</h3>
        <p className={`mt-2 text-sm text-muted-foreground ${lang === "ta" ? "tamil" : ""}`}>
          {tr("successDesc", lang)}
        </p>
        <p className="mt-3 inline-block rounded-xl bg-secondary px-5 py-2 font-mono text-lg font-bold text-secondary-foreground">
          {success}
        </p>
        <button
          type="button"
          onClick={() => setSuccess(null)}
          className="mt-6 block w-full rounded-xl bg-tvk-gradient py-3 font-semibold text-primary-foreground shadow-political transition hover:opacity-95"
        >
          {lang === "ta" ? "மற்றொரு புகார் சமர்ப்பிக்க" : "Submit Another Complaint"}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      onSubmit={onSubmit}
      className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 md:p-8 shadow-political"
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-tvk-gradient" />
      <div className="mb-6 flex flex-col items-center gap-3">
        <h2 className={`text-2xl font-extrabold text-tvk-gradient ${lang === "ta" ? "tamil" : ""}`}>
          {tr("formTitle", lang)}
        </h2>
        <LangToggle />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className={labelCls}>
            {tr("name", lang)} <span className="text-primary">*</span>
          </label>
          <input name="name" required maxLength={100} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>
            {tr("mobile", lang)} <span className="text-primary">*</span>
          </label>
          <input
            name="mobile"
            required
            inputMode="numeric"
            pattern="[6-9][0-9]{9}"
            maxLength={10}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>
            {tr("area", lang)} <span className="text-primary">*</span>
          </label>
          <select name="area" required defaultValue="" className={inputCls}>
            <option value="" disabled>{tr("selectArea", lang)}</option>
            {areas.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>
            {tr("address", lang)} <span className="text-primary">*</span>
          </label>
          <input name="address" required maxLength={500} className={inputCls} />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>
            {tr("category", lang)} <span className="text-primary">*</span>
          </label>
          <select name="category" required defaultValue="" className={inputCls}>
            <option value="" disabled>{tr("selectCategory", lang)}</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{lang === "ta" ? c.ta : c.en}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>
            {tr("description", lang)} <span className="text-primary">*</span>
          </label>
          <textarea name="description" required maxLength={2000} rows={4} className={inputCls} />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>
            {tr("upload", lang)} <span className="text-xs font-normal text-muted-foreground">({tr("optional", lang)})</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-input bg-muted/40 px-4 py-3 text-sm text-muted-foreground transition hover:border-primary hover:text-foreground">
            <Upload className="h-4 w-4" />
            <span className="truncate">{file ? file.name : (lang === "ta" ? "JPG, PNG, அல்லது PDF" : "JPG, PNG, or PDF")}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-tvk-gradient py-3.5 font-bold text-primary-foreground shadow-political transition hover:opacity-95 disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className={lang === "ta" ? "tamil" : ""}>{tr("submitting", lang)}</span>
          </>
        ) : (
          <span className={lang === "ta" ? "tamil" : ""}>{tr("submit", lang)}</span>
        )}
      </button>
    </motion.form>
  );
}