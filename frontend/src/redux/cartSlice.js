import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage
// const savedCart = JSON.parse(localStorage.getItem("cartState"));
const savedCart = JSON.parse(localStorage.getItem("cartState")) || { items: [], totalQuantity: 0, totalAmount: 0, lastUpdated: null };

const initialState = savedCart || {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  lastUpdated: null,
};

const updateLocalStorage = (state) => {
  const stateToSave = {
    ...state,
    lastUpdated: new Date().toISOString()
  };
  localStorage.setItem("cartState", JSON.stringify(stateToSave));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      // Check stock availability before adding
      if (newItem.stock <= 0) {
        console.warn(`Product ${newItem.id} is out of stock`);
        return state;
      }

      state.totalQuantity++;
      if (existingItem) {
        // Verify we're not exceeding available stock
        if (existingItem.quantity >= existingItem.stock) {
          console.warn(`Cannot add more items of ${newItem.id}, stock limit reached`);
          return state;
        }
        existingItem.quantity++;
      } else {
        state.items.push({ 
          ...newItem, 
          quantity: 1,
          addedAt: new Date().toISOString()
        });
      }

      // Recalculate totals
      state.totalAmount = calculateTotalAmount(state.items);
      updateLocalStorage(state);
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      const itemToRemove = state.items.find((item) => item.id === itemId);

      if (itemToRemove) {
        // ❗This only removes from cart state — no database (stock) is touched here.
        state.totalQuantity -= itemToRemove.quantity;
        state.items = state.items.filter((item) => item.id !== itemId);
        state.totalAmount = calculateTotalAmount(state.items);
        updateLocalStorage(state);
      }
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        // Check stock before increasing
        if (item.quantity >= item.stock) {
          console.warn(`Cannot increase quantity of ${item.id}, stock limit reached`);
          return state;
        }
        item.quantity++;
        state.totalQuantity++;
        state.totalAmount += item.price;
        updateLocalStorage(state);
      }
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity--;
          state.totalQuantity--;
          state.totalAmount -= item.price;
        } else {
          // Remove item if quantity would go to 0
          state.totalQuantity--;
          state.items = state.items.filter((i) => i.id !== item.id);
          state.totalAmount -= item.price;
        }
        updateLocalStorage(state);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.lastUpdated = new Date().toISOString();
      updateLocalStorage(state);
    },

    // New reducer to sync with server-side stock
    updateItemStock: (state, action) => {
      const { productId, newStock } = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (item) {
        // Adjust quantity if it exceeds new stock
        if (item.quantity > newStock) {
          state.totalQuantity -= (item.quantity - newStock);
          state.totalAmount -= (item.price * (item.quantity - newStock));
          item.quantity = newStock;
        }
        item.stock = newStock;
        updateLocalStorage(state);
      }
    },

    // New reducer to restore cart from server
    restoreCart: (state, action) => {
      const { items, totalQuantity, totalAmount } = action.payload;
      state.items = items;
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
      state.lastUpdated = new Date().toISOString();
      updateLocalStorage(state);
    }
  },
});

// Helper function to calculate total amount
const calculateTotalAmount = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  updateItemStock,
  restoreCart
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectTotalQuantity = (state) => state.cart.totalQuantity;
export const selectTotalAmount = (state) => state.cart.totalAmount;
export const selectCartLastUpdated = (state) => state.cart.lastUpdated;
export const selectItemQuantity = (productId) => (state) => 
  state.cart.items.find(item => item.id === productId)?.quantity || 0;

export default cartSlice.reducer;
