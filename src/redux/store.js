import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";
import wishlistReducer from "./wishlistSlice";
import recentlyViewedReducer from "./recentlyViewedSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    order: orderReducer,
    wishlist: wishlistReducer,
    recentlyViewed: recentlyViewedReducer,
  },
});

export default store;
