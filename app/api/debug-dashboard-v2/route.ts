import { NextResponse } from "next/server";
import { fetchDashboardMetricsDebug, getRecentLeadsDebug } from "@/lib/actions/dashboard-stats-debug";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const metrics = await fetchDashboardMetricsDebug();
        const recentLeads = await getRecentLeadsDebug(5);

        return NextResponse.json({
            success: true,
            metrics,
            recentLeads
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 200 });
    }
}
