import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ==========================================
  // GET ORDER
  // ==========================================

  let savedOrder = localStorage.getItem("latestOrder");
  let localOrder = null;

  try {
    localOrder = savedOrder ? JSON.parse(savedOrder) : null;
  } catch (error) {
    console.error("Error reading latestOrder:", error);
  }

  const order = location.state?.order || localOrder;

  // ==========================================
  // ORDER NOT FOUND
  // ==========================================

  if (!order) {
    return (
      <div className="order-not-found">
        <h2>Order not found</h2>

        <button onClick={() => navigate("/")}>Continue Shopping</button>
      </div>
    );
  }

  // ==========================================
  // PRODUCTS
  // ==========================================

  const products =
    order.products?.length > 0
      ? order.products
      : order.product
        ? [order.product]
        : [];

  // ==========================================
  // CALCULATE TOTAL
  // ==========================================

  const calculatedTotal = products.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;

    return total + price * quantity;
  }, 0);

  const totalAmount =
    Number(order.totalAmount) || Number(order.totalPrice) || calculatedTotal;

  // ==========================================
  // PRINT RECEIPT
  // ==========================================

  const handlePrintReceipt = () => {
    window.print();
  };

  // ==========================================
  // MY ORDERS
  // ==========================================

  const handleMyOrders = () => {
    navigate("/my-orders");
  };

  // ==========================================
  // CANCEL ORDER
  // ==========================================

  const handleCancelOrder = () => {
    navigate("/cancel-order", {
      state: {
        order: order,
      },
    });
  };

  return (
    <div className="order-confirmation-page">
      {/* ==========================================
          RECEIPT
      ========================================== */}

      <div className="order-receipt" id="printReceipt">
        {/* ==========================================
            SUCCESS
        ========================================== */}

        <div className="success-section">
          <div className="success-icon">✓</div>

          <h1>Order Confirmed!</h1>

          <p>Thank you for shopping with FASCO.</p>

          <p className="confirmed-text">
            Your order has been confirmed successfully.
          </p>
        </div>

        {/* ==========================================
            ORDER DETAILS
        ========================================== */}

        <div className="order-details">
          <div className="order-header">
            <div>
              <h2>Order Details</h2>
            </div>

            <div className="order-id">
              <strong>Order ID:</strong>

              <span>{order.orderId || "FASCO-ORDER"}</span>
            </div>
          </div>

          <div className="order-info-grid">
            <div>
              <strong>Order Date</strong>

              <p>{order.orderDate || new Date().toLocaleDateString("en-IN")}</p>
            </div>

            <div>
              <strong>Expected Delivery</strong>

              <p>{order.expectedDelivery || "5-7 Business Days"}</p>
            </div>

            <div>
              <strong>Payment Method</strong>

              <p>{order.paymentMethod || "Cash on Delivery"}</p>
            </div>

            <div>
              <strong>Order Status</strong>

              <p
                className={
                  order.status === "Cancelled"
                    ? "status cancelled-status"
                    : "status"
                }
              >
                {order.status || "Confirmed"}
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================
            PRODUCT DETAILS
        ========================================== */}

        <div className="products-section">
          <h2>Product Details</h2>

          {products.length > 0 ? (
            products.map((item, index) => {
              const quantity = Number(item.quantity) || 1;

              const price = Number(item.price) || 0;

              return (
                <div className="confirmation-product" key={item.id || index}>
                  <img
                    src={
                      item.image ||
                      item.thumbnail ||
                      "https://via.placeholder.com/100"
                    }
                    alt={item.name || item.title || "Product"}
                  />

                  <div className="product-info">
                    <h3>{item.name || item.title || "Product"}</h3>

                    <p>Category: {item.type || item.category || "Fashion"}</p>

                    <p>Quantity: {quantity}</p>
                  </div>

                  <div className="product-price">
                    ₹{(price * quantity).toFixed(2)}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No product information available.</p>
          )}

          {/* TOTAL */}

          <div className="total-section">
            <span>Total Amount</span>

            <strong>₹{totalAmount.toFixed(2)}</strong>
          </div>
        </div>

        {/* ==========================================
            DELIVERY ADDRESS
        ========================================== */}

        <div className="delivery-section">
          <h2>Delivery Address</h2>

          <div className="address-box">
            <p>
              <strong>Name:</strong> {order.address?.fullName || "N/A"}
            </p>

            <p>
              <strong>Mobile:</strong> {order.address?.mobile || "N/A"}
            </p>

            <p>
              <strong>Email:</strong> {order.address?.email || "N/A"}
            </p>

            <p>
              <strong>Address:</strong> {order.address?.house},{" "}
              {order.address?.street}, {order.address?.city},{" "}
              {order.address?.state} - {order.address?.pincode}
            </p>

            {order.location && (
              <p>
                <strong>Location:</strong> {order.location}
              </p>
            )}

            {order.coordinates && (
              <p>
                <strong>Coordinates:</strong>{" "}
                {Number(order.coordinates.lat).toFixed(6)},{" "}
                {Number(order.coordinates.lng).toFixed(6)}
              </p>
            )}
          </div>
        </div>

        {/* ==========================================
            ORDER TRACKING
        ========================================== */}

        <div className="tracking-section">
          <h2>Order Tracking</h2>

          <div className="tracking">
            <div className="track-step active">
              <span>✓</span>

              <p>Order Placed</p>
            </div>

            <div className="track-line"></div>

            <div className="track-step active">
              <span>✓</span>

              <p>Confirmed</p>
            </div>

            <div className="track-line"></div>

            <div className="track-step">
              <span>3</span>

              <p>Shipped</p>
            </div>

            <div className="track-line"></div>

            <div className="track-step">
              <span>4</span>

              <p>Delivered</p>
            </div>
          </div>
        </div>

        {/* ==========================================
            ACTION BUTTONS
        ========================================== */}

        <div className="order-actions">
          {/* PRINT */}
          <button className="print-order-btn" onClick={handlePrintReceipt}>
            🖨 Print Order Receipt
          </button>

          {/* MY ORDERS */}
          <button className="my-orders-btn" onClick={handleMyOrders}>
            📦 My Orders
          </button>

          {/* CANCEL ORDER */}
          {order.status !== "Cancelled" ? (
            <button className="cancel-order-btn" onClick={handleCancelOrder}>
              ✕ Cancel Order
            </button>
          ) : (
            <button className="cancelled-order-btn" disabled>
              ✓ Order Cancelled
            </button>
          )}

          {/* CONTINUE SHOPPING */}
          <button
            className="continue-shopping-btn"
            onClick={() => navigate("/")}
          >
            🛍 Continue Shopping
          </button>
        </div>
      </div>

      {/* ==========================================
          PRINT CSS
      ========================================== */}

      <style>
        {`
          @media print {

            body * {
              visibility: hidden;
            }

            #printReceipt,
            #printReceipt * {
              visibility: visible;
            }

            #printReceipt {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 20px;
            }

            .order-actions {
              display: none !important;
            }

            .tracking-section {
              display: none !important;
            }

            .success-section {
              margin-top: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default OrderConfirmation;
