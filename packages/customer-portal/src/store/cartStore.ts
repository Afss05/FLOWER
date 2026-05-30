import { create } from 'zustand'

interface Cart {
  id: number
  items: Array<{
    id: number
    product_id: number
    quantity: number
    price: number
  }>
  total: number
}

interface CartStore {
  cart: Cart | null
  setCart: (cart: Cart) => void
  addItem: (product_id: number, quantity: number) => void
  removeItem: (itemId: number) => void
  updateItem: (itemId: number, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  cart: null,
  setCart: (cart) => set({ cart }),
  addItem: (product_id, quantity) =>
    set((state) => {
      if (!state.cart) return state
      return {
        cart: {
          ...state.cart,
          items: [...state.cart.items, { id: Date.now(), product_id, quantity, price: 0 }],
        },
      }
    }),
  removeItem: (itemId) =>
    set((state) => {
      if (!state.cart) return state
      return {
        cart: {
          ...state.cart,
          items: state.cart.items.filter((item) => item.id !== itemId),
        },
      }
    }),
  updateItem: (itemId, quantity) =>
    set((state) => {
      if (!state.cart) return state
      return {
        cart: {
          ...state.cart,
          items: state.cart.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item,
          ),
        },
      }
    }),
  clearCart: () => set({ cart: null }),
}))
