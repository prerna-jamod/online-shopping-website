import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentOrder: null,
  orders: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,

  reducers: {
    // ==========================================
    // CREATE ORDER
    // ==========================================

    setOrder: (state, action) => {
      state.currentOrder = action.payload;
      state.orders.push(action.payload);
    },

    // ==========================================
    // UPDATE EXISTING ORDER
    // ==========================================

    updateOrder: (state, action) => {
      const updatedOrder = action.payload;

      const index = state.orders.findIndex(
        (order) =>
          order.id === updatedOrder.id ||
          order.orderId === updatedOrder.orderId
      );

      if (index !== -1) {
        state.orders[index] = {
          ...state.orders[index],
          ...updatedOrder,
        };
      }

      if (
        state.currentOrder &&
        (
          state.currentOrder.id === updatedOrder.id ||
          state.currentOrder.orderId === updatedOrder.orderId
        )
      ) {
        state.currentOrder = {
          ...state.currentOrder,
          ...updatedOrder,
        };
      }
    },

    // ==========================================
    // CLEAR CURRENT ORDER
    // ==========================================

    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },

    // ==========================================
    // CANCEL ORDER
    // ==========================================

    cancelOrder: (state, action) => {
      const {
        orderId,
        cancelReason,
        additionalReason = "",
      } = action.payload;

      const order = state.orders.find(
        (item) =>
          item.id === orderId ||
          item.orderId === orderId
      );

      if (!order) {
        return;
      }

      // ==========================================
      // CANCEL DETAILS
      // ==========================================

      order.status = "Cancelled";
      order.cancelledBy = "Customer";
      order.cancelReason = cancelReason;
      order.additionalReason = additionalReason;
      order.cancelledAt = new Date().toISOString();

      // ==========================================
      // REFUND DETAILS
      // ==========================================

      if (order.paymentStatus === "Paid") {
        order.refundStatus = "Processing";
        order.refundAmount = Number(order.totalPrice) || 0;
        order.refundMethod = "Original Payment Method";
      } else {
        order.refundStatus = "Not Applicable";
        order.refundAmount = 0;
        order.refundMethod = "";
      }

      // ==========================================
      // UPDATE CURRENT ORDER
      // ==========================================

      if (
        state.currentOrder &&
        (
          state.currentOrder.id === orderId ||
          state.currentOrder.orderId === orderId
        )
      ) {
        state.currentOrder = {
          ...order,
        };
      }
    },

    // ==========================================
    // UPDATE REFUND STATUS
    // ==========================================

    updateRefundStatus: (state, action) => {
      const {
        orderId,
        refundStatus,
      } = action.payload;

      const order = state.orders.find(
        (item) =>
          item.id === orderId ||
          item.orderId === orderId
      );

      if (!order) {
        return;
      }

      order.refundStatus = refundStatus;

      // ==========================================
      // REFUND AMOUNT
      // ==========================================

      if (refundStatus === "Processing") {
        order.refundAmount =
          Number(order.totalPrice) || 0;
      }

      // ==========================================
      // REFUNDED
      // ==========================================

      if (refundStatus === "Refunded") {
        order.refundAmount =
          Number(order.totalPrice) || 0;

        order.refundedAt =
          new Date().toISOString();
      }

      // ==========================================
      // UPDATE CURRENT ORDER
      // ==========================================

      if (
        state.currentOrder &&
        (
          state.currentOrder.id === orderId ||
          state.currentOrder.orderId === orderId
        )
      ) {
        state.currentOrder = {
          ...order,
        };
      }
    },
  },
});

export const {
  setOrder,
  updateOrder,
  clearCurrentOrder,
  cancelOrder,
  updateRefundStatus,
} = orderSlice.actions;

export default orderSlice.reducer;
