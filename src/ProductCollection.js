import React, { useState, useEffect, useRef, useCallback } from "react";
import { database, ref, get, child, set } from "./firebase";
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
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.items || []);

  const [allProducts, setAllProducts] = useState([]);
  const [ratings, setRatings] = useState({});
  const [isUpdatingStock, setIsUpdatingStock] = useState({});
  const swiperRef = useRef(null);

  // Create a memoized function to fetch products
  const fetchProducts = useCallback(async () => {
    try {
      const dbRef = ref(database);
      const products = {};

      // Fetch from "products"
      const newSnap = await get(child(dbRef, "products"));
      if (newSnap.exists()) {
        const data = newSnap.val();
        Object.keys(data).forEach((key) => {
          products[key] = { ...data[key], id: key };
        });
      }

      // Fetch from "product"
      const oldSnap = await get(child(dbRef, "product"));
      if (oldSnap.exists()) {
        const data = oldSnap.val();
        Object.keys(data).forEach((key) => {
          products[key] = { ...data[key], id: key };
        });
      }

      setAllProducts(Object.values(products));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, []);

  useEffect(() => {
    // Fetch products when component mounts or when returning to this page
    fetchProducts();
    
    // Set up an interval to refresh product data periodically (every 10 seconds)
    const intervalId = setInterval(fetchProducts, 10000);
    
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchProducts, location.key]);

  const handleRating = useCallback((productId, value) => {
    setRatings((prev) => ({
      ...prev,
      [productId]: value,
    }));
  }, []);

  // Helper function to get quantity in cart
  const getQuantityInCart = useCallback((productId) => {
    return cartItems.find((item) => item.id === productId)?.quantity || 0;
  }, [cartItems]);

  const handleAddToCart = useCallback(async (product) => {
    const quantityInCart = getQuantityInCart(product.id);
    const stock = typeof product.stock === 'number' ? product.stock : 0;
    
    if (stock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    if (quantityInCart >= stock) {
      alert("You've reached the maximum stock limit for this product.");
      return;
    }

    setIsUpdatingStock((prev) => ({ ...prev, [product.id]: true }));

    try {
      // First update the stock in Firebase
      const newStock = stock - 1;
      await set(ref(database, `products/${product.id}/stock`), newStock);
      
      // Then dispatch to Redux
      dispatch(
        addToCart({
          id: product.id,
          title: product.name,
          price: product.price,
          image: product.image,
          stock: newStock,
        })
      );
      
      // Refresh products to get the latest stock
      await fetchProducts();
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Failed to update product stock. Please try again.");
    } finally {
      setIsUpdatingStock((prev) => ({ ...prev, [product.id]: false }));
    }
  }, [dispatch, fetchProducts, getQuantityInCart]);

  // Memoized product card renderer
  const renderProductCard = useCallback((product) => {
    const quantityInCart = getQuantityInCart(product.id);
    const stock = typeof product.stock === 'number' ? product.stock : 0;
    const isOutOfStock = stock <= 0;
    const isStockExceeded = quantityInCart >= stock;
    const isLoading = isUpdatingStock[product.id];

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
          {/* {stock > 0 && (
            <p className="stock-status">
              {stock - quantityInCart} available
            </p>
          )} */}
          <button
            className={`view-product-btn ${isOutOfStock || isStockExceeded ? "sold-out" : ""}`}
            onClick={() => handleAddToCart(product)}
            disabled={isOutOfStock || isStockExceeded || isLoading}
          >
            {isLoading ? "UPDATING..." : 
             isOutOfStock ? "SOLD OUT" : 
             isStockExceeded ? "MAX REACHED" : "ADD TO CART"}
          </button>
        </div>
      </SwiperSlide>
    );
  }, [getQuantityInCart, handleAddToCart, handleRating, isUpdatingStock, ratings]);

  return (
    <>
      <div className="product-collection-section">
        <h2>BESTSELLER</h2>
        <div className="product-collection-main">
          <button className="slider-arrow-left" onClick={() => swiperRef.current?.slidePrev()}>←</button>

          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            spaceBetween={20}
            slidesPerView={1}
            navigation={false}
            modules={[Navigation]}
            grabCursor={true}
          >
            {allProducts.map((product) => renderProductCard(product))}
          </Swiper>

          <button className="slider-arrow-right" onClick={() => swiperRef.current?.slideNext()}>→</button>
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
          const section = document.querySelector(".product-collection-section");
          if (section) section.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </>
  );
}

export default React.memo(ProductCollection);