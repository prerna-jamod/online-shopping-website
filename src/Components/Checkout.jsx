import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { updateOrder } from "../redux/orderSlice";

const Checkout = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  // ==========================================
  // REDUX ORDER
  // ==========================================

  const reduxOrder = useSelector((state) => state.order.currentOrder);

  // ==========================================
  // GET DATA
  // ==========================================

  const products = location.state?.products || [];

  const singleProduct = location.state?.product;

  const address = location.state?.address;

  const selectedLocation = location.state?.location;

  const coordinates = location.state?.coordinates;

  const stateOrder = location.state?.order;

  // ==========================================
  // SAME ORDER
  // ==========================================

  const existingOrder = stateOrder || reduxOrder;

  // ==========================================
  // PRODUCTS
  // ==========================================

  const orderProducts =
    products.length > 0
      ? products
      : singleProduct
        ? [singleProduct]
        : existingOrder?.products || [];

  // ==========================================
  // ADDRESS
  // ==========================================

  const orderAddress = address || existingOrder?.address;

  // ==========================================
  // VALIDATION
  // ==========================================

  if (orderProducts.length === 0 || !orderAddress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="text-center bg-white p-8 rounded-xl shadow">
          <h2 className="text-xl font-bold">Checkout information not found</h2>

          <button
            onClick={() => navigate("/")}
            className="mt-5 bg-black text-white px-6 py-3 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // PRODUCT TOTAL
  // ==========================================

  const productTotal = orderProducts.reduce((total, item) => {
    const price = Number(item.price) || 0;

    const quantity = Number(item.quantity) || 1;

    return total + price * quantity;
  }, 0);

  const discount = 0;

  const deliveryCharge = 0;

  const totalAmount = productTotal - discount + deliveryCharge;

  // ==========================================
  // CONFIRM ORDER
  // ==========================================

  const handleConfirmOrder = () => {
    if (!existingOrder) {
      alert("Order information not found.");
      return;
    }

    const expectedDate = new Date();

    expectedDate.setDate(expectedDate.getDate() + 5);

    const expectedDelivery = expectedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // ========================================
    // UPDATE SAME ORDER
    // ========================================

    const updatedOrder = {
      ...existingOrder,

      products: orderProducts,

      product: orderProducts[0],

      address: orderAddress,

      location: selectedLocation || existingOrder.location || "",

      coordinates: coordinates || existingOrder.coordinates || null,

      totalPrice: totalAmount,

      discount,

      deliveryCharge,

      status: "Order Placed",

      paymentStatus: "Paid",

      refundStatus: "Not Applicable",

      orderDate: existingOrder.orderDate || new Date().toISOString(),

      createdAt: existingOrder.createdAt || new Date().toISOString(),

      expectedDelivery,
    };

    // ========================================
    // UPDATE REDUX
    // ========================================

    dispatch(updateOrder(updatedOrder));

    // ========================================
    // LOCAL STORAGE
    // ========================================

    localStorage.setItem("latestOrder", JSON.stringify(updatedOrder));

    // ========================================
    // ORDER CONFIRMATION
    // ========================================

    navigate("/order-confirmation", {
      state: {
        order: updatedOrder,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* ======================================
            TITLE
        ====================================== */}

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        {/* ======================================
            MAIN GRID
        ====================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ====================================
              PRODUCTS
          ==================================== */}

          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Order Items</h2>

            <div className="space-y-5">
              {orderProducts.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex gap-4 border-b pb-5"
                >
                  <img
                    src={item.image || item.thumbnail || ""}
                    alt={item.name || item.title || "Product"}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {item.name || item.title || "Product"}
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      Quantity: {item.quantity || 1}
                    </p>

                    <p className="font-semibold mt-2">
                      ₹{(Number(item.price) || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ==================================
                ADDRESS
            ================================== */}

            <div className="mt-8 border rounded-xl p-5">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Delivery Address</h2>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/delivery-address", {
                      state: {
                        products: orderProducts,

                        address: orderAddress,

                        location: selectedLocation,

                        coordinates,

                        order: existingOrder,

                        editMode: true,
                      },
                    })
                  }
                  className="text-sm font-semibold underline"
                >
                  Edit
                </button>
              </div>

              <div className="mt-4 text-sm text-gray-600 leading-6">
                <p>
                  <strong>{orderAddress.fullName}</strong>
                </p>

                <p>📱 {orderAddress.mobile}</p>

                <p>📧 {orderAddress.email}</p>

                <p>
                  {orderAddress.house}, {orderAddress.street}
                </p>

                <p>
                  {orderAddress.city}, {orderAddress.state} -{" "}
                  {orderAddress.pincode}
                </p>
              </div>
            </div>
          </div>

          {/* ====================================
              SUMMARY
          ==================================== */}

          <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
            <h2 className="text-xl font-bold mb-6">Price Details</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Product Total</span>

                <span>₹{productTotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>

                <span>- ₹{discount.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>

                <span>Free</span>
              </div>

              <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Total Amount</span>

                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* ==================================
                PAYMENT
            ================================== */}

            <div className="mt-6 border rounded-lg p-4">
              <p className="font-semibold">Payment Method</p>

              <p className="text-sm text-gray-500 mt-1">Online Payment</p>
            </div>

            {/* ==================================
                CONFIRM
            ================================== */}

            <button
              type="button"
              onClick={handleConfirmOrder}
              className="w-full mt-6 bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
