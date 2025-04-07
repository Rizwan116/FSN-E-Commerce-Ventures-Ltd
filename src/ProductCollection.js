// ProductCollection.js
import React, { useState, useEffect, useRef } from "react";
import { database, ref, get, child } from "./firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Banner from "./Banner";
import productBanner from "./assets/Asset1.png";
import { useDispatch, useSelector } from "react-redux"; // ✅ Added useSelector
import { addToCart } from "./redux/cartSlice";

function ProductCollection() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items || []);


  const [allProducts, setAllProducts] = useState([]);
  const [ratings, setRatings] = useState({});
  const swiperRef = useRef(null);

  useEffect(() => {
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

    fetchProducts();
  }, []);

  const slidePrev = () => swiperRef.current?.slidePrev();
  const slideNext = () => swiperRef.current?.slideNext();

  const handleRating = (productId, value) => {
    setRatings((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  // const handleAddToCart = (product) => {
  //   const itemInCart = cartItems.find((item) => item.id === product.id);
  //   const quantityInCart = itemInCart ? itemInCart.quantity : 0;

  //   if (quantityInCart < product.stock) {
  //     dispatch(
  //       addToCart({
  //         id: product.id,
  //         title: product.name,
  //         price: product.price,
  //         image: product.image,
  //         stock: product.stock,
  //       })
  //     );
  //   } else {
  //     alert("Cannot add more than available stock!");
  //   }
  // };

  const handleAddToCart = (product) => {
    const itemInCart = cartItems.find((item) => item.id === product.id);
  
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;
  
    if (quantityInCart < product.stock) {
      dispatch(
        addToCart({
          id: product.id,
          title: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
        })
      );
    } else {
      alert("You’ve reached the maximum stock limit for this product.");
    }
  };


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
              const isStockExceeded = itemInCart && itemInCart.quantity >= product.stock;

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
                    <button
                      className={`view-product-btn ${!product.inStock || isStockExceeded ? "sold-out" : ""}`}
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock || isStockExceeded}
                    >
                      {!product.inStock || isStockExceeded ? "SOLD OUT" : "ADD TO CART"}
                    </button>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <button className="slider-arrow-right" onClick={slideNext}>→</button>
        </div>
      </div>

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
