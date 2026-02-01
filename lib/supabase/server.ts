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

export async function createClient() {
  return mockClient;
}
