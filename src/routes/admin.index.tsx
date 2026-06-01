import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LogOut, Download, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — TVK Coimbatore North" }] }),
  component: AdminDashboard,
});

type Complaint = {
  id: string;
  complaint_id: string;
  name: string;
  mobile: string;
  address: string;
  category: string;
  area: string;
  description: string;
  image_url: string | null;
  status: string;
  admin_note: string | null;
  created_at: string;
};

const STATUSES = ["pending", "in_progress", "resolved", "rejected"];

function AdminDashboard() {
  const nav = useNavigate();
  const [rows, setRows] = useState<Complaint[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        nav({ to: "/admin/login" });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", sess.session.user.id);
      setIsAdmin(!!roles?.some((r) => r.role === "admin"));
    })();
  }, [nav]);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("complaints")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) toast.error(error.message);
    setRows(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("complaints").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    setRows((r) => r?.map((c) => (c.id === id ? { ...c, status } : c)) ?? null);
  }

  function exportXlsx() {
    if (!rows) return;
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Complaints");
    XLSX.writeFile(wb, `tvk-complaints-${Date.now()}.xlsx`);
  }

  async function logout() {
    await supabase.auth.signOut();
    nav({ to: "/admin/login" });
  }

  if (isAdmin === null) {
    return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <div className="max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-political">
          <h2 className="text-xl font-bold text-tvk-gradient">Admin Role Required</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account is signed in but does not have admin access. Ask an existing admin to grant your account the <code className="rounded bg-secondary px-1.5 py-0.5">admin</code> role in the <code className="rounded bg-secondary px-1.5 py-0.5">user_roles</code> table.
          </p>
          <button onClick={logout} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-tvk-gradient px-5 py-2 text-sm font-semibold text-primary-foreground">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>
    );
  }

  const filtered = (rows ?? []).filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (q && !`${r.complaint_id} ${r.mobile} ${r.name} ${r.area}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="text-lg font-bold text-tvk-gradient">TVK Admin · Coimbatore North</Link>
          <div className="flex items-center gap-2">
            <button onClick={load} className="rounded-lg border border-border bg-card p-2 text-muted-foreground hover:text-primary"><RefreshCw className="h-4 w-4" /></button>
            <button onClick={exportXlsx} className="inline-flex items-center gap-1.5 rounded-lg bg-tvk-gradient px-3 py-2 text-xs font-semibold text-primary-foreground"><Download className="h-4 w-4" /> Excel</button>
            <button onClick={logout} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-primary"><LogOut className="h-4 w-4" /> Logout</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by ID, mobile, name, area..." className="w-full rounded-xl border border-input bg-card pl-9 pr-4 py-2 text-sm outline-none focus:border-primary" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-input bg-card px-3 py-2 text-sm">
            <option value="all">All status</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="ml-auto text-sm text-muted-foreground">{filtered.length} of {rows?.length ?? 0}</span>
        </div>

        {loading ? (
          <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-3">ID</th>
                    <th className="px-3 py-3">Name</th>
                    <th className="px-3 py-3">Mobile</th>
                    <th className="px-3 py-3">Category</th>
                    <th className="px-3 py-3">Area</th>
                    <th className="px-3 py-3 max-w-xs">Description</th>
                    <th className="px-3 py-3">File</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-t border-border align-top">
                      <td className="px-3 py-3 font-mono text-xs font-bold text-primary">{r.complaint_id}</td>
                      <td className="px-3 py-3 font-medium">{r.name}</td>
                      <td className="px-3 py-3">{r.mobile}</td>
                      <td className="px-3 py-3">{r.category}</td>
                      <td className="px-3 py-3">{r.area}</td>
                      <td className="px-3 py-3 max-w-xs"><p className="line-clamp-2 text-muted-foreground">{r.description}</p></td>
                      <td className="px-3 py-3">{r.image_url ? <a href={r.image_url} target="_blank" rel="noreferrer" className="text-primary underline">view</a> : "—"}</td>
                      <td className="px-3 py-3">
                        <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)} className="rounded-md border border-input bg-background px-2 py-1 text-xs">
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={9} className="px-3 py-10 text-center text-muted-foreground">No complaints yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}