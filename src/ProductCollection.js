// ProductCollection.js
import React, { useState, useEffect, useRef } from "react";
import { database, ref, get, child, push, set } from "./firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Banner from "./Banner";
import productBanner from "./assets/Asset1.png";
import productBanner2 from "./assets/Asset11.png";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "./redux/cartSlice";
import { useLocation } from "react-router-dom";
import OurStory from './OurStory';

function ProductCollection() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items || []);
  const location = useLocation();

  const [allProducts, setAllProducts] = useState([]);
  const [ratings, setRatings] = useState({});
  const swiperRef = useRef(null);

  // Create a function to fetch products that we can call when needed
  const fetchProducts = async () => {
    try {
      const dbRef = ref(database);

      // Fetch from "products"
      const newSnap = await get(child(dbRef, "products"));
      let newProducts = [];
      if (newSnap.exists()) {
        const data = newSnap.val();
        newProducts = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
      }

      // Fetch from "product"
      const oldSnap = await get(child(dbRef, "product"));
      let oldProducts = [];
      if (oldSnap.exists()) {
        const data = oldSnap.val();
        oldProducts = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
      }

      setAllProducts([...newProducts, ...oldProducts]);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    // Fetch products when component mounts or when returning to this page
    fetchProducts();
    
    // Set up an interval to refresh product data periodically (every 10 seconds)
    // This is a workaround for not having onValue
    const intervalId = setInterval(fetchProducts, 10000);
    
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [location.key]); // Re-fetch when navigating back to this page

  const slidePrev = () => swiperRef.current?.slidePrev();
  const slideNext = () => swiperRef.current?.slideNext();

  const handleRating = (productId, value) => {
    setRatings((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleAddToCart = (product) => {
    const itemInCart = cartItems.find((item) => item.id === product.id);
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;
    
    // Check if product has stock property and it's a number
    const stock = typeof product.stock === 'number' ? product.stock : 0;
    
    if (stock <= 0) {
      alert("This product is out of stock.");
      return;
    }
  
    if (quantityInCart < stock) {
      dispatch(
        addToCart({
          id: product.id,
          title: product.name,
          price: product.price,
          image: product.image,
          stock: stock,
        })
      );
    } else {
      alert("You've reached the maximum stock limit for this product.");
    }
  };

  // Force refresh products when returning from checkout
  useEffect(() => {
    // Add event listener for page visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchProducts();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <>
    
      <div className="product-collection-section">
        <h2>BESTSELLER</h2>
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
            {allProducts.map((product) => {
              const itemInCart = cartItems.find((item) => item.id === product.id);
              const quantityInCart = itemInCart ? itemInCart.quantity : 0;
              const stock = typeof product.stock === 'number' ? product.stock : 0;
              const isOutOfStock = stock <= 0;
              const isStockExceeded = quantityInCart >= stock;

              return (
                <SwiperSlide key={product.id}>
                  <div className="product-card">
                    <img src={product.image} alt={product.name} />
                    <h1>{product.name}</h1>

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

                    <h3>${product.price}</h3>
                    {stock > 0 && <p className="stock-status" style={{display:`none`}}>{stock} in stock</p>}
                    <button
                      className={`view-product-btn ${isOutOfStock || isStockExceeded ? "sold-out" : ""}`}
                      onClick={() => handleAddToCart(product)}
                      disabled={isOutOfStock || isStockExceeded}
                    >
                      {isOutOfStock || isStockExceeded ? "SOLD OUT" : "ADD TO CART"}
                    </button>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <button className="slider-arrow-right" onClick={slideNext}>→</button>
        </div>
      </div>

      <OurStory />

      <Banner
        image={productBanner}
        text="Cleansing Bar"
        ctaText="SHOP NOW"
        onCtaClick={() => {
          const section = document.querySelector(".product-collection-section");
          if (section) section.scrollIntoView({ behavior: "smooth" });
        }}
      />

    <Banner
        image={productBanner2}
        text="Blissful Aromas"
        ctaText="SHOP NOW"
        onCtaClick={() => {
          const section = document.querySelector(".product-collection-section2");
          if (section) section.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </>
  );
}

export default ProductCollection;