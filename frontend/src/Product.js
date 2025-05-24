import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import zoomIcon from "../src/assets/zoomiconpng.png";

function Product() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null); // Simulated user state

  const dummyImages = [
    "https://via.placeholder.com/400x300?text=Image+1",
    "https://via.placeholder.com/400x300?text=Image+2",
    "https://via.placeholder.com/400x300?text=Image+3",
  ];

  const dummyReviews = [
    {
      username: "John Doe",
      category: "Quality",
      stars: 4,
      date: "2025-04-19",
      comment: "Great product, would buy again!",
      image: "https://via.placeholder.com/50",
    },
    {
      username: "Jane Smith",
      category: "Price",
      stars: 5,
      date: "2025-04-18",
      comment: "Excellent value for money.",
      image: "https://via.placeholder.com/50",
    },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(res.data.product);
        setQuantity(1);
      } catch (err) {
        setError("Product not found or server error");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reviews/${productId}`);
        // Assuming PostgreSQL returns array of review objects with these fields
        setReviews(res.data.reviews.length > 0 ? res.data.reviews : dummyReviews);
      } catch (error) {
        console.error("Error fetching reviews from PostgreSQL:", error);
        setReviews(dummyReviews);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleReviewSubmit = async (review) => {
    if (!user) return navigate("/signup");
    try {
      await axios.post(`http://localhost:5000/api/reviews/${productId}`, review);
      alert("Review submitted!");
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const handleAddToCart = () => {
    if (product.stock < quantity) {
      alert("Not enough stock available!");
      return;
    }

    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
    };

    console.log("Item added to cart:", cartItem);
    alert(`Added ${quantity} ${product.name} to your cart!`);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) return <div>Loading product...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found.</div>;

  let images = [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    images = product.images;
  } else if (product.image) {
    images = [product.image];
  } else {
    images = dummyImages;
  }

  return (
    <div className="product-detail-page" style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ← Back
      </button>

      <div className="image-slider-container" style={{ maxWidth: "400px", position: "relative", textAlign: "center" }}>
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`Slide ${index}`}
                style={{
                  width: "50%",
                  height: "auto",
                  cursor: "zoom-in",
                  borderRadius: "5px",
                }}
                onClick={() => setZoomedImage(img)}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          onClick={() => setZoomedImage(images[0])}
          style={{
            position: "absolute",
            top: -15,
            right: 10,
            background: "#000",
            color: "#fff",
            padding: "7px 10px",
            borderRadius: "46px",
            zIndex: 1,
          }}
        >
          <img src={zoomIcon} style={{ width: "20px", height: "20px" }} alt="Zoom Icon" />
        </button>
      </div>

      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            cursor: "zoom-out",
          }}
        >
          <img
            src={zoomedImage}
            alt="Zoomed"
            style={{
              maxHeight: "90vh",
              maxWidth: "90vw",
              borderRadius: "10px",
            }}
          />
        </div>
      )}

      <h1>{product.name}</h1>
      <h4><strong>Price:</strong> ₹{product.price}</h4>
      <h4><strong>Description:</strong> {product.description || "No description provided."}</h4>

      <div style={{ margin: "10px 0" }}>
        <button onClick={handleDecreaseQuantity} disabled={quantity <= 1} style={{ background: "transparent", borderRadius: "0 !important", borderColor: "#000", color: "#000", fontSize: "16px", padding: "5px 18px" }}>
          -
        </button>
        <span style={{ margin: "0 10px" }}>{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          disabled={quantity >= product.stock}
          style={{ background: "transparent", borderRadius: "0 !important", borderColor: "#000", color: "#000", fontSize: "16px", padding: "5px 18px" }}
        >
          +
        </button>
        <button onClick={handleAddToCart} style={{ marginLeft: "10px", background: "transparent", borderRadius: "0 !important", borderColor: "#000", color: "#000", fontSize: "16px", padding: "7px 57px" }}>
          Add to Cart
        </button>
      </div>

      {product.ingredients && (
        <button onClick={() => alert(product.ingredients.join(", "))}>View Ingredients</button>
      )}

      {product.howToUse && (
        <div>
          <h3>How to Use</h3>
          <p>{product.howToUse}</p>
        </div>
      )}

      <div style={{ marginTop: "50px" }}>
        <h3>Reviews</h3>
        {reviews.map((r, idx) => (
          <div key={idx} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
            <strong>{r.username}</strong> <strong>({r.category})</strong> - <strong>{r.date}</strong>
            <div>{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</div>
            <h5>{r.comment}</h5>
          </div>
        ))}
        <button onClick={() => (user ? alert("Show Review Form") : navigate("/login"))} style={{ background: "transparent", borderRadius: "0 !important", borderColor: "#000", color: "#000", fontSize: "16px", padding: "7px 57px" }}>
          Write a Review
        </button>
      </div>
    </div>

    
  );
}

export default Product;
