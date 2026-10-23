
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const recentlyViewedSlice = createSlice({
  name: "recentlyViewed",

  initialState,

  reducers: {
    addRecentlyViewed: (state, action) => {
      const product = action.payload;

      // Remove duplicate product
      state.items = state.items.filter(
        (item) => item.id !== product.id
      );

      // Add latest product at first position
      state.items.unshift(product);

      // Keep only latest 6 products
      state.items = state.items.slice(0, 6);
    },

    removeRecentlyViewed: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },

    clearRecentlyViewed: (state) => {
      state.items = [];
    },
  },
});

export const {
  addRecentlyViewed,
  removeRecentlyViewed,
  clearRecentlyViewed,
} = recentlyViewedSlice.actions;

export default recentlyViewedSlice.reducer;
