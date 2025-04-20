// // Product.js

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { database, ref, get } from "./firebase";

// function Product() {
//   const { productId } = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const productRef = ref(database, `products/${productId}`);
//         const snapshot = await get(productRef);

//         if (snapshot.exists()) {
//           setProduct(snapshot.val());
//         } else {
//           const altRef = ref(database, `product/${productId}`);
//           const altSnapshot = await get(altRef);

//           if (altSnapshot.exists()) {
//             setProduct(altSnapshot.val());
//           } else {
//             console.log("Product not found.");
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching product:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [productId]);

//   if (loading) return <div>Loading product...</div>;
//   if (!product) return <div>Product not found.</div>;

//   return (
//     <div className="product-detail-page">
//       <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
//         ← Back
//       </button>

//       <h1>{product.name}</h1>
//       <img src={product.image} alt={product.name} width="300" />
//       <h4><strong>Price:</strong> ₹{product.price}</h4>
//       <h4><strong>Description:</strong> {product.description || "No description provided."}</h4>
//       <h4><strong>Stock:</strong> {product.stock}</h4>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, get, push, set, onValue } from "firebase/database";
import { database } from "./firebase";
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
  const [user, setUser] = useState(null); // Simulated user state (auth not included here)

  const dummyImages = [
    "https://via.placeholder.com/400x300?text=Image+1",
    "https://via.placeholder.com/400x300?text=Image+2",
    "https://via.placeholder.com/400x300?text=Image+3",
  ];

  // Dummy review data if no reviews exist
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
        const productRef = ref(database, `products/${productId}`);
        const snapshot = await get(productRef);

        if (snapshot.exists()) {
          setProduct(snapshot.val());
          setQuantity(1); // Reset quantity to 1 when product is loaded
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const reviewsRef = ref(database, `reviews/${productId}`);
    onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const loadedReviews = Object.values(data);

      // If no reviews are found in the DB, use dummy data
      if (loadedReviews.length === 0) {
        setReviews(dummyReviews);
      } else {
        setReviews(loadedReviews);
      }
    });
  }, [productId]);

  const handleReviewSubmit = (review) => {
    if (!user) return navigate("/signup");
    const newReviewRef = push(ref(database, `reviews/${productId}`));
    set(newReviewRef, review);
  };

  const handleAddToCart = () => {
    if (product.stock < quantity) {
      alert("Not enough stock available!");
      return;
    }

    // Simulate adding the product to the cart
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
    };

    // Push the item to the cart (firebase logic or localStorage could be used here)
    console.log("Item added to cart:", cartItem);

    // Do not update stock here, only update it at purchase time

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
            zIndex: 10,
          }}
        >
          {zoomed ? "Zoom Out" : "Zoom In"}
        </button>
      </div>

      {/* Product Details */}
      <h4><strong>Price:</strong> ₹{product.price}</h4>
      <h4><strong>Description:</strong> {product.description || "No description provided."}</h4>
      <h4><strong>Stock:</strong> {product.stock}</h4>

      {/* Quantity & Cart */}
      <div style={{ margin: "10px 0" }}>
        <button onClick={handleDecreaseQuantity} disabled={quantity <= 1}>-</button>
        <span style={{ margin: "0 10px" }}>{quantity}</span>
        <button onClick={handleIncreaseQuantity} disabled={quantity >= product.stock}>+</button>
        <button onClick={handleAddToCart} style={{ marginLeft: "10px" }}>Add to Cart</button>
      </div>

      {/* Ingredients Popup */}
      {product.ingredients && (
        <button onClick={() => alert(product.ingredients.join(", "))}>View Ingredients</button>
      )}

      {/* How to Use */}
      {product.howToUse && (
        <div>
          <h3>How to Use</h3>
          <h1>{product.howToUse}</h1>
        </div>
      )}

      {/* Reviews Section */}
      <div>
        <h3>Reviews</h3>
        {reviews.map((r, idx) => (
          <div key={idx} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
            <strong>{r.username}</strong> <strong>({r.category})</strong> - <strong>{r.date}</strong>
            <div>{"★".repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
            {r.image && <img src={r.image} alt="Review" style={{ maxWidth: "100px" }} />}
            <h5>{r.comment}</h5>
          </div>
        ))}
        <button onClick={() => user ? alert("Show Review Form") : navigate("/signup")}>Write a Review</button>
      </div>
    </div>
  );
}

export default Product;


