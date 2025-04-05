import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "./redux/cartSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faMinus,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const cleanPrice = (price) => {
    if (typeof price === "number") return price;
    return parseFloat(price?.replace(/[^\d.]/g, "")) || 0;
  };

  const totalAmount = cartItems.reduce((total, item) => {
    return total + cleanPrice(item.price) * item.quantity;
  }, 0);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    toast.info("Item removed from cart 🗑️");
  };

  const handleIncrease = (item) => {
    if (item.quantity < item.stock) {
      dispatch(increaseQuantity(item.id));
      toast.success("Quantity increased ➕");
    } else {
      toast.warning(`Only ${item.stock} in stock!`);
    }
  };

  const handleDecrease = (id) => {
    dispatch(decreaseQuantity(id));
    toast.info("Quantity decreased ➖");
  };

  const handleCheckout = () => {
    toast.success("Checkout completed ✅");
    dispatch(clearCart());
  };

  return (
    <div className="cart-page">
      <h2 className="cart-title">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="empty-msg">Your cart is empty!</p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  src={item.image}
                  alt={item.title || item.name}
                  className="cart-img"
                />

                <div className="cart-info">
                  <h4 className="item-title">
                    {item.title || item.name || "Unnamed Item"}
                  </h4>

                  <div className="price-list">
                  <h5 className="price">
                    Price: ₹{cleanPrice(item.price).toFixed(2)}
                </h5>

                <h6 className="item-total">
   Total: ₹
   {(cleanPrice(item.price) * item.quantity).toFixed(2)}
 </h6>
 </div>


                <div className="flex-1">
                <div className="qty-controls">
                    <button onClick={() => handleDecrease(item.id)}>
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleIncrease(item)}>
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(item.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Remove
                  </button>
                </div>
                
                </div>

                <div className="flexing">



</div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Grand Total: ₹{totalAmount.toFixed(2)}</h3>
            <button className="checkout-btn" onClick={handleCheckout}>
              <FontAwesomeIcon icon={faCheckCircle} /> Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
