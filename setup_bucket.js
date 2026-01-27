const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://lormkfsinshzcrydpqjo.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvcm1rZnNpbnNoemNyeWRwcWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMDU3NDksImV4cCI6MjA4NDU4MTc0OX0.5Ym7hZ5QcxKKuChCjoZJBDrfD0O8KiDrQVBrLlue02c";

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupBucket() {
  console.log("Checking buckets...");
  const { data: buckets, error: listError } =
    await supabase.storage.listBuckets();

  if (listError) {
    console.error("Error listing buckets:", listError);
    return;
  }

  const vehiclesBucket = buckets.find((b) => b.name === "vehicles");

  if (vehiclesBucket) {
    console.log("Bucket 'vehicles' already exists.");
  } else {
    console.log("Bucket 'vehicles' not found. Attempting to create...");
    const { data, error } = await supabase.storage.createBucket("vehicles", {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
    });

    if (error) {
      console.error("Error creating bucket:", error);
      console.log(
        "\nIMPORTANT: You may need to create the 'vehicles' bucket manually in your Supabase dashboard if the anonymous key doesn't have permission.",
      );
    } else {
      console.log("Bucket 'vehicles' created successfully!");
    }
  }
}

setupBucket();
