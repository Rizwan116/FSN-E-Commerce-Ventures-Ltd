import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage
const savedCart = JSON.parse(localStorage.getItem("cartState"));

const initialState = savedCart || {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const updateLocalStorage = (state) => {
  localStorage.setItem("cartState", JSON.stringify(state));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      state.totalQuantity++;
      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({ ...newItem, quantity: 1 });
      }

      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      updateLocalStorage(state);
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      const itemToRemove = state.items.find((item) => item.id === itemId);

      if (itemToRemove) {
        state.totalQuantity -= itemToRemove.quantity;
        state.items = state.items.filter((item) => item.id !== itemId);
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        updateLocalStorage(state);
      }
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity++;
        state.totalQuantity++;
        state.totalAmount += item.price;
        updateLocalStorage(state);
      }
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity--;
        state.totalQuantity--;
        state.totalAmount -= item.price;
      } else if (item) {
        state.totalQuantity--;
        state.items = state.items.filter((i) => i.id !== item.id);
        state.totalAmount -= item.price;
      }
      updateLocalStorage(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      updateLocalStorage(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
