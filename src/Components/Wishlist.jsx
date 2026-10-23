import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { removeFromWishlist } from "../redux/wishlistSlice";

import { addToCart } from "../redux/cartSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ==========================================
  // GET WISHLIST FROM REDUX
  // ==========================================

  const wishlist = useSelector((state) => state.wishlist?.items || []);

  // ==========================================
  // REMOVE FROM WISHLIST
  // ==========================================

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        image: product.image,
        price: Number(product.price),
        type: product.type,
        rating: product.rating,
        discount: product.discount || 0,
        stock: product.stock || 0,
      }),
    );

    alert(`${product.name} added to cart!`);
  };

  // ==========================================
  // EMPTY WISHLIST
  // ==========================================

  if (wishlist.length === 0) {
    return (
      <div
        className="
          min-h-[60vh]
          flex
          flex-col
          items-center
          justify-center
          px-4
        "
      >
        {/* HEART ICON */}

        <div className="text-6xl mb-4">🤍</div>

        {/* HEADING */}

        <h2
          className="
            text-xl
            sm:text-2xl
            font-semibold
          
          "
        >
          Your Wishlist is Empty
        </h2>

        {/* DESCRIPTION */}

        <p
          className="
            text-xl
                sm:text-2xl
                font-semibold
          "
        >
          Save your favorite products here.
        </p>

        {/* CONTINUE SHOPPING */}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="
            mt-6
            bg-black
            text-white
            px-6
            py-3
            rounded-lg
            hover:bg-gray-800
            active:scale-95
            transition-all
          "
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // ==========================================
  // WISHLIST PRODUCTS
  // ==========================================

  return (
    <div
      className="
        w-full
        max-w-[1200px]
        mx-auto
        px-4
        py-10
      "
    >
      {/* ==========================================
          HEADING
      ========================================== */}

      <div className="mb-8">
        <h1
          className="
            text-3xl
            sm:text-4xl
            font-semibold
          "
        >
          My Wishlist ❤️
        </h1>

        <p className="text-gray-500 mt-2">
          {wishlist.length} {wishlist.length === 1 ? "product" : "products"}{" "}
          saved
        </p>
      </div>

      {/* ==========================================
          PRODUCTS GRID
      ========================================== */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-5
        "
      >
        {wishlist.map((product) => {
          // ==========================================
          // DISCOUNTED PRICE
          // ==========================================

          const originalPrice = Number(product.price || 0);

          const discount = Number(product.discount || 0);

          const discountedPrice =
            discount > 0
              ? (originalPrice - (originalPrice * discount) / 100).toFixed(2)
              : originalPrice.toFixed(2);

          // ==========================================
          // STOCK
          // ==========================================

          const stock = Number(product.stock || 0);

          const isOutOfStock = stock === 0;

          return (
            <div
              key={product.id}
              className="
                bg-white
                rounded-xl
                shadow-lg
                p-4
                relative
                hover:shadow-2xl
                transition-all
                duration-300
              "
            >
              {/* ==========================================
                  DISCOUNT BADGE
              ========================================== */}

              {discount > 0 && (
                <span
                  className="
                    absolute
                    top-5
                    left-5
                    z-10
                    bg-red-500
                    text-white
                    text-xs
                    font-semibold
                    px-2
                    py-1
                    rounded-full
                  "
                >
                  {discount}% OFF
                </span>
              )}

              {/* ==========================================
                  REMOVE FROM WISHLIST
              ========================================== */}

              <button
                type="button"
                onClick={() => handleRemove(product.id)}
                className="
                  absolute
                  top-3
                  right-3
                  z-10
                  w-9
                  h-9
                  bg-white
                  rounded-full
                  shadow-md
                  flex
                  items-center
                  justify-center
                  hover:scale-110
                  transition-transform
                "
                title="Remove from wishlist"
                aria-label="Remove from wishlist"
              >
                ❤️
              </button>

              {/* ==========================================
                  PRODUCT IMAGE
              ========================================== */}

              <div
                onClick={() => navigate(`/products/${product.id}`)}
                className="
                  w-full
                  aspect-square
                  overflow-hidden
                  rounded-lg
                  cursor-pointer
                "
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="
                    w-full
                    h-full
                    object-cover
                    hover:scale-105
                    transition-transform
                    duration-300
                  "
                />
              </div>

              {/* ==========================================
                  PRODUCT DETAILS
              ========================================== */}

              <div className="mt-4">
                {/* PRODUCT NAME */}

                <h3
                  className="
                    text-lg
                    font-semibold
                    truncate
                  "
                  title={product.name}
                >
                  {product.name}
                </h3>

                {/* CATEGORY */}

                <p
                  className="
                    text-sm
                    text-gray-500
                    mt-1
                    capitalize
                  "
                >
                  {product.type}
                </p>

                {/* RATING */}

                <div
                  className="
                    flex
                    items-center
                    gap-1
                    mt-2
                  "
                >
                  <span className="text-yellow-500">⭐</span>

                  <span className="text-sm text-gray-600">
                    {product.rating || 0}
                  </span>
                </div>

                {/* ==========================================
                    PRICE
                ========================================== */}

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    mt-2
                    flex-wrap
                  "
                >
                  <span
                    className="
                      font-bold
                      text-lg
                    "
                  >
                    ${discountedPrice}
                  </span>

                  {discount > 0 && (
                    <span
                      className="
                        text-sm
                        text-gray-400
                        line-through
                      "
                    >
                      ${originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* ==========================================
                    STOCK INFORMATION
                ========================================== */}

                {stock > 10 && (
                  <p
                    className="
                      text-xs
                      text-green-600
                      mt-2
                    "
                  >
                    In Stock
                  </p>
                )}

                {stock > 0 && stock <= 10 && (
                  <p
                    className="
                      text-xs
                      text-red-500
                      mt-2
                      font-medium
                    "
                  >
                    Only {stock} left!
                  </p>
                )}

                {stock === 0 && (
                  <p
                    className="
                      text-xs
                      text-red-600
                      mt-2
                      font-medium
                    "
                  >
                    Out of Stock
                  </p>
                )}

                {/* ==========================================
                    ADD TO CART
                ========================================== */}

                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  disabled={isOutOfStock}
                  className="
                    w-full
                    mt-4
                    h-11
                    bg-black
                    text-white
                    rounded-lg
                    font-medium
                    hover:bg-gray-800
                    active:scale-95
                    transition-all
                    disabled:bg-gray-300
                    disabled:cursor-not-allowed
                  "
                >
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
