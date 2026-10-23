import React, { useEffect, useState } from "react";
import "./ImageSlider.css";
import { IoIosArrowBack } from "react-icons/io";

import cardImg1 from "../assets/card1.png";
import cardImg2 from "../assets/card2.png";
import cardImg3 from "../assets/card3.png";

import logo1 from "../assets/logoS.png";
import logo2 from "../assets/logoJ.png";
import logo3 from "../assets/logoM.png";

const cards = [
  {
    image: cardImg1,
    text: "Items that I ordered were the best investment I ever made. I can't say enough about your quality service.",
    logo: logo1,
  },

  {
    image: cardImg2,
    text: "You won't regret it. I would like to personally thank you for your outstanding product. Absolutely wonderful!",
    logo: logo2,
  },

  {
    image: cardImg3,
    text: "Just what I was looking for. Thank you for making it painless, pleasant and most of all hassle free!",
    logo: logo3,
  },
];

const SignIn = () => {
  const [midImage, setMidImage] = useState(0);
  const [animation, setAnimation] = useState("");
  const leftImage = midImage === 0 ? cards.length - 1 : midImage - 1;

  const rightImage = midImage === cards.length - 1 ? 0 : midImage + 1;

  const Increment = () => {
    if (animation) return;

    setAnimation("swipe-next");

    setTimeout(() => {
      setMidImage((prev) => (prev === cards.length - 1 ? 0 : prev + 1));

      setAnimation("");
    }, 800);
  };

  const Decrement = () => {
    if (animation) return;

    setAnimation("swipe-prev");

    setTimeout(() => {
      setMidImage((prev) => (prev === 0 ? cards.length - 1 : prev - 1));

      setAnimation("");
    }, 800);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      Increment();
    }, 1000);

    return () => clearInterval(interval);
  }, [animation]);

  return (
    <div className="ImageSlider">
      <div>
        <h1 className="feedhead">This Is What Our Customers Say</h1>

        <p className="feedpara">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque
          duis
        </p>
      </div>

      <div className="ImageSliderContainer">
        <div className={`Images ${animation}`}>
          <div className="review-card left-container">
            <div className="card-content">
              <img
                src={cards[leftImage].image}
                alt="review"
                className="review-image"
              />

              <div className="review-info">
                <p className="review-text">"{cards[leftImage].text}"</p>

                <div className="stars">★★★★★</div>

                <div className="review-user">
                  <img
                    src={cards[leftImage].logo}
                    alt="logo"
                    className="review-logo"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="review-card middle-container">
            <div className="card-content">
              <img
                src={cards[midImage].image}
                alt="review"
                className="review-image"
              />

              <div className="review-info">
                <p className="review-text">"{cards[midImage].text}"</p>

                <div className="stars">★★★★★</div>

                <div className="review-user">
                  <img
                    src={cards[midImage].logo}
                    alt="logo"
                    className="review-logo"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="review-card right-container">
            <div className="card-content">
              <img
                src={cards[rightImage].image}
                alt="review"
                className="review-image"
              />

              <div className="review-info">
                <p className="review-text">"{cards[rightImage].text}"</p>

                <div className="stars">★★★★★</div>

                <div className="review-user">
                  <img
                    src={cards[rightImage].logo}
                    alt="logo"
                    className="review-logo"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="buttons">
        <button className="leftButton" onClick={Decrement}>
          <IoIosArrowBack />
        </button>

        <button className="rightButton" onClick={Increment}>
          <IoIosArrowBack />
        </button>
      </div>

      <div className="dotsplace">
        {cards.map((_, index) => (
          <div
            key={index}
            className={`dots ${midImage === index ? "activeDot" : ""}`}
            onClick={() => {
              if (index === midImage || animation) {
                return;
              }

              if (index > midImage) {
                Increment();
              } else {
                Decrement();
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SignIn;
