import React, { useState, useEffect, useRef, useCallback } from "react";
import { database, ref, update } from "./firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Banner from "./Banner";
import productBanner from "./assets/Asset1.jpg";
import productBanner2 from "./assets/Asset11.jpg";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "./redux/cartSlice";
import { useLocation, Link } from "react-router-dom";
import OurStory from "./OurStory";

function ProductCollection() {
  const dispatch = useDispatch();
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.items || []);

  const [allProducts, setAllProducts] = useState([]);
  const [ratings, setRatings] = useState({});
  const [isUpdatingStock, setIsUpdatingStock] = useState({});
  const swiperRef = useRef(null);

  // Fetch products from backend
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();

      const formattedProducts = data.products.map((product) => ({
        ...product,
        id: product.id?.toString(),
      }));

      setAllProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setAllProducts([]);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    const intervalId = setInterval(fetchProducts, 10000);
    return () => clearInterval(intervalId);
  }, [fetchProducts, location.key]);

  const handleRating = useCallback((productId, value) => {
    setRatings((prev) => ({ ...prev, [productId]: value }));
  }, []);

  const getQuantityInCart = useCallback(
    (productId) =>
      cartItems.find((item) => item.id === productId)?.quantity || 0,
    [cartItems]
  );

const handleAddToCart = useCallback(
  async (product) => {
    const quantityInCart = getQuantityInCart(product.id);

    if (!product.is_available) {
      return alert("This product is currently unavailable.");
    }

    // Optional: Limit cart quantity to 1 if no stock is known
    if (quantityInCart > 0) {
      return alert("You've already added this item.");
    }

    try {
      dispatch(
        addToCart({
          id: product.id,
          title: product.name,
          price: product.price,
          image: product.image,
        })
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product. Try again.");
    }
  },
  [dispatch, getQuantityInCart]
);

  const renderProductCard = useCallback(
    (product) => {
      const quantityInCart = getQuantityInCart(product.id);
      const isUnavailable = !product.is_available;
      const isAlreadyInCart = quantityInCart > 0;
      const isLoading = isUpdatingStock[product.id]; 

      return (
        <SwiperSlide key={product.id}>
          <div className="product-card">
            <Link to={`/product/${product.id}`}>
              <img src={product.image} alt={product.name} />
              <h1>{product.name}</h1>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${
                      ratings[product.id] >= star ? "filled" : ""
                    }`}
                    onClick={() => handleRating(product.id, star)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <h3>₹{product.price}</h3>
            </Link>

           <button
          className={`view-product-btn ${
            isUnavailable || isAlreadyInCart ? "sold-out" : ""
          }`}
          onClick={() => handleAddToCart(product)}
          disabled={isUnavailable || isAlreadyInCart}
        >
          {isUnavailable
            ? "SOLD OUT"
            : isAlreadyInCart
            ? "IN CART"
            : "ADD TO CART"}
        </button>
          </div>
        </SwiperSlide>
      );
    },
    [getQuantityInCart, handleAddToCart, handleRating, isUpdatingStock, ratings]
  );

  return (
    <>
      <div className="product-collection-section">
        <h2>BESTSELLER</h2>
        <div className="product-collection-main">
          <button
            className="slider-arrow-left"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            ←
          </button>

          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            spaceBetween={20}
            slidesPerView={1}
            navigation={false}
            modules={[Navigation]}
            grabCursor={true}
          >
            {allProducts.length === 0 ? (
              <p>No products found</p>
            ) : (
              allProducts.map((product) => renderProductCard(product))
            )}
          </Swiper>

          <button
            className="slider-arrow-right"
            onClick={() => swiperRef.current?.slideNext()}
          >
            →
          </button>
        </div>
      </div>

      <OurStory />

      <Banner
        image={productBanner}
        text="Cleansing Bar"
        ctaText="SHOP NOW"
        onCtaClick={() => {
          const section = document.querySelector(".product-collection-section");
          section?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <Banner
        image={productBanner2}
        text="Blissful Aromas"
        ctaText="SHOP NOW"
        onCtaClick={() => {
          const section = document.querySelector(".product-collection-section");
          section?.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </>
  );
}

export default React.memo(ProductCollection);
