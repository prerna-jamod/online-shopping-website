import React from "react";
import "./Footer.css";

import boyImg from "../assets/yellowboy.png";
import girlImg from "../assets/graygirl.png";

const Footer = () => {
  return (
    <div className="footer-main">
      {/* Newsletter Section */}
      <div className="all-container">
        {/* Left Image */}
        <div className="Img1-container">
          <img src={boyImg} alt="Fashion model" />
        </div>

        {/* Center Content */}
        <div className="content-container">
          <h1 className="subscribe-logo">SUBSCRIBE TO OUR NEWSLETTER</h1>

          <p className="centerpara">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque
            duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices
            sollicitudin.
          </p>

          <h3 className="email-text">michael@ymail.com</h3>

          <button className="btn-style">Subscribe Now</button>
        </div>

        {/* Right Image */}
        <div className="Img2-container">
          <img src={girlImg} alt="Fashion model" />
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-container">
        <div className="logo-style">FASCO</div>

        <div className="footer-names">
          <a href="#support" className="supportC">
            Support Center
          </a>

          <a href="#invoicing" className="inovoice">
            Invoicing
          </a>

          <a href="#contract" className="contract">
            Contract
          </a>

          <a href="#careers" className="career">
            Careers
          </a>

          <a href="#blog" className="blog">
            Blog
          </a>

          <a href="#faq" className="faq">
            FAQs
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
