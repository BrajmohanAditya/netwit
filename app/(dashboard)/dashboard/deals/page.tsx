import { redirect } from "next/navigation";

interface DashboardDealsRedirectProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function DashboardDealsRedirect({
  searchParams,
}: DashboardDealsRedirectProps) {
  const params = new URLSearchParams();

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((entry) => params.append(key, entry));
      } else if (typeof value === "string") {
        params.set(key, value);
      }
    });
  }

  const query = params.toString();
  redirect(query ? `/deals?${query}` : "/deals");
}
