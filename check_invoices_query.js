const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lormkfsinshzcrydpqjo.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvcm1rZnNpbnNoemNyeWRwcWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMDU3NDksImV4cCI6MjA4NDU4MTc0OX0.5Ym7hZ5QcxKKuChCjoZJBDrfD0O8KiDrQVBrLlue02c";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInvoicesQuery() {
    console.log("Checking 'invoices' table with join on 'customers'...");
    const { data, error } = await supabase
        .from("invoices")
        .select(
            `
      *,
      customer:customers(id, name, phone, email)
    `,
        )
        .order("invoice_date", { ascending: false });

    if (error) {
        console.error("Error accessing 'invoices' table with join:", error);
        if (error.code === "42P01") {
            // 42P01 is undefined_table
            console.log("CRITICAL: Schema cache or table missing error confirmed.");
        }
    } else {
        console.log("Query successful! Data length:", data ? data.length : 0);
    }
}

checkInvoicesQuery();
