import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Banner from './Banner';
import productBanner from './assets/Asset1.png';
import { useDispatch } from "react-redux";
import { addToCart } from "./redux/cartSlice"; // Redux action

// Import product images
import cleanserImage from "./assets/product2.png";
import tonerImage from "./assets/product2.png";
import serumImage from "./assets/product2.png";
import moisturizerImage from "./assets/product2.png";
import sunscreenImage from "./assets/product2.png";

// ✅ Product Data with `stock`
const allProducts = [
  { id: 1, name: "Good Grease", category: "Cleanser", price: "$100", image: cleanserImage, inStock: true, stock: 5 },
  { id: 2, name: "Good Grease 1", category: "Cleanser", price: "$100", image: sunscreenImage, inStock: true, stock: 3 },
  { id: 3, name: "Good Grease 2", category: "Cleanser", price: "$100", image: sunscreenImage, inStock: true, stock: 6 },
  { id: 4, name: "Inbalance 1", category: "Toner", price: "$100", image: tonerImage, inStock: true, stock: 8 },
  { id: 5, name: "In My Defence 2", category: "Toner", price: "$100", image: moisturizerImage, inStock: true, stock: 10 },
  { id: 6, name: "Sun Shield 3", category: "Toner", price: "$100", image: sunscreenImage, inStock: true, stock: 4 },
  { id: 7, name: "Hustle 4", category: "Serum", price: "$100", image: serumImage, inStock: true, stock: 6 },
  { id: 8, name: "Sun Shield 5", category: "Serum", price: "$100", image: sunscreenImage, inStock: true, stock: 9 },
  { id: 9, name: "Hustle 6", category: "Serum", price: "$100", image: serumImage, inStock: true, stock: 2 },
  { id: 10, name: "Sun Shield 7", category: "Moisturizer", price: "$100", image: sunscreenImage, inStock: true, stock: 7 },
  { id: 11, name: "Hustle 8", category: "Moisturizer", price: "$100", image: serumImage, inStock: true, stock: 3 },
  { id: 12, name: "Sun Shield 9", category: "Sunscreen", price: "$100", image: sunscreenImage, inStock: true, stock: 5 },
  { id: 13, name: "Out of Stock", category: "Sunscreen", price: "$100", image: sunscreenImage, inStock: false, stock: 0 }, // Sold out


];

const categories = ["Cleanser", "Toner", "Serum", "Moisturizer", "Sunscreen"];

function ProductCollection() {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("Cleanser");
  const [ratings, setRatings] = useState({});
  const swiperRef = useRef(null);

  const slidePrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };

  const slideNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    const categoryIndex = allProducts.findIndex((product) => product.category === category);
    if (swiperRef.current && categoryIndex !== -1) {
      swiperRef.current.slideTo(categoryIndex);
    }
  };

  const handleRating = (productId, value) => {
    setRatings((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleAddToCart = (product) => {
    // ✅ Pass required values to Redux
    dispatch(
      addToCart({
        id: product.id,
        title: product.name,
        price: parseFloat(product.price.replace("$", "")),
        image: product.image,
        stock: product.stock, // 👈 Set product stock
      })
    );
  };

  return (
    <>
      <div className="product-collection-section">
        <h2>BESTSELLER</h2>

        {/* Product Slider */}
        <div className="product-collection-main">
          <button className="slider-arrow-left" onClick={slidePrev}>←</button>

          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            spaceBetween={20}
            slidesPerView={1}
            navigation={false}
            modules={[Navigation]}
            grabCursor={true}
          >
            {allProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="product-card">
                  <img src={product.image} alt={product.name} />
                  <h1>{product.name}</h1>

                  {/* ⭐ Star Rating */}
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${ratings[product.id] >= star ? "filled" : ""}`}
                        onClick={() => handleRating(product.id, star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <h3>{product.price}</h3>

                  {/* 🛒 Add to Cart / SOLD OUT */}
                  <button
                    className={`view-product-btn ${!product.inStock ? "sold-out" : ""}`}
                    onClick={() => product.inStock && handleAddToCart(product)}
                    disabled={!product.inStock}
                  >
                    {!product.inStock ? "SOLD OUT" : "ADD TO CART"}
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button className="slider-arrow-right" onClick={slideNext}>→</button>
        </div>
      </div>

      {/* 🔻 Banner Section Below Products */}
      <Banner
        image={productBanner}
        text="Cleansing Bar"
        ctaText="SHOP NOW"
        onCtaClick={() => {
          const section = document.querySelector(".product-collection-section");
          if (section) section.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </>
  );
}

export default ProductCollection;
