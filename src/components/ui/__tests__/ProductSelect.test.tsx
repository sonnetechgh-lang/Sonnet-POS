import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ProductSelect from '../ProductSelect';

const products = [
  { id: '1', name: 'Panadol Extra', sku: 'PAN-001' },
  { id: '2', name: 'Paracetamol', sku: 'PAR-001' },
  { id: '3', name: 'Aspirin', sku: 'ASP-001' },
  { id: '4', name: 'Amoxicillin', sku: 'AMX-001' },
];

describe('ProductSelect component', () => {
  it('renders input and placeholder', () => {
    render(<ProductSelect products={products} value={null} onChange={() => {}} />);
    expect(screen.getByPlaceholderText(/search product/i)).toBeInTheDocument();
  });

  it('filters and allows mouse selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ProductSelect products={products} value={null} onChange={onChange} />);

    const input = screen.getByPlaceholderText(/search product/i);
    await user.type(input, 'Pan');

    // options should appear
    const options = await screen.findAllByRole('option');
    expect(options.length).toBeGreaterThan(0);

    // click first option => onChange called with product id
    await user.click(options[0]);
    expect(onChange).toHaveBeenCalled();
  });

  it('supports keyboard navigation and selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ProductSelect products={products} value={null} onChange={onChange} />);

    const input = screen.getByPlaceholderText(/search product/i);
    input.focus();

    // open list with arrow down
    await user.keyboard('{ArrowDown}');

    const options = await screen.findAllByRole('option');
    // first option should be highlighted (aria-selected true)
    expect(options[0]).toHaveAttribute('aria-selected', 'true');

    // press ArrowDown and Enter to select second option
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalled();
  });

  it('cycles through matches when same character repeated', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    // use products with multiple starting 'A' to test cycling
    const aProducts = [
      { id: 'a1', name: 'Apple', sku: 'APL' },
      { id: 'a2', name: 'Apricot', sku: 'APR' },
      { id: 'a3', name: 'Avocado', sku: 'AVO' },
    ];

    render(<ProductSelect products={aProducts} value={null} onChange={onChange} />);
    const input = screen.getByPlaceholderText(/search product/i);
    input.focus();

    // type 'a' -> highlight first match
    let firstSelected: HTMLElement | undefined;
    await user.keyboard('a');
    await waitFor(async () => {
      const opts1 = await screen.findAllByRole('option');
      firstSelected = opts1.find((o) => o.getAttribute('aria-selected') === 'true') as HTMLElement | undefined;
      expect(firstSelected).toBeDefined();
    });

    // type 'a' again to cycle
    await user.keyboard('a');
    const opts2 = await screen.findAllByRole('option');
    const secondSelected = opts2.find((o) => o.getAttribute('aria-selected') === 'true') as HTMLElement | undefined;
    expect(secondSelected).toBeDefined();
    // ensure the selected index changed
    expect(secondSelected).not.toEqual(firstSelected);

    // press Enter to select currently highlighted
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalled();
  });
});
