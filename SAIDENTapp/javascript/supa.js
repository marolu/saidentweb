// supabase-config.js
const SUPABASE_URL = 'https://gqzmibsyfmyrjlxqfxed.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxem1pYnN5Zm15cmpseHFmeGVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzYzODQ4NiwiZXhwIjoyMDczMjE0NDg2fQ.cIBvpeNa1KvdyvBl_ciLQ2GCmIFEZGHBG3F4SR4Q3Zk';


// Create the client once
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  db: {
    schema: "public",
  },
});
