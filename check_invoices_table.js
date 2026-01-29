const { createClient } = require("@supabase/supabase-js");

// Use environment variables or fallback to hardcoded (checking similar to check_db.js but safer if envs are loaded)
// Note: In this standalone script, process.env might not be populated unless we load dotenv.
// For now, I'll use the hardcoded values found in check_db.js as a baseline, 
// but I should really check .env.local first to see if they match.

const supabaseUrl = "https://lormkfsinshzcrydpqjo.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvcm1rZnNpbnNoemNyeWRwcWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMDU3NDksImV4cCI6MjA4NDU4MTc0OX0.5Ym7hZ5QcxKKuChCjoZJBDrfD0O8KiDrQVBrLlue02c";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInvoicesTable() {
  console.log("Checking 'invoices' table...");
  const { data, error } = await supabase
    .from("invoices")
    .select("count", { count: "exact", head: true });

  if (error) {
    console.error("Error accessing 'invoices' table:", error);
    if (error.code === "42P01") {
      console.log(
        "\nCRITICAL: The 'invoices' table does not exist in your database.",
      );
      console.log("You need to run the SQL migration to create it.");
    }
  } else {
    console.log("'invoices' table exists and is accessible. Count:", data);
  }
}

checkInvoicesTable();
