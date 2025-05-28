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

  const dummyImages = [
    "https://via.placeholder.com/400x300?text=Image+1",
    "https://via.placeholder.com/400x300?text=Image+2",
    "https://via.placeholder.com/400x300?text=Image+3",
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
    </div>
  );
}

export default Product;