import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addToCart } from "../redux/cartSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get Product Details
  useEffect(() => {
    setLoading(true);

    axios
      .get(`https://dummyjson.com/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Product API Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Add Product To Cart
  const handleAddToCart = () => {
    if (!product) return;

    const cartProduct = {
      id: product.id,
      name: product.title,
      image: product.thumbnail,
      price: product.price,
      type: product.category,
    };

    dispatch(addToCart(cartProduct));

    alert(`${product.title} added to cart!`);

    navigate("/cart");
  };

  // Buy Now
  const handleBuyNow = () => {
    if (!product) return;

    // Product ko next page par bhejne ke liye
    const cartProduct = {
      id: product.id,
      name: product.title,
      image: product.thumbnail,
      price: product.price,
      type: product.category,
    };

    // Buy Now → Delivery Address
    navigate("/delivery-address", {
      state: {
        product: cartProduct,
      },
    });
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading product...</p>
      </div>
    );
  }

  // Product Not Found
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-red-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-4 sm:p-6">
        {/* PRODUCT DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* PRODUCT IMAGE */}
          <div className="flex justify-center items-center">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="
                w-full
                max-w-md
                h-[300px]
                sm:h-[350px]
                md:h-[400px]
                object-contain
              "
            />
          </div>

          {/* PRODUCT INFORMATION */}
          <div className="flex flex-col justify-center">
            {/* CATEGORY */}
            <p className="text-gray-500 capitalize">{product.category}</p>

            {/* PRODUCT NAME */}
            <h1 className="text-2xl sm:text-3xl font-bold mt-2">
              {product.title}
            </h1>

            {/* RATING */}
            <div className="mt-3">⭐ {product.rating}</div>

            {/* PRICE */}
            <h2 className="text-2xl font-bold mt-5">${product.price}</h2>

            {/* DISCOUNT */}
            <p className="text-green-600 mt-2">
              {product.discountPercentage}% OFF
            </p>

            {/* DESCRIPTION */}
            <p className="text-gray-600 mt-5 leading-relaxed">
              {product.description}
            </p>

            {/* BRAND */}
            <p className="mt-4">
              <b>Brand:</b> {product.brand || "N/A"}
            </p>

            {/* STOCK */}
            <p className="mt-2">
              <b>Stock:</b> {product.stock}
            </p>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              {/* ADD TO CART */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="
                  bg-black
                  text-white
                  px-8
                  py-3
                  rounded-lg
                  w-full
                  sm:w-auto
                  hover:bg-gray-800
                  active:scale-95
                  transition
                "
              >
                Add to Cart
              </button>

              {/* BUY NOW */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="
                  bg-white
                  text-black
                  border-2
                  border-black
                  px-8
                  py-3
                  rounded-lg
                  w-full
                  sm:w-auto
                  hover:bg-black
                  hover:text-white
                  active:scale-95
                  transition
                "
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* CUSTOMER REVIEWS */}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-2xl font-bold mb-5">Customer Reviews</h2>

          {product.reviews?.length > 0 ? (
            product.reviews.map((review, index) => (
              <div key={index} className="border-b py-4">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                  {/* REVIEWER NAME */}
                  <h3 className="font-semibold">{review.reviewerName}</h3>

                  {/* REVIEW RATING */}
                  <span>⭐ {review.rating}</span>
                </div>

                {/* REVIEW COMMENT */}
                <p className="text-gray-600 mt-2">{review.comment}</p>

                {/* REVIEW DATE */}
                <p className="text-sm text-gray-400 mt-1">{review.date}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
