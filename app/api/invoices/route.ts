import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL for server invoice insert.",
  );
}

const supabase =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey)
    : null;

export async function POST(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        {
          error:
            "Server configuration missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL.",
        },
        { status: 500 },
      );
    }

    const body = await request.json();

    const invoiceDate = new Date(body.invoice_date);
    const dueDate = new Date(body.due_date);

    if (Number.isNaN(invoiceDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid invoice_date" },
        { status: 400 },
      );
    }

    if (Number.isNaN(dueDate.getTime())) {
      return NextResponse.json({ error: "Invalid due_date" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("invoices")
      .insert({
        invoice_number: body.invoice_number,
        invoice_date: invoiceDate.toISOString().split("T")[0],
        due_date: dueDate.toISOString().split("T")[0],
        customer_id: body.customer_id ?? null,
        package_name: body.package_name,
        payment_amount: body.payment_amount,
        tax_rate: body.tax_rate,
        tax_amount: body.tax_amount,
        total: body.total,
        status: body.status,
        notes: body.notes,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message, details: error.details, hint: error.hint },
        { status: 400 },
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
