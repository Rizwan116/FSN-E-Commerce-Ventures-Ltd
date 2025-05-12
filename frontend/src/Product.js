import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

function Product() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoomed, setZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null); // Simulated user state (auth not handled here)

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
        const res = await axios.get(`/api/products/${productId}`);
        setProduct(res.data.product); // Assuming res.data contains a product object
        setQuantity(1);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/api/products/${productId}/reviews`);
        setReviews(res.data.reviews.length > 0 ? res.data.reviews : dummyReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews(dummyReviews);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleReviewSubmit = async (review) => {
    if (!user) return navigate("/signup");
    try {
      await axios.post(`/api/products/${productId}/reviews`, review);
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
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
    };

    console.log("Item added to cart:", cartItem);
    alert(`Added ${quantity} ${product.name} to your cart!`);
  };

  const handleIncreaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      alert("Cannot add more, stock is insufficient!");
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) return <div>Loading product...</div>;
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
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>← Back</button>
      <h1>{product.name}</h1>

      {/* Image Slider */}
      <div className="image-slider-container" style={{ maxWidth: "400px", position: "relative" }}>
        <Swiper spaceBetween={10} slidesPerView={1} navigation modules={[Navigation]}>
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`Slide ${index}`}
                style={{
                  width: "100%",
                  height: "auto",
                  transform: zoomed ? "scale(1.5)" : "scale(1)",
                  transition: "transform 0.3s",
                  cursor: "zoom-in",
                }}
                onClick={() => setZoomed(!zoomed)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          onClick={() => setZoomed(!zoomed)}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "#000",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: "4px",
            zIndex: 1,
          }}
        >
          {zoomed ? "Zoom Out" : "Zoom In"}
        </button>
      </div>

      <h4><strong>Price:</strong> ₹{product.price}</h4>
      <h4><strong>Description:</strong> {product.description || "No description provided."}</h4>
      <h4><strong>Stock:</strong> {product.stock}</h4>

      <div style={{ margin: "10px 0" }}>
        <button onClick={handleDecreaseQuantity} disabled={quantity <= 1}>-</button>
        <span style={{ margin: "0 10px" }}>{quantity}</span>
        <button onClick={handleIncreaseQuantity} disabled={quantity >= product.stock}>+</button>
        <button onClick={handleAddToCart} style={{ marginLeft: "10px" }}>Add to Cart</button>
      </div>

      {product.ingredients && (
        <button onClick={() => alert(product.ingredients.join(", "))}>View Ingredients</button>
      )}

      {product.howToUse && (
        <div>
          <h3>How to Use</h3>
          <h1>{product.howToUse}</h1>
        </div>
      )}

      <div>
        <h3>Reviews</h3>
        {reviews.map((r, idx) => (
          <div key={idx} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
            <strong>{r.username}</strong> <strong>({r.category})</strong> - <strong>{r.date}</strong>
            <div>{"★".repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
            <h5>{r.comment}</h5>
          </div>
        ))}
        <button onClick={() => user ? alert("Show Review Form") : navigate("/signup")}>Write a Review</button>
      </div>
    </div>
  );
}

export default Product;
