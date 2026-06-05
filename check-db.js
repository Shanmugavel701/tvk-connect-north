import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://kbaurclifkeckumwwmqd.supabase.co";
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiYXVyY2xpZmtlY2t1bXd3bXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMjkzMDAsImV4cCI6MjA5NTkwNTMwMH0.1mrG9YKpTX0W9FLdSLfGRnAXSeWnoiTqYGcMsGrSFIU";
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from("complaints").select("aadhar").limit(1);
  console.log("Data:", data, "Error:", error);
}
main();
