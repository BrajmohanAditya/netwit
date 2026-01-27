const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lormkfsinshzcrydpqjo.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvcm1rZnNpbnNoemNyeWRwcWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMDU3NDksImV4cCI6MjA4NDU4MTc0OX0.5Ym7hZ5QcxKKuChCjoZJBDrfD0O8KiDrQVBrLlue02c";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log("Attempting test insert...");

  const testVehicle = {
    vin: "TEST" + Date.now().toString().slice(-13),
    year: 2024,
    make: "TestMake",
    model: "TestModel",
    condition: "New",
    status: "Active",
    purchase_price: 10000,
    retail_price: 15000,
    odometer: 0,
    extra_costs: 0,
    taxes: 0,
    image_gallery: null,
  };

  const { data, error } = await supabase
    .from("vehicles")
    .insert(testVehicle)
    .select();

  if (error) {
    console.error("Insert failed:", error);
    if (error.code === "42501") {
      console.log("\nCRITICAL: Permission denied (RLS policy violation).");
      console.log(
        "You must enable INSERT access for the 'vehicles' table in Supabase.",
      );
    }
  } else {
    console.log("Insert successful!", data);
    // Cleanup
    await supabase.from("vehicles").delete().eq("id", data[0].id);
  }
}

testInsert();
