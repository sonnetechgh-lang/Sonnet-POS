import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the supabase client before importing the route
vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: (url: string, key: string) => {
      return {
        from: (table: string) => {
          return {
            select: (cols?: string) => ({
              eq: (col: string, val: any) => ({
                limit: (n: number) => Promise.resolve({ data: table === 'shops' ? [{ id: 'shop1' }] : [], error: null }),
              }),
              limit: (n: number) => Promise.resolve({ data: table === 'shops' ? [{ id: 'shop1' }] : [], error: null }),
            }),
            insert: (rows: any[]) => ({
              select: () => ({ single: () => Promise.resolve({ data: { id: 'newcat' } }) }),
            }),
          };
        },
      };
    },
  };
});

// Now import the POST handler
import { POST } from '../products/route';

describe('POST /api/import/products', () => {
  beforeEach(() => {
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';
    vi.resetModules();
  });

  it('imports rows and returns inserted items', async () => {
    const mockReq = {
      json: async () => ({ rows: [{ name: 'Test product', sku: 'TP-001', category_name: 'Uncategorized' }] }),
    } as unknown as Request;

    const res = await POST(mockReq as any);
    const body = await res.json();
    expect(body).toHaveProperty('inserted');
    expect(Array.isArray(body.inserted)).toBe(true);
  });

  it('returns an error if service key missing', async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const mockReq = { json: async () => ({ rows: [] }) } as unknown as Request;
    const res = await POST(mockReq as any);
    const body = await res.json();
    expect(res.status).toBe(500);
    expect(body).toHaveProperty('error');
  });
});
