import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MyOrder = () => {
  const navigate = useNavigate();

  const orders = useSelector((state) => state.order.orders);

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold tracking-wide">No Orders Found</h2>

          <p className="text-3xl font-normal w-[600px] tracking-wide mt-2 text-[30px] ml-[470px]  mr-[200px] text-xs ">
            You haven't placed any orders yet.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-2 bg-black text-white px-5 py-4 rounded-md text-xl font-normal hover:bg-gray-800 transition tracking-wide"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>

          <p className="text-gray-500 mt-2">View and manage your orders.</p>
        </div>

        {/* ORDERS */}
        <div className="space-y-6">
          {[...orders].reverse().map((order) => (
            <div
              key={order.id || order.orderId}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              {/* ORDER HEADER */}
              <div className="flex flex-col md:flex-row justify-between gap-4 border-b pb-5">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>

                  <p className="font-bold mt-1">{order.orderId || order.id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Order Date</p>

                  <p className="font-semibold mt-1">
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </p>
                </div>

                {/* STATUS */}
                <div>
                  <p className="text-sm text-gray-500">Status</p>

                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "Cancelled"
                        ? "bg-red-100 text-red-600"
                        : order.status === "Order Placed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status || "Order Placed"}
                  </span>
                </div>
              </div>

              {/* PRODUCTS */}
              <div className="mt-5 space-y-4">
                {(order.products || [order.product])
                  .filter(Boolean)
                  .map((item, index) => (
                    <div key={item.id || index} className="flex gap-4">
                      <img
                        src={item.image || item.thumbnail || ""}
                        alt={item.name || item.title || "Product"}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {item.name || item.title || "Product"}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          Qty: {item.quantity || 1}
                        </p>

                        <p className="font-semibold mt-1">
                          ₹{(Number(item.price) || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              {/* ORDER SUMMARY */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 border-t pt-5">
                <div>
                  <p className="text-sm text-gray-500">Payment</p>

                  <p className="font-semibold mt-1">
                    {order.paymentStatus || "Pending"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>

                  <p className="font-bold mt-1">
                    ₹{(Number(order.totalPrice) || 0).toLocaleString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Refund</p>

                  <p
                    className={`font-semibold mt-1 ${
                      order.refundStatus === "Processing"
                        ? "text-yellow-600"
                        : order.refundStatus === "Refunded"
                          ? "text-green-600"
                          : order.refundStatus === "Not Applicable"
                            ? "text-gray-500"
                            : "text-gray-500"
                    }`}
                  >
                    {order.refundStatus || "Not Applicable"}
                  </p>
                </div>
              </div>

              {/* REFUND PROCESSING */}
              {order.refundStatus === "Processing" && (
                <div className="mt-5 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="font-semibold text-yellow-800">
                    Refund Processing
                  </p>

                  <p className="text-sm text-yellow-700 mt-1">
                    Your cancellation has been confirmed.
                  </p>

                  <p className="text-sm text-yellow-700 mt-1">
                    Refund Amount: ₹
                    {Number(
                      order.refundAmount || order.totalPrice || 0,
                    ).toLocaleString("en-IN")}
                  </p>

                  <p className="text-sm text-yellow-700 mt-1">
                    Refund Method:{" "}
                    {order.refundMethod || "Original Payment Method"}
                  </p>

                  <p className="text-xs text-yellow-600 mt-2">
                    Refund is currently being processed.
                  </p>
                </div>
              )}

              {/* REFUNDED */}
              {order.refundStatus === "Refunded" && (
                <div className="mt-5 bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="font-semibold text-green-700">
                    Refund Completed
                  </p>

                  <p className="text-sm text-green-600 mt-1">
                    ₹
                    {Number(
                      order.refundAmount || order.totalPrice || 0,
                    ).toLocaleString("en-IN")}{" "}
                    has been refunded.
                  </p>

                  <p className="text-sm text-green-600 mt-1">
                    Refund Method:{" "}
                    {order.refundMethod || "Original Payment Method"}
                  </p>

                  {order.refundedAt && (
                    <p className="text-xs text-green-500 mt-2">
                      Refunded on:{" "}
                      {new Date(order.refundedAt).toLocaleDateString("en-IN")}
                    </p>
                  )}
                </div>
              )}

              {/* CANCELLATION DETAILS */}
              {order.status === "Cancelled" && (
                <div className="mt-5 bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold">Cancellation Details</p>

                  {order.cancelReason && (
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-semibold">Reason:</span>{" "}
                      {order.cancelReason}
                    </p>
                  )}

                  {order.additionalReason && (
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-semibold">
                        Additional Information:
                      </span>{" "}
                      {order.additionalReason}
                    </p>
                  )}

                  {order.cancelledAt && (
                    <p className="text-xs text-gray-400 mt-2">
                      Cancelled on:{" "}
                      {new Date(order.cancelledAt).toLocaleDateString("en-IN")}
                    </p>
                  )}
                </div>
              )}

              {/* CANCEL BUTTON */}
              {order.status !== "Cancelled" && (
                <button
                  type="button"
                  onClick={() =>
                    navigate("/cancel-order", {
                      state: { order },
                    })
                  }
                  className="mt-6 border border-red-500 text-red-500 px-5 py-2.5 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
