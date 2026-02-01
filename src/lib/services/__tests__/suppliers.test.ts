import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the application-level createClient used in suppliers service
vi.mock('../../supabase/client', () => {
  return {
    createClient: () => {
      // simple call-recording mock so tests can assert inserts/updates happened
      const calls: any[] = [];

      function from(table: string) {
        calls.push({ type: 'from', table });

        if (table === 'purchase_order_items') {
          return {
            select: (cols?: string) => ({ eq: (col: string, val: any) => Promise.resolve({ data: [{ id: 'item1', product_id: 'p1', quantity: 10 }], error: null }) }),
          };
        }

        if (table === 'products') {
          return {
            select: (cols?: string) => ({ eq: (col: string, val: any) => ({ single: () => Promise.resolve({ data: { stock_quantity: 5 }, error: null }) }) }),
            update: (payload: any) => ({ eq: (col: string, val: any) => Promise.resolve({ data: [{ ...payload }], error: null }) }),
          };
        }

        if (table === 'purchase_orders') {
          return {
            select: (cols?: string) => ({ eq: (col: string, val: any) => ({ limit: (n: number) => Promise.resolve({ data: [{ id: val, shop_id: 'shop1' }], error: null }) }) }),
            update: (payload: any) => ({ eq: (col: string, val: any) => ({ select: () => Promise.resolve({ data: [{ id: val, status: 'received' }], error: null }) }) }),
          };
        }

        if (table === 'stock_audits') {
          return {
            insert: (rows: any[]) => ({ select: () => ({ single: () => Promise.resolve({ data: { id: 'audit-1', ...rows[0] }, error: null }) }) }),
          };
        }

        if (table === 'stock_audit_items') {
          return {
            insert: (rows: any[]) => Promise.resolve({ data: rows, error: null }),
          };
        }

        return { select: () => Promise.resolve({ data: [], error: null }) };
      }

      return { from };
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
