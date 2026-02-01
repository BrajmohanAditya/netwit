'use server';

// Inline mock client for debugging
const mockQueryBuilder = {
    select: () => mockQueryBuilder,
    insert: () => mockQueryBuilder,
    update: () => mockQueryBuilder,
    delete: () => mockQueryBuilder,
    upsert: () => mockQueryBuilder,
    eq: () => mockQueryBuilder,
    neq: () => mockQueryBuilder,
    gt: () => mockQueryBuilder,
    lt: () => mockQueryBuilder,
    gte: () => mockQueryBuilder,
    lte: () => mockQueryBuilder,
    in: () => mockQueryBuilder,
    like: () => mockQueryBuilder,
    ilike: () => mockQueryBuilder,
    is: () => mockQueryBuilder,
    range: () => mockQueryBuilder,
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    order: () => mockQueryBuilder,
    limit: () => mockQueryBuilder,
    then: (resolve: any) => resolve({ data: [], error: null }),
} as any;

const mockClient = {
    from: () => mockQueryBuilder,
    auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: {}, error: null }),
        signInWithOAuth: () => Promise.resolve({ data: {}, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        signUp: () => Promise.resolve({ data: {}, error: null }),
        resetPasswordForEmail: () => Promise.resolve({ data: {}, error: null }),
    },
    storage: {
        from: () => ({
            upload: () => Promise.resolve({ data: { path: "mock-path" }, error: null }),
            download: () => Promise.resolve({ data: new Blob(), error: null }),
            remove: () => Promise.resolve({ data: {}, error: null }),
            list: () => Promise.resolve({ data: [], error: null }),
            getPublicUrl: (path: string) => ({ data: { publicUrl: `https://mock.com/${path}` } }),
        }),
    },
} as any;

async function createClient() {
    return mockClient;
}

export async function getRecentLeadsDebug(limit: number = 5) {
    const supabase = await createClient();

    if (!supabase) {
        throw new Error("Supabase client is null/undefined");
    }

    if (typeof supabase.from !== 'function') {
        const keys = Object.keys(supabase || {}).join(', ');
        const type = typeof supabase;
        const isThenable = typeof (supabase as any).then === 'function';
        throw new Error(`DEBUG: supabase.from is not a function. Type: ${type}, IsThenable: ${isThenable}, Keys: ${keys}`);
    }

    const { data, error } = await supabase
        .from('leads')
        .select(`
      id,
      status,
      created_at,
      customer:customers!inner(name, phone)
    `)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching recent leads:', error);
        return [];
    }

    return (data || []).map((lead: any) => ({
        id: lead.id,
        status: lead.status,
        created_at: lead.created_at,
        customer: Array.isArray(lead.customer) && lead.customer.length > 0
            ? lead.customer[0]
            : (lead.customer as any) || undefined,
    }));
}

export async function fetchDashboardMetricsDebug() {
    return {
        todaysLeads: 0,
        leadsChange: 0,
        newInventory: 0,
        newInventoryChange: 0,
        totalInventory: 0,
        activeDeals: 0,
        activeDealsChange: 0,
        pipelineValue: 0,
        testDrivesToday: 0,
        testDrivesWeek: 0,
        dealsClosedMonth: 0,
        dealsClosedMonthChange: 0,
        revenueMonth: 0,
    };
}
