import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Import product images
import cleanserImage from "./assets/product.png";
import tonerImage from "./assets/product.png";
import serumImage from "./assets/product.png";
import moisturizerImage from "./assets/product.png";
import sunscreenImage from "./assets/product.png";

// Product Data
const allProducts = [
  { id: 1, name: "Good Grease", category: "Cleanser", image: cleanserImage },
  { id: 2, name: "Good Grease 1", category: "Cleanser", image: sunscreenImage },
  { id: 3, name: "Good Grease 2", category: "Cleanser", image: sunscreenImage },
  { id: 4, name: "Inbalance 1", category: "Toner", image: tonerImage },
  { id: 5, name: "In My Defence 2", category: "Toner", image: moisturizerImage },
  { id: 6, name: "Sun Shield 3", category: "Toner", image: sunscreenImage },
  { id: 7, name: "Hustle 4", category: "Serum", image: serumImage },
  { id: 8, name: "Sun Shield 5", category: "Serum", image: sunscreenImage },
  { id: 9, name: "Hustle 6", category: "Serum", image: serumImage },
  { id: 10, name: "Sun Shield 7", category: "Moisturizer", image: sunscreenImage },
  { id: 11, name: "Hustle 8", category: "Moisturizer", image: serumImage },
  { id: 12, name: "Sun Shield 9", category: "Sunscreen", image: sunscreenImage },
  { id: 13, name: "Out of Stock", category: "Sunscreen", image: null }, // Example of sold-out product
];

// Categories
const categories = ["Cleanser", "Toner", "Serum", "Moisturizer", "Sunscreen"];

function ProductCollection() {
  const [selectedCategory, setSelectedCategory] = useState("Cleanser");
  const swiperRef = useRef(null);

  // Left Arrow Click
  const slidePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  // Right Arrow Click
  const slideNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  // Handle Category Click: Scroll to that category but don't hide others
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    const categoryIndex = allProducts.findIndex((product) => product.category === category);
    if (swiperRef.current && categoryIndex !== -1) {
      swiperRef.current.slideTo(categoryIndex);
    }
  };

  return (
    <div className="product-collection-section">
      <h2>Daily Routine</h2>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map((category) => (
          <button
            key={category}
            className={category === selectedCategory ? "active" : ""}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Slider */}
      <div className="product-collection-main">
        <button className="slider-arrow-left" onClick={slidePrev}>&#60;</button>

        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          spaceBetween={20}
          slidesPerView={4}
          navigation={false} // Custom buttons used instead
          modules={[Navigation]}
          grabCursor={true} // Enables mouse drag/swipe
        >
          {allProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="product-card">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="sold-out-placeholder">No Image Available</div>
                )}
                <h1>{product.name}</h1>
                <h3>{product.category}</h3>
                <button className="view-product-btn">
                  {product.image ? "VIEW PRODUCT" : "SOLD OUT"}
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="slider-arrow-right" onClick={slideNext}>  &#62;</button>
      </div>
    </div>
  );
}

export default ProductCollection;
