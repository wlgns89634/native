import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gckehtntksrfdiaxlnrd.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdja2VodG50a3NyZmRpYXhsbnJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDI1ODIsImV4cCI6MjA5MTAxODU4Mn0.VE8IqBJj8ih-wTLzpsB1-ZOc0wGGNnpAu7pLyHBI4OY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
