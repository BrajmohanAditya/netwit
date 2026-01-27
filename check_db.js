const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lormkfsinshzcrydpqjo.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvcm1rZnNpbnNoemNyeWRwcWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMDU3NDksImV4cCI6MjA4NDU4MTc0OX0.5Ym7hZ5QcxKKuChCjoZJBDrfD0O8KiDrQVBrLlue02c";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
  console.log("Checking 'vehicles' table...");
  const { data, error } = await supabase
    .from("vehicles")
    .select("count", { count: "exact", head: true });

  if (error) {
    console.error("Error accessing 'vehicles' table:", error);
    if (error.code === "42P01") {
      console.log(
        "\nCRITICAL: The 'vehicles' table does not exist in your database.",
      );
      console.log("You need to run the SQL migration to create it.");
    }
  } else {
    console.log("'vehicles' table exists and is accessible.");
  }
}

checkDb();
