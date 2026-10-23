import React from "react";
import "./packages.css";

import packageImg from "../assets/packageImg.png";

import {
  LuHandHeart,
  LuBadgeCheck,
  LuPackage,
  LuHeadset,
} from "react-icons/lu";

const Packages = () => {
  return (
    <div className="packages-main">
      <div className="package-container">
        <div className="Img-container">
          <div className="chair-image">
            <img
              src={packageImg}
              alt="Women Collection"
              className="package-Image"
            />
          </div>
        </div>

        <div className="package-text">
          <h1 className="women-text">Women Collection</h1>

          <h2 className="Peaky-logo">Peaky Blinders</h2>

          <h2 className="description">DESCRIPTION</h2>

          <p className="parah-package">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque
            duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices
            sollicitudin. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Scelerisque duis.
          </p>

          <div className="small-box">
            <span className="size-text">SIZE:</span>

            <span className="m-text">M</span>
          </div>

          <h5 className="h5-text">$100.00</h5>

          <button className="buynow-btn">Buy Now</button>
        </div>
      </div>

      <div className="icons">
        <div className="feature-box">
          <div className="feature-icon">
            <LuHandHeart />
          </div>

          <div className="feature-text">
            <h3>High Quality</h3>
            <p>crafted from top materials</p>
          </div>
        </div>

        <div className="feature-box">
          <div className="feature-icon">
            <LuBadgeCheck />
          </div>

          <div className="feature-text">
            <h3>Warranty Protection</h3>
            <p>Over 2 years</p>
          </div>
        </div>

        <div className="feature-box">
          <div className="feature-icon">
            <LuPackage />
          </div>

          <div className="feature-text">
            <h3>Free Shipping</h3>
            <p>Order over 150 $</p>
          </div>
        </div>

        <div className="feature-box">
          <div className="feature-icon">
            <LuHeadset />
          </div>

          <div className="feature-text">
            <h3>24 / 7 Support</h3>
            <p>Dedicated support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;
