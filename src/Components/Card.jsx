import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addToCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";

const Card = ({
  name,
  image,
  id,
  price,
  type,
  rating = 0,
  discount = 0,
  stock = 0,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ==========================================
  // WISHLIST FROM REDUX
  // ==========================================

  const wishlist = useSelector((state) => state.wishlist.items);

  const isWishlisted = wishlist.some((item) => item.id === id);

  // ==========================================
  // DISCOUNT PRICE
  // ==========================================

  const discountedPrice =
    discount > 0 ? (price - (price * discount) / 100).toFixed(2) : price;

  // ==========================================
  // PRODUCT DETAILS
  // ==========================================

  const handleCardClick = () => {
    navigate(`/products/${id}`);
  };

  // ==========================================
  // WISHLIST
  // ==========================================

  const handleWishlist = (e) => {
    e.stopPropagation();

    const wishlistProduct = {
      id,
      name,
      image,
      price,
      type,
      rating,
      discount,
      stock,
    };

    if (isWishlisted) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist(wishlistProduct));
    }
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = (e) => {
    e.stopPropagation();

    const cartProduct = {
      id,
      name,
      image,
      price: Number(discountedPrice),
      type,
      rating,
      discount,
    };

    dispatch(addToCart(cartProduct));

    alert(`${name} added to cart!`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="
        relative
        w-full
        min-w-0
        max-w-full
        bg-white
        p-2
        sm:p-3
        md:p-4
        rounded-lg
        flex
        flex-col
        gap-2
        sm:gap-3
        shadow-lg
        cursor-pointer
        hover:shadow-2xl
        hover:-translate-y-1
        transition-all
        duration-300
        overflow-hidden
      "
    >
      {/* ==========================================
          DISCOUNT BADGE
      ========================================== */}

      {discount > 0 && (
        <span
          className="
            absolute
            top-3
            left-3
            z-10
            bg-red-500
            text-white
            text-[10px]
            sm:text-xs
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
          WISHLIST BUTTON
      ========================================== */}

      <button
        type="button"
        onClick={handleWishlist}
        className="
          absolute
          top-3
          right-3
          z-10
          w-8
          h-8
          sm:w-9
          sm:h-9
          bg-white
          rounded-full
          shadow-md
          flex
          items-center
          justify-center
          text-lg
          sm:text-xl
          hover:scale-110
          transition-transform
          duration-200
        "
        aria-label="Add to wishlist"
      >
        {isWishlisted ? "❤️" : "🤍"}
      </button>

      {/* ==========================================
          PRODUCT IMAGE
      ========================================== */}

      <div className="w-full aspect-square overflow-hidden rounded-lg">
        <img
          src={image}
          alt={name}
          className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-300
            hover:scale-105
          "
        />
      </div>

      {/* ==========================================
          PRODUCT DETAILS
      ========================================== */}

      <div className="w-full min-w-0">
        <h3
          className="
            text-sm
            sm:text-base
            md:text-lg
            font-semibold
            leading-tight
            truncate
          "
          title={name}
        >
          {name}
        </h3>

        <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">{type}</p>

        {/* Rating */}

        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-500 text-sm">⭐</span>

          <span className="text-xs sm:text-sm text-gray-600">{rating}</span>
        </div>

        {/* Price */}

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <p className="font-bold text-sm sm:text-base md:text-lg">
            ${discountedPrice}
          </p>

          {discount > 0 && (
            <p className="text-xs sm:text-sm text-gray-400 line-through">
              ${price}
            </p>
          )}
        </div>

        {/* Stock */}

        {stock > 0 && stock <= 10 && (
          <p className="text-xs text-red-500 mt-1 font-medium">
            Only {stock} left!
          </p>
        )}

        {stock > 10 && <p className="text-xs text-green-600 mt-1">In Stock</p>}

        {stock === 0 && (
          <p className="text-xs text-red-600 mt-1 font-medium">Out of Stock</p>
        )}
      </div>

      {/* ==========================================
          ADD TO CART
      ========================================== */}

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={stock === 0}
        className="
          w-full
          h-9
          sm:h-10
          md:h-[45px]
          bg-black
          text-white
          rounded-lg
          text-xs
          sm:text-sm
          md:text-base
          font-medium
          hover:bg-gray-800
          active:scale-95
          transition-all
          duration-300
          whitespace-nowrap
          disabled:bg-gray-300
          disabled:cursor-not-allowed
        "
      >
        {stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
};

export default Card;
