import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/cartSlice";

import { addToWishlist } from "../redux/wishlistSlice";

const Cart = () => {
  const cart = useSelector((state) => state.cart.items);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ==========================================
  // TOTAL ITEMS
  // ==========================================

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // ==========================================
  // TOTAL PRICE
  // ==========================================

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  // ==========================================
  // MOVE TO WISHLIST
  // ==========================================

  const handleMoveToWishlist = (item) => {
    dispatch(
      addToWishlist({
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        type: item.type,
        rating: item.rating,
        discount: item.discount || 0,
        stock: item.stock || 0,
      }),
    );

    dispatch(removeFromCart(item.id));

    alert(`${item.name} moved to wishlist!`);
  };

  // ==========================================
  // CHECKOUT
  // ==========================================

  const handleCheckout = () => {
    const loggedInUser =
      localStorage.getItem("loggedInUser") ||
      sessionStorage.getItem("loggedInUser");

    if (!loggedInUser) {
      alert("Please sign in first.");
      navigate("/signin");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    navigate("/delivery-address", {
      state: {
        products: cart,
        fromCart: true,
      },
    });
  };

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cart.length === 0) {
    return (
      <div
        className="
          min-h-screen
          w-full
          bg-gray-100
          flex
          items-center
          justify-center
          px-4
        "
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>

          <h2
            className="
              text-[clamp(18px,2vw,30px)]
              font-semibold
              text-gray-700
            "
          >
            Your cart is empty
          </h2>

          <p
            className="
              mt-2
              text-[clamp(13px,1vw,16px)]
              text-gray-500
            "
          >
            Add some products to your cart.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="
              mt-5
              bg-black
              text-white
              px-6
              py-3
              rounded-lg
              text-base
              hover:bg-gray-800
              active:scale-95
              transition-all
            "
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        w-full
        bg-gray-100
        px-3
        py-6
        sm:px-5
        sm:py-8
        md:px-6
        md:py-10
        overflow-x-hidden
      "
    >
      <div className="w-full max-w-5xl mx-auto">
        {/* ==========================================
            PAGE HEADING
        ========================================== */}

        <div className="mb-6">
          <h1
            className="
              text-2xl
              sm:text-3xl
              md:text-4xl
              font-semibold
              text-gray-900
            "
          >
            Shopping Cart
          </h1>

          <p className="text-gray-500 mt-1">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {/* ==========================================
            CART PRODUCTS
        ========================================== */}

        {cart.map((item) => {
          const itemSubtotal = Number(item.price) * item.quantity;

          const isMaxStock = item.stock && item.quantity >= item.stock;

          return (
            <div
              key={item.id}
              className="
                w-full
                bg-white
                rounded-lg
                shadow-md
                p-3
                sm:p-4
                md:p-5
                mb-4
                sm:mb-5
                flex
                flex-col
                sm:flex-row
                sm:items-center
                gap-4
                sm:gap-5
                overflow-hidden
              "
            >
              {/* ==========================================
                  PRODUCT IMAGE
              ========================================== */}

              <div
                className="
                  w-full
                  sm:w-auto
                  flex
                  justify-center
                  sm:block
                  shrink-0
                "
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="
                    w-[160px]
                    h-[160px]
                    sm:w-[120px]
                    sm:h-[120px]
                    md:w-[130px]
                    md:h-[130px]
                    object-cover
                    rounded-lg
                  "
                />
              </div>

              {/* ==========================================
                  PRODUCT DETAILS
              ========================================== */}

              <div className="flex-1 min-w-0 w-full">
                <h2
                  className="
                    text-[clamp(14px,1.3vw,20px)]
                    font-semibold
                    text-gray-900
                    break-words
                  "
                >
                  {item.name}
                </h2>

                <p
                  className="
                    text-[clamp(12px,0.9vw,15px)]
                    text-gray-500
                    mt-1
                    truncate
                    capitalize
                  "
                >
                  {item.type}
                </p>

                <p
                  className="
                    font-bold
                    text-[clamp(14px,1vw,18px)]
                    mt-2
                  "
                >
                  ${Number(item.price).toFixed(2)}
                </p>

                {/* ==========================================
                    QUANTITY
                ========================================== */}

                <div
                  className="
                    flex
                    items-center
                    mt-4
                    rounded-md
                    overflow-hidden
                    w-fit
                    border
                    border-gray-300
                  "
                >
                  {/* MINUS */}

                  <button
                    type="button"
                    onClick={() => dispatch(decreaseQuantity(item.id))}
                    disabled={item.quantity <= 1}
                    className="
                      w-9
                      h-9
                      bg-gray-200
                      flex
                      items-center
                      justify-center
                      text-base
                      font-semibold
                      hover:bg-gray-300
                      active:scale-95
                      transition
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                    "
                  >
                    −
                  </button>

                  {/* QUANTITY */}

                  <span
                    className="
                      w-10
                      h-9
                      bg-white
                      flex
                      items-center
                      justify-center
                      text-sm
                      font-semibold
                    "
                  >
                    {item.quantity}
                  </span>

                  {/* PLUS */}

                  <button
                    type="button"
                    onClick={() => dispatch(increaseQuantity(item.id))}
                    disabled={isMaxStock}
                    className="
                      w-9
                      h-9
                      bg-gray-200
                      flex
                      items-center
                      justify-center
                      text-base
                      font-semibold
                      hover:bg-gray-300
                      active:scale-95
                      transition
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                    "
                  >
                    +
                  </button>
                </div>

                {/* STOCK MESSAGE */}

                {item.stock > 0 && (
                  <p
                    className={`
                      text-xs
                      mt-2
                      ${isMaxStock ? "text-red-500" : "text-gray-500"}
                    `}
                  >
                    {isMaxStock
                      ? `Maximum ${item.stock} available`
                      : `${item.stock} available`}
                  </p>
                )}
              </div>

              {/* ==========================================
                  PRICE + ACTIONS
              ========================================== */}

              <div
                className="
                  w-full
                  sm:w-auto
                  flex
                  sm:flex-col
                  items-center
                  justify-between
                  sm:items-end
                  gap-3
                  sm:gap-3
                  pt-3
                  sm:pt-0
                  border-t
                  sm:border-t-0
                  border-gray-100
                  shrink-0
                "
              >
                {/* SUBTOTAL */}

                <div className="text-right">
                  <p className="text-xs text-gray-500">Subtotal</p>

                  <p
                    className="
                      font-bold
                      text-[clamp(14px,1vw,18px)]
                      whitespace-nowrap
                    "
                  >
                    ${itemSubtotal.toFixed(2)}
                  </p>
                </div>

                {/* MOVE TO WISHLIST */}

                <button
                  type="button"
                  onClick={() => handleMoveToWishlist(item)}
                  className="
                    text-sm
                    text-gray-700
                    hover:text-black
                    underline
                    whitespace-nowrap
                    transition
                  "
                >
                  ♡ Move to Wishlist
                </button>

                {/* REMOVE */}

                <button
                  type="button"
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="
                    bg-black
                    text-white
                    px-[clamp(12px,1.5vw,20px)]
                    py-[clamp(7px,0.7vw,10px)]
                    rounded-lg
                    text-[clamp(11px,0.8vw,14px)]
                    whitespace-nowrap
                    hover:bg-red-600
                    active:scale-95
                    transition
                  "
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}

        {/* ==========================================
            ORDER SUMMARY
        ========================================== */}

        <div
          className="
            w-full
            bg-white
            rounded-lg
            shadow-md
            p-4
            sm:p-5
            md:p-6
            mt-6
            sm:mt-8
          "
        >
          <h2
            className="
              text-xl
              sm:text-2xl
              font-semibold
              mb-5
            "
          >
            Order Summary
          </h2>

          <div
            className="
              flex
              justify-between
              text-gray-600
              mb-3
            "
          >
            <span>Total Items</span>
            <span>{totalItems}</span>
          </div>

          <div
            className="
              flex
              justify-between
              text-gray-600
              mb-4
            "
          >
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div
              className="
                flex
                flex-col
                sm:flex-row
                justify-between
                items-start
                sm:items-center
                gap-4
              "
            >
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>

                <p
                  className="
                    text-2xl
                    sm:text-3xl
                    font-bold
                  "
                >
                  ${totalPrice.toFixed(2)}
                </p>
              </div>

              {/* CHECKOUT */}

              <button
                type="button"
                onClick={handleCheckout}
                className="
                  w-full
                  sm:w-auto
                  bg-black
                  text-white
                  px-[clamp(20px,2vw,32px)]
                  py-[clamp(9px,0.8vw,13px)]
                  rounded-lg
                  text-[clamp(12px,0.9vw,16px)]
                  font-medium
                  hover:bg-gray-800
                  active:scale-95
                  transition
                "
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
