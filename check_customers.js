const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lormkfsinshzcrydpqjo.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvcm1rZnNpbnNoemNyeWRwcWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMDU3NDksImV4cCI6MjA4NDU4MTc0OX0.5Ym7hZ5QcxKKuChCjoZJBDrfD0O8KiDrQVBrLlue02c";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCustomers() {
    console.log("Checking 'customers' table...");
    const { data, error } = await supabase
        .from("customers")
        .select("count", { count: "exact", head: true });

    if (error) {
        console.error("Error accessing 'customers' table:", error);
    } else {
        console.log("'customers' table exists.");
    }
}

checkCustomers();
