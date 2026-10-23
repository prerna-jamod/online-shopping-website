import React from "react";
import Navbar from "./Components/Navbar";
import Header from "./Components/Header";
import Deals from "./Components/Deals";
import NewArrivals from "./Components/NewArrivals";
import Packages from "./Components/Packages";
import Feedback from "./Components/Feedback";
import Footer from "./Components/Footer";
import Signin from "./Components/Signin";
import SignUp from "./Components/SignUp";
import Cart from "./Components/Cart";
import ProductDetails from "./Components/ProductDetails";
import DeliveryAddress from "./Components/DeliveryAddress";
import Checkout from "./Components/Checkout";
import OrderConfirmation from "./Components/OrderConfirmation";
import MyOrder from "./Components/MyOrder";
import CancelOrder from "./Components/CancelOrder";
import { Routes, Route } from "react-router-dom";
import Wishlist from "./Components/Wishlist";

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        {/* ================= HOME ================= */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Deals />
              <NewArrivals />
              <Packages />
              <Feedback />
              <Footer />
            </>
          }
        />

        {/* ================= MAIN PAGES ================= */}
        <Route path="/deals" element={<Deals />} />
        <Route path="/NewArrivals" element={<NewArrivals />} />
        <Route path="/packages" element={<Packages />} />

        {/* ================= AUTHENTICATION ================= */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signUp" element={<SignUp />} />

        {/* ================= SHOPPING ================= */}
        <Route path="/cart" element={<Cart />} />

        {/* ================= PRODUCT DETAILS ================= */}
        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        {/* ================= DELIVERY ADDRESS ================= */}
        <Route
          path="/delivery-address"
          element={<DeliveryAddress />}
        />

        {/* ================= CHECKOUT ================= */}
        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* ================= ORDER CONFIRMATION ================= */}
        <Route
          path="/order-confirmation"
          element={<OrderConfirmation />}
        />

        {/* ================= MY ORDERS ================= */}
        <Route
          path="/my-orders"
          element={<MyOrder />}
        />

        {/* ================= CANCEL ORDER ================= */}
        <Route
          path="/cancel-order"
          element={<CancelOrder />}
        />

        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </>
  );
};

export default App;
