import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    // ==========================================
    // ADD TO CART
    // ==========================================

    addToCart: (state, action) => {
      const product = action.payload;

      const existingProduct = state.items.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        // Stock limit check
        if (
          existingProduct.stock &&
          existingProduct.quantity >= existingProduct.stock
        ) {
          return;
        }

        existingProduct.quantity += 1;
      } else {
        state.items.push({
          ...product,
          quantity: 1,
        });
      }
    },

    // ==========================================
    // REMOVE FROM CART
    // ==========================================

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },

    // ==========================================
    // INCREASE QUANTITY
    // ==========================================

    increaseQuantity: (state, action) => {
      const product = state.items.find(
        (item) => item.id === action.payload
      );

      if (!product) return;

      // Don't allow quantity above stock
      if (
        product.stock &&
        product.quantity >= product.stock
      ) {
        return;
      }

      product.quantity += 1;
    },

    // ==========================================
    // DECREASE QUANTITY
    // ==========================================

    decreaseQuantity: (state, action) => {
      const product = state.items.find(
        (item) => item.id === action.payload
      );

      if (!product) return;

      if (product.quantity > 1) {
        product.quantity -= 1;
      }
    },

    // ==========================================
    // CLEAR CART
    // ==========================================

    clearCart: (state) => {
      state.items = [];
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
