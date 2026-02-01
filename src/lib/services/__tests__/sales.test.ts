import { describe, it, expect, vi } from 'vitest';
import { createSale } from '../sales';

vi.mock('../../supabase/client', () => {
  return {
    createClient: () => {
      return {
        auth: {
          getUser: async () => ({ data: { user: { id: 'user-1' } } })
        },
        from: (table: string) => {
          if (table === 'profiles') {
            return {
              select: () => ({ eq: (col: string, val: any) => ({ single: async () => ({ data: { shop_id: 'shop-1' }, error: null }) }) })
            };
          }

          if (table === 'sales') {
            return {
              insert: (rows: any[]) => ({ select: () => ({ single: async () => ({ data: { id: 'sale-1', ...rows[0] }, error: null } ) }) })
            };
          }

          if (table === 'sale_items') {
            return {
              insert: (rows: any[]) => Promise.resolve({ data: rows, error: null })
            };
          }

          if (table === 'customers') {
            return {
              select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) })
            };
          }

          return { select: () => Promise.resolve({ data: [], error: null }) };
        },
        rpc: (fn: string, payload: any) => {
          if (fn === 'decrement_stock') return Promise.resolve({ data: null, error: null });
          return Promise.resolve({ data: null, error: null });
        }
      };
    }
  };
});

describe('createSale', () => {
  it('attaches staff_id and shop_id when available and completes successfully', async () => {
    const sale = { total_amount: 100, subtotal: 95, tax_amount: 5, discount_amount: 0, payment_method: 'cash' };
    const items = [{ id: 'prod-1', quantity: 2, price: 50 }];

    const result = await createSale(sale, items);

    expect(result).toBeDefined();
    expect(result.id).toBeTruthy();
    // shop_id and staff_id were attached on insert
    expect(result.shop_id).toBe('shop-1');
    expect(result.staff_id).toBe('user-1');
  });

  it('throws when rpc returns error', async () => {
    // override createClient to return an instance whose rpc returns an error
    const clientModule: any = await import('../../supabase/client');
    clientModule.createClient = () => ({
      auth: { getUser: async () => ({ data: { user: { id: 'user-1' } } }) },
      from: (table: string) => {
        if (table === 'profiles') return { select: () => ({ eq: () => ({ single: async () => ({ data: { shop_id: 'shop-1' }, error: null }) }) }) };
        if (table === 'sales') return { insert: (rows: any[]) => ({ select: () => ({ single: async () => ({ data: { id: 'sale-1', ...rows[0] }, error: null } ) }) }) };
        if (table === 'sale_items') return { insert: (rows: any[]) => Promise.resolve({ data: rows, error: null }) };
        if (table === 'customers') return { select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }) };
        return { select: () => Promise.resolve({ data: [], error: null }) };
      },
      rpc: async () => ({ data: null, error: { message: 'rpc failed' } })
    });

    const sale = { total_amount: 10, subtotal: 9, tax_amount: 1, discount_amount: 0, payment_method: 'cash' };
    const items = [{ id: 'prod-2', quantity: 1, price: 10 }];

    await expect(createSale(sale, items)).rejects.toMatchObject({ message: 'rpc failed' });
  });
});