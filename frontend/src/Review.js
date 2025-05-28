import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Review() {
  const { productId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:5000/api/products/${productId}/reviews`,
        {
          headers: {
            Authorization: user?.token ? `Bearer ${user.token}` : undefined,
          },
        }
      );

      let reviewsData = response.data;
      if (response.data.reviews) {
        reviewsData = response.data.reviews;
      } else if (Array.isArray(response.data)) {
        reviewsData = response.data;
      } else {
        reviewsData = [response.data];
      }

      const formattedReviews = reviewsData.map((review) => {
        let userName = "Anonymous";
        let userAvatar = "https://via.placeholder.com/50";

        if (review.user) {
          userName = review.user.name ||
            `${review.user.firstname || ''} ${review.user.lastname || ''}`.trim() ||
            "Anonymous";
          userAvatar = review.user.avatar ||
            review.user.profileImage ||
            "https://via.placeholder.com/50";
        } else if (review.user_id) {
          userName = `User ${review.user_id}`;
        }

        return {
          id: review._id || review.id,
          product_id: review.product || review.product_id || productId,
          user: {
            id: review.user?._id || review.user?.id || review.user_id,
            name: userName,
            avatar: userAvatar,
          },
          rating: review.rating || 5,
          comment: review.comment || "No comment provided",
          createdAt: review.createdAt || review.created_at || new Date().toISOString(),
          updatedAt: review.updatedAt || review.updated_at || new Date().toISOString(),
        };
      });

      setReviews(formattedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to load reviews. Please try again later.");
      toast.error("Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/products/${productId}/reviews`,
        {
          product: productId,
          rating: reviewData.rating,
          comment: reviewData.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && (response.data._id || response.data.id)) {
        await fetchReviews();
        setReviewData({ rating: 5, comment: "" });
        setShowReviewForm(false);
        toast.success("Review submitted successfully!");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      let errorMessage = "Failed to submit review. Please try again.";
      if (error.response?.data) {
        errorMessage = error.response.data.message ||
          error.response.data.error?.message ||
          (error.response.data.errors ?
            Object.values(error.response.data.errors).join(", ") :
            "Failed to submit review");
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "130px 20px", textAlign: "center" }}>Loading reviews...</div>;
  }

  return (
    <div style={{ padding: "130px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <section style={{ marginTop: "60px" }}>
        <h2>Customer Reviews</h2>

        {error ? (
          <div style={{
            padding: "20px",
            backgroundColor: "#fff3f3",
            border: "1px solid #ffcccc",
            borderRadius: "4px",
            marginBottom: "20px"
          }}>
            <p style={{ color: "#d32f2f" }}>{error}</p>
            <button
              onClick={fetchReviews}
              style={{
                backgroundColor: "#1976d2",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "10px"
              }}
            >
              Retry Loading Reviews
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <img
                  src={review.user.avatar}
                  alt={`${review.user.name} avatar`}
                  style={{
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    marginRight: "15px",
                    objectFit: "cover"
                  }}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/50"; }}
                />
                <div>
                  <strong>{review.user.name}</strong>
                  <div style={{ color: "#666", fontSize: "0.9rem" }}>
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <div style={{ margin: "10px 0", fontSize: "1.2rem" }}>
                {Array(5).fill().map((_, i) => (
                  <span key={i} style={{
                    color: i < review.rating ? "#ffc107" : "#e4e5e9",
                    marginRight: "2px"
                  }}>★</span>
                ))}
                <span style={{ marginLeft: "8px", fontSize: "0.9rem", color: "#666" }}>
                  ({review.rating.toFixed(1)})
                </span>
              </div>

              <p style={{
                margin: "10px 0",
                whiteSpace: "pre-wrap",
                lineHeight: "1.6"
              }}>
                {review.comment}
              </p>
            </div>
          ))
        )}

        {user && (
          <>
            {!showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                style={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "20px"
                }}
              >
                Write a Review
              </button>
            )}

            {showReviewForm && (
              <form
                onSubmit={handleReviewSubmit}
                style={{
                  marginTop: "30px",
                  border: "1px solid #ddd",
                  padding: "20px",
                  borderRadius: "8px",
                  maxWidth: "600px",
                  backgroundColor: "#f9f9f9"
                }}
              >
                <h3 style={{ marginBottom: "20px" }}>Write Your Review</h3>

                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                    Rating
                  </label>
                  <select
                    name="rating"
                    value={reviewData.rating}
                    onChange={handleReviewChange}
                    required
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "1rem"
                    }}
                  >
                    {[5, 4, 3, 2, 1].map((star) => (
                      <option key={star} value={star}>
                        {star} Star{star > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                    Your Review
                  </label>
                  <textarea
                    name="comment"
                    value={reviewData.comment}
                    onChange={handleReviewChange}
                    required
                    minLength="10"
                    rows={5}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "1rem",
                      resize: "vertical"
                    }}
                    placeholder="Share your experience with this product (minimum 10 characters)..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: "#1976d2",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: isSubmitting ? "not-allowed" : "pointer"
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default Review;
