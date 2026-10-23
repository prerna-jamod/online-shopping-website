import React, { useState } from "react";
import "./Navbar.css";

import firstImg from "../assets/first_Img.png";
import secondImg from "../assets/Img2.png";
import saleImg from "../assets/sale.png";
import fourthImg from "../assets/Img4.png";
import fifthImg from "../assets/Img5.png";

import brand1 from "../assets/logo.png";
import brand2 from "../assets/louis.png";
import brand3 from "../assets/prada.png";
import brand4 from "../assets/calvin.png";
import brand5 from "../assets/denim.png";

const Header = () => {
  const [activeBrand, setActiveBrand] = useState(null);

  const brands = [
    {
      name: "CHANEL",
      image: brand1,
      items: ["Women", "Men", "Shoes", "Bags", "Accessories"],
    },
    {
      name: "LOUIS VUITTON",
      image: brand2,
      items: ["Women", "Men", "Bags", "Shoes", "Accessories"],
    },
    {
      name: "PRADA",
      image: brand3,
      items: ["Women", "Men", "Shoes", "Bags", "Beauty"],
    },
    {
      name: "CALVIN KLEIN",
      image: brand4,
      items: ["Women", "Men", "Underwear", "Shoes", "Accessories"],
    },
    {
      name: "DENIM",
      image: brand5,
      items: ["Jeans", "Jackets", "Shirts", "T-Shirts", "Women", "Men"],
    },
  ];

  const handleBrandClick = (brandName) => {
    setActiveBrand(activeBrand === brandName ? null : brandName);
  };

  return (
    <div className="header-wrapper">
      {/* ================= HERO SECTION ================= */}

      <div className="container">
        <div className="container1">
          <div className="boy1">
            <img
              src={firstImg}
              className="profile-image1"
              alt="Fashion model"
            />
          </div>
        </div>

        <div className="container2">
          <div className="image">
            <img
              src={secondImg}
              className="second-image"
              alt="Fashion collection"
            />
          </div>

          <div className="text-container">
            <div className="text-center">ULTIMATE</div>

            <div className="text-sale">
              <img src={saleImg} alt="Sale" />
            </div>

            <div className="text-new">
              <span>NEW COLLECTION</span>
            </div>

            <div className="shop-btn">
              <button className="shop">SHOP NOW</button>
            </div>
          </div>

          <div className="img4">
            <img src={fourthImg} alt="New fashion collection" />
          </div>
        </div>

        <div className="container3">
          <div className="boy5">
            <img
              src={fifthImg}
              className="profile-image2"
              alt="Fashion model"
            />
          </div>
        </div>
      </div>

      {/* ================= BRAND SECTION ================= */}

      <div className="brand-section">
        <div className="brand-container">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className={`brand-item ${
                activeBrand === brand.name ? "active-brand" : ""
              }`}
              onClick={() => handleBrandClick(brand.name)}
            >
              <img src={brand.image} alt={brand.name} className="brand-image" />
            </div>
          ))}
        </div>

        {/* ================= BRAND NAVBAR ================= */}

        {activeBrand && (
          <div className="brand-navbar">
            <div className="brand-navbar-inner">
              <div className="brand-navbar-title">{activeBrand}</div>

              <div className="brand-navbar-links">
                {brands
                  .find((brand) => brand.name === activeBrand)
                  ?.items.map((item) => (
                    <a
                      href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                      key={item}
                    >
                      {item}
                    </a>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
