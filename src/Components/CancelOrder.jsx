import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { cancelOrder } from "../redux/orderSlice";

const CancelOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const order = location.state?.order;

  const [cancelReason, setCancelReason] = useState("");
  const [additionalReason, setAdditionalReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h2 className="text-xl font-bold">Order Not Found</h2>

          <button
            onClick={() => navigate("/my-orders")}
            className="mt-5 bg-black text-white px-6 py-3 rounded-lg"
          >
            My Orders
          </button>
        </div>
      </div>
    );
  }

  const handleCancelOrder = () => {
    if (!cancelReason) {
      alert("Please select a cancellation reason.");
      return;
    }

    setLoading(true);

    // ==========================================
    // UPDATE ORDER IN REDUX
    // ==========================================

    dispatch(
      cancelOrder({
        orderId: order.id || order.orderId,
        cancelReason,
        additionalReason,
      }),
    );

    // ==========================================
    // REDIRECT
    // ==========================================

    setTimeout(() => {
      setLoading(false);
      navigate("/my-orders");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold ">Cancel Order</h1>
          <p className="text-3xl font-normal w-[600px] ml-[30px] mt-2 text-[20px] tracking-wide mr-[100px] text-xs">
            Please tell us why you want to cancel this order.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* ORDER INFORMATION */}-p
          <div className="border-b pb-5">
            <p className="text-sm text-gray-500">Order ID</p>

            <p className="font-bold mt-1">{order.orderId || order.id}</p>

            <p className="text-sm text-gray-500 mt-4">Total Amount</p>

            <p className="font-bold mt-1">
              ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
            </p>

            <p className="text-sm text-gray-500 mt-4">Payment Status</p>

            <p className="font-semibold mt-1">
              {order.paymentStatus || "Pending"}
            </p>
          </div>
          {/* REFUND INFORMATION */}
          {order.paymentStatus === "Paid" && (
            <div className="mt-5 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-semibold text-blue-800">Refund Information</p>

              <p className="text-sm text-blue-700 mt-1">
                Since this order is already paid, the refund will be processed
                after cancellation.
              </p>

              <p className="text-sm text-blue-700 mt-2">
                Refund Amount: ₹
                {Number(order.totalPrice || 0).toLocaleString("en-IN")}
              </p>

              <p className="text-sm text-blue-700 mt-1">
                Refund Method: Original Payment Method
              </p>
            </div>
          )}
          {/* CANCELLATION REASON */}
          <div className="mt-6">
            <label className="block text-sm font-semibold mb-2">
              Cancellation Reason *
            </label>

            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:border-black"
            >
              <option value="">Select Reason</option>

              <option value="Ordered by mistake">Ordered by mistake</option>

              <option value="Found a better price">Found a better price</option>

              <option value="Product no longer required">
                Product no longer required
              </option>

              <option value="Delivery time is too long">
                Delivery time is too long
              </option>

              <option value="Changed my mind">Changed my mind</option>

              <option value="Other">Other</option>
            </select>
          </div>
          {/* ADDITIONAL INFORMATION */}
          <div className="mt-5">
            <label className="block text-sm font-semibold mb-2">
              Additional Information
            </label>

            <textarea
              value={additionalReason}
              onChange={(e) => setAdditionalReason(e.target.value)}
              placeholder="Tell us more..."
              rows={4}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:border-black resize-none"
            />
          </div>
          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 mt-7">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Keep Order
            </button>

            <button
              type="button"
              onClick={handleCancelOrder}
              disabled={loading}
              className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
            >
              {loading ? "Cancelling..." : "Confirm Cancellation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrder;
