import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import zoomIcon from "../src/assets/zoomiconpng.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Redux imports
import { useDispatch } from "react-redux";
import { addToCart } from "./redux/cartSlice";

function Product() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    category: "quality",
    stars: 5,
    description: "",
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        const res = await axios.get(`http://localhost:5000/api/products/getProduct/${productId}`);
        setProduct(res.data.product || res.data);
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
        setReviews(res.data.reviews.length > 0 ? res.data.reviews : dummyReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews(dummyReviews);
      }
    };
    fetchReviews();
  }, [productId]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    setReviewData((prev) => ({
      ...prev,
      images: [...e.target.files],
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("userId", user.id);
      formData.append("category", reviewData.category);
      formData.append("stars", reviewData.stars);
      formData.append("description", reviewData.description);

      reviewData.images.forEach((image) => {
        formData.append("images", image);
      });

      await axios.post(`http://localhost:5000/api/reviews`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const res = await axios.get(`http://localhost:5000/api/reviews/${productId}`);
      setReviews(res.data.reviews.length > 0 ? res.data.reviews : dummyReviews);

      setReviewData({
        category: "quality",
        stars: 5,
        description: "",
        images: [],
      });
      setShowReviewForm(false);
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) {
      toast.error("Product information is not available!");
      return;
    }

    if (quantity <= 0 || isNaN(quantity)) {
      toast.error("Please select a valid quantity!");
      return;
    }

    if (product.stock !== undefined && product.stock < quantity) {
      toast.error(`Not enough stock available! Only ${product.stock} items left.`);
      return;
    }

    // Dispatch addToCart Redux action
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        image: images[0],
        quantity: quantity,
      })
    );

    toast.success(`Added ${quantity} ${product.name} to your cart!`);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    if (product && product.stock !== undefined) {
      setQuantity((prev) => Math.min(product.stock, prev + 1));
    } else {
      setQuantity((prev) => prev + 1);
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
    <div
      className="product-detail-page"
      style={{ padding: "130px 20px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ← Back
      </button>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
        {/* Image slider */}
        <div
          className="image-slider-container"
          style={{ flex: "1", minWidth: "300px", maxWidth: "500px", position: "relative" }}
        >
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
                    width: "100%",
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
              top: 10,
              right: 10,
              background: "#000",
              color: "#fff",
              padding: "7px 10px",
              borderRadius: "46px",
              zIndex: 1,
              border: "none",
              cursor: "pointer",
            }}
          >
            <img src={zoomIcon} style={{ width: "20px", height: "20px" }} alt="Zoom Icon" />
          </button>
        </div>

        {/* Product details */}
        <div style={{ flex: "1", minWidth: "300px" }}>
          <h1 style={{ fontSize: "28px", marginBottom: "15px" }}>{product.name}</h1>
          <h4 style={{ fontSize: "22px", marginBottom: "15px" }}>
            <strong>Price:</strong> ₹{product.price}
          </h4>
          <h4 style={{ marginBottom: "20px" }}>
            <strong>Description:</strong> {product.description || "No description provided."}
          </h4>

          <div style={{ margin: "20px 0" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
              <button
                onClick={handleDecreaseQuantity}
                disabled={quantity <= 1}
                style={{
                  fontSize: "20px",
                  padding: "5px 12px",
                  marginRight: "10px",
                  cursor: quantity > 1 ? "pointer" : "not-allowed",
                }}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                min={1}
                max={product.stock || 1000}
                onChange={(e) => {
                  const val = Math.max(1, Math.min(product.stock || 1000, Number(e.target.value)));
                  setQuantity(val);
                }}
                style={{ width: "60px", textAlign: "center", fontSize: "16px" }}
                aria-label="Product quantity"
              />
              <button
                onClick={handleIncreaseQuantity}
                disabled={product.stock !== undefined && quantity >= product.stock}
                style={{
                  fontSize: "20px",
                  padding: "5px 12px",
                  marginLeft: "10px",
                  cursor: product.stock !== undefined && quantity >= product.stock ? "not-allowed" : "pointer",
                }}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "10px 20px",
                fontSize: "18px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Zoomed Image Modal */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "zoom-out",
            zIndex: 1000,
          }}
          aria-label="Close zoomed image"
        >
          <img
            src={zoomedImage}
            alt="Zoomed product"
            style={{ maxHeight: "90vh", maxWidth: "90vw", borderRadius: "10px" }}
          />
        </div>
      )}

      {/* Reviews Section */}
      <section style={{ marginTop: "60px" }}>
        <h2>Reviews</h2>
        {reviews.length === 0 && <p>No reviews yet. Be the first to review!</p>}

        {reviews.map((review, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <img
                src={review.image || "https://via.placeholder.com/50"}
                alt={`${review.username} avatar`}
                style={{ borderRadius: "50%", width: "50px", height: "50px", marginRight: "15px" }}
              />
              <div>
                <strong>{review.username}</strong> <br />
                <small>{new Date(review.date).toLocaleDateString()}</small>
              </div>
            </div>
            <p>
              <strong>Category:</strong> {review.category}
            </p>
            <p>
              <strong>Rating:</strong> {Array(review.stars).fill("⭐").join("")}
            </p>
            <p>{review.comment || review.description}</p>
            {review.images && review.images.length > 0 && (
              <div style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
                {review.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Review image ${i + 1}`}
                    style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Review submission form */}
        {user ? (
          <>
            {!showReviewForm ? (
              <button
                onClick={() => setShowReviewForm(true)}
                style={{
                  marginTop: "20px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  padding: "10px 20px",
                  fontSize: "16px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Write a Review
              </button>
            ) : (
              <form
                onSubmit={handleReviewSubmit}
                style={{
                  marginTop: "20px",
                  border: "1px solid #ccc",
                  padding: "20px",
                  borderRadius: "8px",
                  maxWidth: "600px",
                }}
              >
                <div style={{ marginBottom: "15px" }}>
                  <label>
                    Category:
                    <select
                      name="category"
                      value={reviewData.category}
                      onChange={handleReviewChange}
                      required
                      style={{ marginLeft: "10px" }}
                    >
                      <option value="quality">Quality</option>
                      <option value="price">Price</option>
                      <option value="delivery">Delivery</option>
                      <option value="service">Service</option>
                    </select>
                  </label>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label>
                    Rating:
                    <select
                      name="stars"
                      value={reviewData.stars}
                      onChange={handleReviewChange}
                      required
                      style={{ marginLeft: "10px" }}
                    >
                      {[5, 4, 3, 2, 1].map((star) => (
                        <option key={star} value={star}>
                          {star} Star{star > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label>
                    Review:
                    <textarea
                      name="description"
                      value={reviewData.description}
                      onChange={handleReviewChange}
                      required
                      rows={4}
                      style={{ width: "100%", marginTop: "5px" }}
                      placeholder="Write your review here..."
                    />
                  </label>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label>
                    Upload Images:
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: "block", marginTop: "5px" }}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: isSubmitting ? "#6c757d" : "#007bff",
                    color: "#fff",
                    padding: "10px 20px",
                    fontSize: "16px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  style={{
                    marginLeft: "15px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    padding: "10px 20px",
                    fontSize: "16px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </form>
            )}
          </>
        ) : (
          <p style={{ marginTop: "20px" }}>
            Please <button onClick={() => navigate("/login")} style={{ color: "blue", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>login</button> to write a review.
          </p>
        )}
      </section>
    </div>
  );
}

export default Product;
