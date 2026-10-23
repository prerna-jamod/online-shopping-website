import React, { useEffect, useState } from "react";
import "./Deals.css";

import Img1 from "../assets/slide1.png";
import Img2 from "../assets/slide3.png";
import Img3 from "../assets/slide2.png";

const slides = [Img1, Img2, Img3];

const Deals = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 23,
    minutes: 19,
    seconds: 40,
  });

  /* COUNTDOWN */

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
          clearInterval(timer);
          return prev;
        }

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;

          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;

            if (hours > 0) {
              hours--;
            } else {
              hours = 23;

              if (days > 0) {
                days--;
              }
            }
          }
        }

        return {
          days,
          hours,
          minutes,
          seconds,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* AUTO SLIDER */

  useEffect(() => {
    const sliderTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(sliderTimer);
  }, []);

  /* NEXT */

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  /* PREVIOUS */

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  /* BUY */

  const handleBuyNow = () => {
    alert("Product added! Continue to checkout.");
  };

  /* SLIDE POSITION */

  const getSlideClass = (index) => {
    const position = (index - currentSlide + slides.length) % slides.length;

    if (position === 0) {
      return "creative-slide slide-big";
    }

    if (position === 1) {
      return "creative-slide slide-medium";
    }

    return "creative-slide slide-small";
  };

  return (
    <section className="deals-container">
      {/* LEFT */}

      <div className="deals-content">
        <h1 className="deal-heading">Deals Of The Month</h1>

        <p className="deal-para">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque
          duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices
          sollicitudin.
        </p>

        <button className="buy-btn" onClick={handleBuyNow}>
          Buy Now
        </button>

        <div className="timer-section">
          <h2>Hurry, Before It's Too Late!</h2>

          <div className="countdown">
            <div className="time-box">
              <span>{String(timeLeft.days).padStart(2, "0")}</span>
              <small>Days</small>
            </div>

            <div className="colon">:</div>

            <div className="time-box">
              <span>{String(timeLeft.hours).padStart(2, "0")}</span>
              <small>Hr</small>
            </div>

            <div className="colon">:</div>

            <div className="time-box">
              <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
              <small>Mins</small>
            </div>

            <div className="colon">:</div>

            <div className="time-box">
              <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
              <small>Sec</small>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SLIDER */}

      <div className="slides-section">
        <div className="creative-slider">
          {slides.map((image, index) => {
            const slideClass = getSlideClass(index);
            return (
              <div key={index} className={slideClass}>
                <img src={image} alt={`Fashion slide ${index + 1}`} />

                <div className="offer-box">
                  <div className="offer-top">
                    <span>01</span>

                    <span className="offer-line"></span>

                    <span>Spring Sale</span>
                  </div>

                  <div className="offer-discount">30% OFF</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="slider-arrows">
          <button className="arrow-btn" onClick={prevSlide}>
            ←
          </button>

          <button className="arrow-btn" onClick={nextSlide}>
            →
          </button>
        </div>

        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={currentSlide === index ? "dot active-dot" : "dot"}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Deals;
