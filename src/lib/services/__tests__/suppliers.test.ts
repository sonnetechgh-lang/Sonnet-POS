import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the application-level createClient used in suppliers service
vi.mock('@/lib/supabase/client', () => {
  return {
    createClient: () => {
      return {
        from: (table: string) => {
          if (table === 'purchase_order_items') {
            return {
              select: (cols?: string) => ({ eq: (col: string, val: any) => Promise.resolve({ data: [{ id: 'item1', product_id: 'p1', quantity: 10 }], error: null }) }),
            };
          }

          if (table === 'products') {
            return {
              select: (cols?: string) => ({ eq: (col: string, val: any) => ({ single: () => Promise.resolve({ data: { stock_quantity: 5 }, error: null }) }) }),
              update: (payload: any) => ({ eq: (col: string, val: any) => Promise.resolve({ data: [], error: null }) }),
            };
          }

          if (table === 'purchase_orders') {
            return {
              update: (payload: any) => ({ eq: (col: string, val: any) => ({ select: () => Promise.resolve({ data: [{ id: val, status: 'received' }], error: null }) }) }),
            };
          }

          return { select: () => Promise.resolve({ data: [], error: null }) };
        },
      };
    },
  };
});

import { receivePurchaseOrder } from '../suppliers';

describe('receivePurchaseOrder', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('fetches PO items, updates product stock and marks PO as received', async () => {
    const res = await receivePurchaseOrder('po-123');
    expect(res).toBeDefined();
    // Should return array with updated PO data
    expect(Array.isArray(res)).toBe(true);
    expect(res[0]).toHaveProperty('status', 'received');
  });
});
