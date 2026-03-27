'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Tool, BookingItem, CartStore } from './types';

interface CartState {
  items: BookingItem[];
}

type CartAction =
  | { type: 'ADD'; item: BookingItem }
  | { type: 'REMOVE'; toolId: string }
  | { type: 'CLEAR' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const exists = state.items.findIndex(i => i.tool.id === action.item.tool.id);
      if (exists >= 0) {
        const updated = [...state.items];
        updated[exists] = action.item;
        return { items: updated };
      }
      return { items: [...state.items, action.item] };
    }
    case 'REMOVE':
      return { items: state.items.filter(i => i.tool.id !== action.toolId) };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

function calcTotals(items: BookingItem[]) {
  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  const discount = items.reduce((s, i) => s + i.discount, 0);
  const total = items.reduce((s, i) => s + i.total, 0);
  const totalDeposit = items.reduce((s, i) => s + i.tool.deposit, 0);
  const totalDays = Math.max(...items.map(i => i.days), 0);
  return { subtotal, discount, total, totalDeposit, totalDays };
}

const CartContext = createContext<CartStore | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const store: CartStore = {
    get items() { return state.items; },
    addItem(tool: Tool, startDate: Date, endDate: Date) {
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const { subtotal, discount, total } = calcTotals([{
        tool, startDate, endDate, days,
        subtotal: tool.pricePerDay * days,
        discount: days >= 3 ? Math.round(tool.pricePerDay * days * 0.2) : 0,
        total: tool.pricePerDay * days - (days >= 3 ? Math.round(tool.pricePerDay * days * 0.2) : 0),
      }]);
      dispatch({ type: 'ADD', item: { tool, startDate, endDate, days, subtotal: tool.pricePerDay * days, discount: days >= 3 ? Math.round(tool.pricePerDay * days * 0.2) : 0, total } });
    },
    removeItem(toolId: string) { dispatch({ type: 'REMOVE', toolId }); },
    clearCart() { dispatch({ type: 'CLEAR' }); },
    get subtotal() { return calcTotals(state.items).subtotal; },
    get discount() { return calcTotals(state.items).discount; },
    get total() { return calcTotals(state.items).total; },
    get totalDeposit() { return calcTotals(state.items).totalDeposit; },
    get totalDays() { return calcTotals(state.items).totalDays; },
  };

  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
}

export function useCart(): CartStore {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
