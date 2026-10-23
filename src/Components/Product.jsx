import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

function Product({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <div>
      <h3>{product.title}</h3>

      <p>₹{product.price}</p>

      <button onClick={handleAddToCart}>Add To Cart</button>
    </div>
  );
}

export default Product;
