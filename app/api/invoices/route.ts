import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Mock response for disconnected mode
    return NextResponse.json({
      data: {
        ...body,
        id: Math.floor(Math.random() * 10000), // Random ID
        created_at: new Date().toISOString()
      }
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
