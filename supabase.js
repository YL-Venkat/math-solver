document.head.insertAdjacentHTML('beforeend', '<link rel="icon" type="image/png" href="/log.png">');

const SUPABASE_URL = "https://xdnfwxkwioobxexfcspo.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkbmZ3eGt3aW9vYnhleGZjc3BvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4NzczMzIsImV4cCI6MjEwMjQ1MzMzMn0.uInuxaHkktIGEXBsl5SEyO_QaJu32-q4CC_tOrXAths";

let supabaseClient = null;

if (typeof window.supabase !== "undefined" && window.supabase.createClient) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
} else {
  console.error("Supabase CDN library is missing or loaded out of order.");
}